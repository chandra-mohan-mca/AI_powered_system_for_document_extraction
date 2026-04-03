import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import '../index.css';

const UploadSection = ({ onUpload, isProcessing }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !isProcessing) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'center', transition: 'border 0.3s', 
      border: dragActive ? '2px dashed var(--primary-color)' : '1px solid var(--border-color)',
      position: 'relative'
    }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".pdf,.docx,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      <div style={{ padding: '2rem 1rem' }}>
        {selectedFile ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <FiFileText size={48} color="var(--primary-color)" />
                <p>Selected: <strong>{selectedFile.name}</strong></p>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-color)'}} onClick={() => setSelectedFile(null)}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing ? 'Processing AI Models...' : 'Analyze Document'}
                    </button>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <FiUploadCloud size={64} color="var(--text-muted)" style={{ marginBottom: '1rem'}} />
                <h2>Upload your document</h2>
                <p>Drag and drop your PDF, DOCX, or Images here, or click to browse.</p>
                <button className="btn-primary" onClick={onButtonClick} style={{ marginTop: '1rem' }}>
                    Browse Files
                </button>
            </div>
        )}
      </div>
      
      {isProcessing && (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(11, 15, 25, 0.8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-lg)', zIndex: 10, backdropFilter: 'blur(4px)'
        }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }} className="spinner"></div>
            <p className="pulsing-text" style={{ marginTop: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Extracting & Analyzing with AI...</p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
