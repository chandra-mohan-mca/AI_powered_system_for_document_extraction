import React, { useState } from 'react';
import { FiLayers } from 'react-icons/fi';
import UploadSection from './components/UploadSection';
import ResultsDisplay from './components/ResultsDisplay';
import RagChat from './components/RagChat';
import { processDocument } from './services/api';
import './index.css';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null); // Reset previous runs

    try {
      const result = await processDocument(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "An error occurred during document processing");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <header style={{ padding: '2rem 0', textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <FiLayers size={32} color="white" />
          </div>
        </div>
        <h1>AI-Powered Document Analysis & Extraction</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
          AI-powered system for document extraction, summarization, and intelligent querying using RAG.
        </p>
      </header>

      <main>
        {error && (
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--sentiment-negative)', marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.1)' }}>
            <h3 style={{ color: 'var(--sentiment-negative)', margin: 0 }}>Processing Error</h3>
            <p style={{ margin: 0, marginTop: '0.5rem', color: 'var(--text-main)' }}>{error}</p>
          </div>
        )}

        {/* Upload State */}
        <UploadSection onUpload={handleUpload} isProcessing={isProcessing} />

        {/* Dynamic Display State */}
        {analysisResult && (
          <div style={{ animation: 'float 0.5s ease-out forwards', animationIterationCount: 1 }}>
            <ResultsDisplay data={analysisResult} />
          </div>
        )}

        {/* Always present RAG UI but bound to state */}
        <RagChat isActive={!!analysisResult} />

      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Transforming Documents into Actionable Intelligence with AI & RAG.</p>
      </footer>
    </div>
  );
}

export default App;
