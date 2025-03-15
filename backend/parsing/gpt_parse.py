import time
import math
from typing import List, Dict, Any
from openai import OpenAI
from pydantic import BaseModel

# Create a global OpenAI client and usage counter, similar to your example
client = OpenAI()
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
# 2) Step 2.5: Revise Transcribed Text
# --------------------
def reviseTranscription(rawText: str) -> tuple[str, int]:
    """
    Takes the raw transcribed text (possibly with errors) and uses GPT to refine it.
    Returns the corrected transcription and the token usage for this request.
    """
    global totalUsage
    
    systemMessage = """
You are a transcription editor. The user has provided transcribed text that may contain errors.
Your job is to correct these errors for clarity and accuracy, preserving the original meaning.
Return the corrected text as 'correctedText' in your final JSON output.
    """

    start_time = time.time()
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",  # Adjust model as needed
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": rawText},
        ],
        max_completion_tokens=100,
        temperature=0.0,
        response_format=TranscriptionRevisionResponse
    )
    end_time = time.time()
    elapsed_time = end_time - start_time
    
    usage = completion.usage.total_tokens
    totalUsage += usage
    
    # The .parsed attribute is already an instance of TranscriptionRevisionResponse
    response = completion.choices[0].message.parsed
    
    print(f"[{elapsed_time:.2f}s] reviseTranscription -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.15/1e6 * totalUsage, 5)}")
    print("Revision Response:", response)
    
    return response.correctedText, usage

# --------------------
# 3) Step 3 & 4: Extract/Revise Attributes into JSON
# --------------------
def extractAttributesFromText(correctedText: str, templateAttributes: List[str]) -> tuple[Dict[str, str], int]:
    """
    Takes the refined transcription and a list of attribute names.
    Uses GPT to find the best value for each attribute within the text.
    Returns a dictionary of { attribute: value } and the token usage.
    """
    global totalUsage
    
    systemMessage = f"""
You are an attribute extraction assistant. 
Given a corrected transcription and a list of attributes, 
find if any of the attributes have a relevant value present in the text and store them. 

If an attribute cannot be found, do not add that attribute to the result.

Return your result as a JSON with key 'parsedAttributes' 
where each attribute maps to its value.

Attributes to find: {templateAttributes}
    """

    start_time = time.time()
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",  # Adjust model as needed
        messages=[
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": correctedText},
        ],
        max_completion_tokens=200,
        temperature=0.0,
        response_format=AttributeExtractionResponse
    )
    end_time = time.time()
    elapsed_time = end_time - start_time
    
    usage = completion.usage.total_tokens
    totalUsage += usage
    
    # The .parsed attribute is already an instance of AttributeExtractionResponse
    response = completion.choices[0].message.parsed
    
    print(f"[{elapsed_time:.2f}s] extractAttributesFromText -> Usage: {usage}, Total Usage: {totalUsage}, "
          f"Cost: ${round(0.15/1e6 * totalUsage, 5)}")
    print("Extraction Response:", response)
    
    return response.parsedAttributes, usage

# --------------------
# 4) Orchestrator: Steps 2–6
# --------------------
def parseTranscribedText(transcribedText: str, templateAttributes: List[str]) -> Dict[str, Any]:
    """
    High-level function that:
    (1) Revises the transcription (Step 2.5).
    (2) Extracts attribute values into a JSON structure (Steps 3 & 4).
    (3) Returns the final JSON object with the found attributes (Step 6).
    
    In your actual flow, you could then print or convert this JSON to PDF.
    """
    # Step 2.5: Revise the transcription
    correctedText, _ = reviseTranscription(transcribedText)
    
    # Step 3 & 4: Extract attributes and fill JSON
    parsedAttributes, _ = extractAttributesFromText(correctedText, templateAttributes)
    
    # Step 6: Return final JSON (in practice, you might generate a PDF here)
    return {
        "correctedText": correctedText,
        "attributes": parsedAttributes
    }
    



