import React from 'react';
import { FiAlignLeft, FiActivity, FiUsers } from 'react-icons/fi';
import '../index.css';

const ResultsDisplay = ({ data }) => {
  if (!data) return null;

  const { fileName, summary, entities, sentiment } = data;

  const getSentimentClass = (s) => {
    if (s.toLowerCase() === 'positive') return 'sentiment-badge positive';
    if (s.toLowerCase() === 'negative') return 'sentiment-badge negative';
    return 'sentiment-badge neutral';
  };

  const getEntityStyle = (label) => {
    const l = label.toLowerCase();
    if (l.includes('person')) return { background: 'var(--entity-person)', color: 'var(--entity-person-text)' };
    if (l.includes('org')) return { background: 'var(--entity-org)', color: 'var(--entity-org-text)' };
    if (l.includes('date')) return { background: 'var(--entity-date)', color: 'var(--entity-date-text)' };
    if (l.includes('money')) return { background: 'var(--entity-money)', color: 'var(--entity-money-text)' };
    return { background: 'var(--entity-default)', color: 'var(--entity-default-text)' };
  };

  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Overview Card */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Analyzed File</p>
          <h3 style={{ margin: 0, marginTop: '0.25rem' }}>{fileName}</h3>
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Document Sentiment</p>
          <span className={getSentimentClass(sentiment)}>
             {sentiment}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Summary Card */}
        <div className="glass-panel">
          <h2><FiAlignLeft color="var(--primary-color)" /> AI Summary</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-main)' }}>{summary}</p>
        </div>

        {/* Entities Card */}
        <div className="glass-panel">
          <h2><FiUsers color="var(--secondary-color)" /> Named Entities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
            {entities && entities.length > 0 ? (
                entities.map((ent, idx) => (
                    <div key={idx} style={{ 
                        ...getEntityStyle(ent.label),
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        border: '1px solid currentColor',
                        opacity: 0.8
                    }}>
                        <strong>{ent.text}</strong> {/* <span style={{opacity: 0.7, fontSize: '0.75rem', marginLeft: '0.25rem'}}>{ent.label}</span> */}
                    </div>
                ))
            ) : (
                <p>No major entities detected.</p>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ResultsDisplay;
