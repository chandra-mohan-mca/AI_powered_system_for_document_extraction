import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { chatWithDocument } from '../services/api';
import '../index.css';

const RagChat = ({ isActive }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I've analyzed your document. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isActive) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithDocument(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error communicating with the RAG backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) {
      return (
          <div className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5 }}>
              <FiMessageSquare size={32} style={{ marginBottom: '1rem' }}/>
              <h3>Ask Question about Document</h3>
              <p>Upload a document first to start chatting contextually.</p>
          </div>
      );
  }

  return (
    <div className="glass-panel" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', height: '400px', padding: 0, overflow: 'hidden' }}>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}><FiMessageSquare color="var(--primary-color)" /> RAG Document Chat</h2>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            borderBottomRightRadius: msg.role === 'user' ? '4px' : 'var(--radius-lg)',
            borderBottomLeftRadius: msg.role === 'ai' ? '4px' : 'var(--radius-lg)',
            background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'var(--bg-input)',
            border: msg.role === 'ai' ? '1px solid var(--border-color)' : 'none',
            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <p style={{ margin: 0, color: 'inherit' }}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
            <div style={{ alignSelf: 'flex-start', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', gap: '0.25rem' }}>
                   <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
                   <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Thinking...</span>
               </div>
            </div>
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={isLoading}
            style={{ flex: 1, borderRadius: '9999px', paddingLeft: '1.5rem', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ borderRadius: '50%', padding: '0.75rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiSend />
          </button>
        </form>
      </div>

    </div>
  );
};

export default RagChat;
