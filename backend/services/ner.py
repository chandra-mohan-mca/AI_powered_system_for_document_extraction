import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash-latest")

def extract_entities(text: str):
    prompt = f"""
    Extract named entities (PERSON, ORG, DATE, MONEY).

    Return JSON format:
    [
      {{"text": "example", "label": "PERSON"}}
    ]

    Text:
    {text[:1000]}
    """

    response = model.generate_content(prompt)

    try:
        return json.loads(response.text)
    except:
        return []
