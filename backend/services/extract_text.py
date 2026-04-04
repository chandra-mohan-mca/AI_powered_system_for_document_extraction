import io
import fitz  # PyMuPDF
import docx

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
    return "Image text extraction not supported in free deployment"
