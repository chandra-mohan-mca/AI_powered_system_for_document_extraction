from transformers import pipeline

# Load BERT-based sentiment model
sentiment_pipeline = pipeline("sentiment-analysis")

def clean_text(text: str) -> str:
    return " ".join(text.split())

def analyze_sentiment(text: str) -> str:
    # Limit text size for sentiment analysis to avoid sequence length errors
    text = clean_text(text)[:512]
    
    if not text:
        return "Neutral"
        
    try:
        # Default pipeline usually returns POSITIVE/NEGATIVE
        result = sentiment_pipeline(text)[0]
        label = result['label'].upper()
        
        # Map output to required states
        if label in ["POSITIVE", "4 STARS", "5 STARS"]:
            return "Positive"
        elif label in ["NEGATIVE", "1 STAR", "2 STARS"]:
            return "Negative"
        else:
            return "Neutral"
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return "Neutral"
