import io
import fitz  # PyMuPDF
import docx
import easyocr
import cv2
import numpy as np

# Initialize EasyOCR Reader (CPU mode depending on environment)
reader = easyocr.Reader(['en'], gpu=False)

def preprocess_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply simple thresholding to improve OCR accuracy
    # cv2.threshold can be tuned based on common document types
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    
    return thresh

def extract_text_from_file(filename: str, content: bytes) -> str:
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return extract_from_pdf(content)
    elif filename_lower.endswith('.docx'):
        return extract_from_docx(content)
    elif filename_lower.endswith(('.png', '.jpg', '.jpeg')):
        return extract_from_image(content)
    else:
        # Fallback to attempting to read as plain text
        try:
            return content.decode('utf-8')
        except Exception:
            raise ValueError("Unsupported file format.")

def extract_from_pdf(content: bytes) -> str:
    text = ""
    pdf_document = fitz.open(stream=content, filetype="pdf")
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        text += page.get_text()
    return text.strip()

def extract_from_docx(content: bytes) -> str:
    doc = docx.Document(io.BytesIO(content))
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def extract_from_image(content: bytes) -> str:
    processed_img = preprocess_image(content)
    results = reader.readtext(processed_img, detail=0)
    return " ".join(results)
