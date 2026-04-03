import spacy
from transformers import pipeline

# Load SpaCy transformer-based model
# Fallback to sm if trf is not downloaded, though we expect trf
try:
    nlp = spacy.load("en_core_web_trf")
except OSError:
    # If not installed, we fallback to a simple spacy load or error handling
    # The setup should have run: python -m spacy download en_core_web_trf
    print("Warning: en_core_web_trf not found. Trying en_core_web_sm.")
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        nlp = spacy.blank("en")

# HuggingFace NER pipeline as the hybrid part
# Using a general NER model from huggingface
hf_ner = pipeline("ner", aggregation_strategy="simple")

def clean_text(text: str) -> str:
    # Basic cleaning
    return " ".join(text.split())

def extract_entities(text: str):
    # Limit text size
    text = clean_text(text)[:1000]
    
    entities_extracted = {}
    
    # 1. SpaCy Extraction
    doc = nlp(text)
    wanted_labels = {"PERSON", "DATE", "ORG", "MONEY"}
    for ent in doc.ents:
        if ent.label_ in wanted_labels:
            entities_extracted[ent.text] = ent.label_
            
    # 2. HuggingFace Extraction
    # hf_ner returns dicts like {'entity_group': 'PER', 'word': 'John Doe', ...}
    hf_results = hf_ner(text)
    hf_label_map = {
        "PER": "PERSON",
        "ORG": "ORG",
        "LOC": "LOCATION",
        "MISC": "MISC"
    }
    
    for res in hf_results:
        label = hf_label_map.get(res['entity_group'], res['entity_group'])
        word = res['word']
        # Prioritize wanted labels and avoid overwriting if already exists with a valid label
        if word not in entities_extracted and label in wanted_labels:
            entities_extracted[word] = label

    # Format output
    result = []
    for text_val, label_val in entities_extracted.items():
        result.append({"text": text_val, "label": label_val})
        
    return result
