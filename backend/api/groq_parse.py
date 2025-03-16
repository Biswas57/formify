import time
import math
import json
from typing import List, Dict, Any
from groq import Groq
from pydantic import BaseModel

# Create a global Groq client and usage counter.
client = Groq(
    api_key="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"
)
totalUsage = 0

# --------------------
# 1) Pydantic Models
# --------------------
class TranscriptionRevisionResponse(BaseModel):
    """Model for step 2.5 - Correcting or refining the transcription."""
    correctedText: str

class AttributeExtractionResponse(BaseModel):
    """
    Model for step 3 & 4 - Parsing the text to find values for each template attribute.
    The 'parsedAttributes' field is a dictionary of { attribute_name: extracted_value }.
    """
    parsedAttributes: Dict[str, str]

# --------------------
# 2) Step 2: Revise Transcribed Text
# --------------------
def reviseTranscription(rawText: str) -> tuple[str, int]:
    """
    Takes the raw transcribed text (possibly with errors) and uses GPT via Groq to refine it.
    Returns the corrected transcription and the token usage for this request.
    """
    global totalUsage

    systemMessage = """
You are a transcription editor. The user has provided transcribed text that may contain errors.
Your job is to correct these errors for clarity and accuracy, preserving the original meaning.
Return the corrected text as a JSON object with the key "correctedText".
Do not include any markdown formatting, code fences, or extra characters; return pure JSON.
    """

    start_time = time.time()
    # Use Groq's completions.create method.
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Adjust model as needed
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": rawText},
        ],
        max_tokens=100,
        temperature=0.0,
    )
    end_time = time.time()
    elapsed_time = end_time - start_time

    # Using dot notation to access response attributes.
    usage = completion.usage.total_tokens
    totalUsage += usage

    response_text = completion.choices[0].message.content
    
    try:
        # Parse the JSON string into our Pydantic model.
        parsed_response = TranscriptionRevisionResponse.parse_raw(response_text)
    except Exception as e:
        print("Error parsing JSON in reviseTranscription:", e)
        # Fallback: use the raw response text.
        parsed_response = TranscriptionRevisionResponse(correctedText=response_text)
    
    print(f"\n[{elapsed_time:.2f}s] reviseTranscription -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.15/1e6 * totalUsage, 5)}")
    print("\nRevision Response:", parsed_response)
    
    return parsed_response.correctedText, usage

# --------------------
# 3) Step 3: Extract/Revise Attributes into JSON
# --------------------
def extractAttributesFromText(correctedText: str, templateAttributes: List[str]) -> tuple[Dict[str, str], int]:
    """
    Takes the refined transcription and a list of attribute names.
    Uses Groq to find the best value for each attribute within the text.
    Returns a dictionary of { attribute: value } and the token usage.
    """
    global totalUsage

    systemMessage = f"""
You are an attribute extraction assistant. 
Given a corrected transcription and a list of attributes, 
find if any of the attributes have a relevant value present in the text and store them.
If an attribute cannot be found, do not add that attribute to the result.
If an attribute appears multiple times record the most suitable record 
Return your result as a JSON object with the key "parsedAttributes" 
where each attribute maps to its value.
Do not include any markdown formatting, code fences, or extra characters; return pure JSON.
Attributes to find: {templateAttributes}
    """

    start_time = time.time()
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": correctedText},
        ],
        max_tokens=200,
        temperature=0.0,
    )
    end_time = time.time()
    elapsed_time = end_time - start_time

    usage = completion.usage.total_tokens
    totalUsage += usage

    response_text = completion.choices[0].message.content
    
    try:
        parsed_response = AttributeExtractionResponse.parse_raw(response_text)
    except Exception as e:
        print("Error parsing JSON in extractAttributesFromText:", e)
        parsed_response = AttributeExtractionResponse(parsedAttributes={})
    
    print(f"\n[{elapsed_time:.2f}s] extractAttributesFromText -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.15/1e6 * totalUsage, 5)}")
    print("\nExtraction Response:", parsed_response)
    
    return parsed_response.parsedAttributes, usage


def parseFullTranscriptandAttributes(fullTranscript: str, collectedAttributes: list[dict]) -> dict:
    """
    Given the full transcript and a list of attribute dictionaries extracted
    over multiple rounds, determine the most relevant value for each attribute.
    The method works by:
      1. Collecting all candidate values for each attribute.
      2. Counting how often each candidate appears.
      3. Preferring the candidate that occurs most frequently and ensuring it is
         mentioned in the full transcript.
    Returns a dictionary mapping attribute names to their selected values.
    """
    final_attributes = {}
    candidate_values = {}

    # Gather all candidate values from each dictionary
    for attr_dict in collectedAttributes:
        for key, value in attr_dict.items():
            if key not in candidate_values:
                candidate_values[key] = []
            candidate_values[key].append(value)

    # For each attribute, select the candidate that is most frequent
    for key, values in candidate_values.items():
        # Count frequency of each candidate value.
        freq = {}
        for value in values:
            freq[value] = freq.get(value, 0) + 1

        # Choose candidate with highest frequency.
        best_candidate = max(freq.items(), key=lambda x: x[1])[0]

        final_attributes[key] = best_candidate

    return final_attributes


# --------------------
# 4) Orchestrator: Steps 2–6
# --------------------
def parseTranscribedText(transcribedText: str, templateAttributes: List[str]):
    """
    High-level function that:
    (1) Revises the transcription (Step 2.5).
    (2) Extracts attribute values into a JSON structure (Steps 3 & 4).
    (3) Returns the final JSON object with the found attributes (Step 6).
    
    In your actual flow, you might convert this JSON to PDF.
    """
    # Step 2.5: Revise the transcription.
    correctedText, _ = reviseTranscription(transcribedText)
    
    # Step 3 & 4: Extract attributes and fill JSON.
    parsedAttributes, _ = extractAttributesFromText(correctedText, templateAttributes)
    
    # Step 6: Return final JSON.
    return correctedText, parsedAttributes
    # return {
    #     "correctedText": correctedText,
    #     "attributes": parsedAttributes
    # }