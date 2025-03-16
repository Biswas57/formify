import time
import math
import json
import os
from typing import List, Dict, Any
import openai
from pydantic import BaseModel

# Set the OpenAI API key.
openai.api_key = os.getenv("OPENAI_API_KEY")
totalUsage = 0

# --------------------
# 1) Pydantic Models
# --------------------
class TranscriptionRevisionResponse(BaseModel):
    """Model for step 2 - Correcting or refining the transcription."""
    correctedText: str

class AttributeExtractionResponse(BaseModel):
    """
    Model for step 3 & 4 - Parsing the text to find values for each template attribute.
    The 'parsedAttributes' field is a dictionary of { attribute_name: extracted_value }.
    """
    parsedAttributes: Dict[str, str]
    
class FinalAttributeExtractionResponse(BaseModel):
    """
    Model for final attribute selection.
    The 'finalAttributes' field is a dictionary of { attribute_name: final_selected_value }.
    """
    finalAttributes: Dict[str, str]

# --------------------
# 2) Step 2: Revise Transcribed Text
# --------------------
def reviseTranscription(rawText: str) -> tuple[str, int]:
    """
    Takes the raw transcribed text (possibly with errors) and uses GPT to refine it.
    Returns the corrected transcription and the token usage for this request.
    """
    global totalUsage

    systemMessage = """
You are a transcription editor working in a professional, Australian context where meetings often involve topics 
in finance, healthcare, or social work and human resources. The user has provided transcribed text that may contain errors. 
Your job is to correct these errors for clarity and accuracy while preserving the original meaning 
and the formal tone expected in these settings. Return the corrected text as a JSON object with the key "correctedText". 
Do not include any markdown formatting, code fences, or extra characters; return pure JSON.
"""

    start_time = time.time()
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Cost-effective model for revision.
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": rawText},
        ],
        max_tokens=100,
        temperature=0.0,
    )
    end_time = time.time()
    elapsed_time = end_time - start_time

    usage = completion["usage"]["total_tokens"]
    totalUsage += usage

    response_text = completion["choices"][0]["message"]["content"]
    
    try:
        parsed_response = TranscriptionRevisionResponse.parse_raw(response_text)
    except Exception as e:
        print("Error parsing JSON in reviseTranscription:", e)
        parsed_response = TranscriptionRevisionResponse(correctedText=response_text)
    
    print(f"\n[{elapsed_time:.2f}s] reviseTranscription -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.002/1e6 * totalUsage, 5)}")
    print("\nRevision Response:", parsed_response)
    
    return parsed_response.correctedText, usage

# --------------------
# 3) Step 3: Extract/Revise Attributes into JSON
# --------------------
def extractAttributesFromText(correctedText: str, templateAttributes: List[str]) -> tuple[Dict[str, str], int]:
    """
    Takes the refined transcription and a list of attribute names.
    Uses GPT to find the best value for each attribute within the text.
    Returns a dictionary of { attribute: value } and the token usage.
    """
    global totalUsage

    systemMessage = f"""
You are an attribute extraction assistant specialized for an Australian environment.
This tool is primarily used in Finance, Healthcare, Social Work and Human Resource contexts.
Your task is to extract only the relevant values for the provided attributes from the corrected transcription,
ensuring that you filter out any irrelevant information that might result from audio errors.
Given the transcript and a list of attributes, find if any of the attributes have a relevant value present in the text.
If an attribute cannot be found, do not include it in your result.
If an attribute appears multiple times, record the most contextually appropriate value based on the meeting context.
Return your result as a JSON object with the key "parsedAttributes" where each attribute maps to its value.
Do not include any markdown formatting, code fences, or extra characters; return pure JSON.
Attributes to find: {templateAttributes}
"""

    start_time = time.time()
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Cost-effective model for attribute extraction.
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": correctedText},
        ],
        max_tokens=200,
        temperature=0.0,
    )
    end_time = time.time()
    elapsed_time = end_time - start_time

    usage = completion["usage"]["total_tokens"]
    totalUsage += usage

    response_text = completion["choices"][0]["message"]["content"]
    
    try:
        parsed_response = AttributeExtractionResponse.parse_raw(response_text)
    except Exception as e:
        print("Error parsing JSON in extractAttributesFromText:", e)
        parsed_response = AttributeExtractionResponse(parsedAttributes={})
    
    print(f"\n[{elapsed_time:.2f}s] extractAttributesFromText -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.002/1e6 * totalUsage, 5)}")
    print("\nExtraction Response:", parsed_response)
    
    return parsed_response.parsedAttributes, usage

def parseFinalAttributes(fullTranscript: str, collectedAttributes: list[dict]) -> dict:
    """
    Given the full transcript and a list of candidate attribute dictionaries extracted over multiple rounds,
    use the OpenAI API to determine the most appropriate value for each attribute based on the full transcript context.
    This function returns a final attributes dictionary mapping each attribute name to its chosen value.
    """
    global totalUsage

    systemMessage = f"""
You are an attribute selection assistant.
You are provided with a full transcript of a meeting and a list of candidate attribute dictionaries extracted from the transcript.
Your task is to determine the final, most suitable value for each attribute based on the context provided by the full transcript.
For example, if the attribute is "name", ensure that you select the value that corresponds to the transcript subject or the relevant individual.
Return your result as a JSON object with the key "finalAttributes" where each attribute maps to its final selected value.
Do not include any markdown formatting, code fences, or extra characters; return pure JSON.
Transcript:
{fullTranscript}

Candidate Attributes:
{collectedAttributes}
"""

    start_time = time.time()
    completion = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": systemMessage},
        ],
        max_tokens=300,
        temperature=0.0,
    )
    end_time = time.time()
    elapsed_time = end_time - start_time

    usage = completion["usage"]["total_tokens"]
    totalUsage += usage

    response_text = completion["choices"][0]["message"]["content"]

    try:
        parsed_response = FinalAttributeExtractionResponse.parse_raw(response_text)
    except Exception as e:
        print("Error parsing JSON in parseFinalAttributes:", e)
        parsed_response = FinalAttributeExtractionResponse(finalAttributes={})

    print(f"\n[{elapsed_time:.2f}s] parseFinalAttributes -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.06/1e6 * totalUsage, 5)}")
    print("\nFinal Attribute Extraction Response:", parsed_response)

    return parsed_response.finalAttributes

# --------------------
# 4) Orchestrator: Steps 2–6
# --------------------
def parseTranscribedText(transcribedText: str, templateAttributes: List[str]):
    """
    High-level function that:
    (1) Revises the transcription (Step 2).
    (2) Extracts attribute values into a JSON structure (Steps 3 & 4).
    (3) Returns the final JSON object with the found attributes (Step 5).
    (4) Revise final full transcript (Step 6) if needed.
    In your actual flow, you might convert this JSON to PDF.
    """
    # Step 2: Revise the transcription.
    correctedText, _ = reviseTranscription(transcribedText)
    
    # Step 3 & 4: Extract attributes.
    parsedAttributes, _ = extractAttributesFromText(correctedText, templateAttributes)
    
    # Step 5: Return the results.
    return correctedText, parsedAttributes
    
