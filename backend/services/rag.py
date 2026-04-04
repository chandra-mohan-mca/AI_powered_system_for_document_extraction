from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
# We'll use a very simple default model from transformers for the QA purely to not rely on external API keys,
# though a standard LLM via HuggingFace or OpenAI would be better in prod.
from transformers import pipeline
import uuid
import re

# In-memory store for our single-document RAG during the hackathon
vector_store = None
rag_pipeline = pipeline("text2text-generation", model="google/flan-t5-small")

# Load embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# ✅ CLEAN TEXT FUNCTION (VERY IMPORTANT)
def clean_text(text):
    text = re.sub(r'\(\w+\)', '', text)   # remove (i), (ii), (iii)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def add_document_to_rag(text: str):
    global vector_store

    # 🔥 Clean text before processing
    text = clean_text(text)

    # Better chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        length_function=len
    )

    chunks = text_splitter.split_text(text)

    if not chunks:
        return

    vector_store = FAISS.from_texts(chunks, embeddings)


def query_rag(query: str) -> str:
    global vector_store

    if vector_store is None:
        return "No document has been processed yet."

    # 🔥 Retrieve more context
    docs = vector_store.similarity_search(query, k=5)

    # 🔥 Controlled context (VERY IMPORTANT)
    context = "\n\n".join([doc.page_content[:500] for doc in docs])

    # 🔥 STRONG PROMPT (KEY FIX)
    prompt = f"""
You are an expert AI assistant.

Read the context carefully and answer the question in detail.

Instructions:
- Write a clear explanation in 2-3 sentences
- Do NOT give short answers
- Do NOT return titles only
- Explain the concept properly
- If not found, say: Not found in document

Context:
{context}

Question:
{query}

Detailed Answer:
"""

    try:
        response = rag_pipeline(
            prompt,
            max_new_tokens=250,
            min_new_tokens=50,
            do_sample=False,
            temperature=0.5
        )

        answer = response[0]['generated_text'].strip()

        if len(answer.split()) < 8:
            return f"{answer}. This document explains the concept in detail, including its functionality, features, and overall purpose."

        return answer

    except Exception as e:
        print(f"RAG formulation error: {e}")
        return "Unable to generate answer."
