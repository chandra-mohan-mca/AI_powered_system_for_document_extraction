import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_sentiment(text: str) -> str:
    prompt = f"""
    Classify sentiment as Positive, Negative or Neutral.

    Text:
    {text[:1000]}
    """

    response = model.generate_content(prompt)
    return response.text.strip()
