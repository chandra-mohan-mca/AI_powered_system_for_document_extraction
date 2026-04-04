import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

context_store = ""

def add_document_to_rag(text: str):
    global context_store
    context_store = text[:3000]

def query_rag(query: str) -> str:
    prompt = f"""
    Answer based ONLY on the document.

    Document:
    {context_store}

    Question:
    {query}
    """

    response = model.generate_content(prompt)
    return response.text
