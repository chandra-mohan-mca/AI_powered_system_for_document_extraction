from transformers import pipeline

# Load BART summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def clean_text(text: str) -> str:
    return " ".join(text.split())

def summarize_text(text: str) -> str:
    text = clean_text(text)
    if len(text) < 50:
        return text  # Too short to summarize
        
    # BART max token length is 1024, approximately 4000 characters
    chunk_size = 3500
    overlap = 200
    chunks = []
    
    # Simple character chunking for summarization
    start = 0
    while start < len(text):
        chunks.append(text[start:start+chunk_size])
        start += chunk_size - overlap
        
    # Summarize each chunk
    chunk_summaries = []
    for chunk in chunks:
        try:
            # max_length and min_length dynamically set based on input length
            input_length = len(chunk) // 4  # rough estimate of tokens
            max_len = min(130, input_length)
            min_len = min(30, max_len - 10)
            
            summary = summarizer(chunk, max_length=max_len, min_length=min_len, do_sample=False)
            chunk_summaries.append(summary[0]['summary_text'])
        except Exception as e:
            print(f"Error summarizing chunk: {e}")
            
    final_summary = " ".join(chunk_summaries)
    
    # If the combined summary is still too long, summarize it again
    if len(final_summary) > chunk_size:
        try:
            final_summary = summarizer(final_summary[:chunk_size], max_length=150, min_length=40, do_sample=False)[0]['summary_text']
        except Exception as e:
            print(f"Error in final summarization: {e}")
            
    return final_summary
