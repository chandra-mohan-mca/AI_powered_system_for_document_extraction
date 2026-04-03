# 🚀 AI powered system for document extraction

## 📌 Overview

IntelliDoc AI is an end-to-end AI-powered document intelligence platform designed to transform unstructured documents into actionable insights. The system supports multi-format document processing (PDF, DOCX, Images) and leverages advanced AI techniques such as OCR, NLP, and Retrieval-Augmented Generation (RAG) to extract, analyze, and interact with document content intelligently.

---

## 🎯 Problem Statement

Organizations deal with large volumes of unstructured documents, making it difficult to extract meaningful information efficiently. Manual processing is time-consuming, error-prone, and not scalable.

---

## 💡 Solution

IntelliDoc AI automates document understanding by:

* Extracting text from multiple formats
* Summarizing large documents
* Identifying key entities (names, dates, organizations, etc.)
* Performing sentiment analysis
* Enabling intelligent Q&A using RAG-based chatbot

---

## ⚙️ Key Features

### 🔍 Document Processing

* Supports PDF, DOCX, and image files
* OCR-based text extraction (EasyOCR)

### 🧠 AI-Powered Analysis

* Text summarization using Transformer models
* Named Entity Recognition (NER)
* Sentiment analysis

### 🤖 RAG-Based Chatbot

* Context-aware question answering
* Uses vector database (FAISS) for retrieval
* Prevents hallucination with grounded responses

### ⚡ Performance Optimization

* Chunk-based document processing
* Controlled token handling
* Efficient embedding using MiniLM

---

## 🏗️ System Architecture

User Upload → Text Extraction → Preprocessing →
AI Analysis (Summary + NER + Sentiment) →
Vector Storage (FAISS) → RAG Query → Response

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* LangChain
* FAISS (Vector Database)
* Hugging Face Transformers

### Frontend

* React (Vite)
* Axios

### AI Models

* FLAN-T5 (Text Generation / RAG)
* DistilBERT (Sentiment Analysis)
* BERT NER Model
* EasyOCR (Text Extraction)

---

## 🔐 API Authentication

Secure API access is implemented using header-based API key validation to ensure only authorized requests are processed.

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Vercel

---

## 🚀 How to Run Locally

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Evaluation Metrics

* Summary Accuracy
* Entity Extraction Precision
* Sentiment Classification Accuracy
* RAG Response Relevance

---

## 🧪 Sample Use Cases

* Legal document analysis
* Resume parsing
* Financial report summarization
* Customer feedback analysis

---

## 🎯 Future Enhancements

* Multi-language support
* Real-time streaming responses
* Cloud-based scalable vector storage
* Advanced LLM integration (GPT-level models)

---

## 🏆 Conclusion

IntelliDoc AI demonstrates how modern AI techniques can be integrated into a unified system to solve real-world document processing challenges efficiently and intelligently.
