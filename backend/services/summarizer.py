import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def summarize_text(text: str) -> str:
    response = model.generate_content(f"Summarize this document:\n{text[:2000]}")
    return response.text
