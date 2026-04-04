import os
import logging
from fastapi import FastAPI, Depends, HTTPException, status, Security, UploadFile, File
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import fitz
import docx
import uvicorn
import os

# Setup explicit debugging logs as requested
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

from services.extract_text import extract_text_from_file
from services.ner import extract_entities
from services.sentiment import analyze_sentiment
from services.summarizer import summarize_text
from services.rag import add_document_to_rag, query_rag

app = FastAPI(title="AI-Powered Document Analysis API")

# 2. PROPERLY HOOKED CORS
logger.info("Initializing FastAPI with unrestricted CORS middleware for development...")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.1.64:5173"], # Explicit origins to allow credentials securely
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

API_KEY = os.getenv("API_KEY", "123456")
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    logger.warning("Authentication failed: Invalid or missing x-api-key")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )

class Entity(BaseModel):
    text: str
    label: str

class ProcessedResponse(BaseModel):
    status: str
    fileName: str
    summary: str
    entities: List[Entity]
    sentiment: str

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/process/", response_model=ProcessedResponse)
async def process_document(file: UploadFile = File(...), api_key: str = Depends(get_api_key)):
    try:
        logger.info(f"Received processing request for file: {file.filename}")
        
        # 1. Extract Text
        content = await file.read()
        logger.info(f"File {file.filename} read successfully. Extracting text...")
        extracted_text = extract_text_from_file(file.filename, content)
        
        # 2. Add to RAG
        logger.info("Adding extracted text to RAG Vector Store...")
        add_document_to_rag(extracted_text)
        
        # 3. NLP Pipeline
        logger.info("Executing NLP Pipeline (Summarization, NER, Sentiment)...")
        summary = summarize_text(extracted_text)
        entities = extract_entities(extracted_text)
        sentiment = analyze_sentiment(extracted_text)
        
        logger.info("NLP Pipeline executed successfully. Returning structured JSON data.")
        return ProcessedResponse(
            status="success",
            fileName=file.filename,
            summary=summary,
            entities=entities,
            sentiment=sentiment
        )
    except Exception as e:
        logger.error(f"Error during document processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest, api_key: str = Depends(get_api_key)):
    try:
        logger.info(f"Received RAG Chat Query: {request.query}")
        answer = query_rag(request.query)
        logger.info("Successfully formulated RAG response.")
        return ChatResponse(answer=answer)
    except Exception as e:
        logger.error(f"Error formulating RAG response: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # important for cloud
    uvicorn.run(app, host="0.0.0.0", port=port)
