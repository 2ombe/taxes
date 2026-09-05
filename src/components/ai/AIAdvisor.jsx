import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaRobot, FaTimes, FaPaperPlane, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const SUGGESTIONS = [
  'What is deductible under Article 24?',
  'Rwanda VAT registration threshold?',
  'How is PAYE calculated in 2025?',
  'What are the depreciation rates?',
  'When is CIT return due?',
  'Explain loss carryforward rules.',
];

const AIAdvisor = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "👋 Hello! I'm your AGN Tax AI Advisor, powered by Gemini. I specialize in **Rwanda tax law** — CIT (Articles 24–31), VAT (18%), PAYE 2025 bands, and WHT. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg = { id: Date.now(), role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userText, history: messages.slice(-6) }),
      });

      if (!res.ok) throw new Error('AI service unavailable');
      const data = await res.json();

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: data.reply }]);
    } catch (err) {
      // Fallback local responses for key topics
      const fallbacks = {
        'deductib': 'Under **Article 24**, expenses are deductible if they are:\n• Incurred wholly and exclusively for business\n• Supported by documentation\n• Not specifically excluded under Article 25 (fines, penalties, personal expenses, donations)',
        'vat': '**Rwanda VAT** is levied at 18% on standard-rated supplies. The registration threshold is **RWF 20 million** annual turnover. Exports are zero-rated (0%) and certain supplies are exempt.',
        'paye': '**2025 PAYE Monthly Bands:**\n• 0% — Up to RWF 60,000\n• 20% — RWF 60,001 to 100,000\n• 30% — Above RWF 100,000\n\nPlus: RSSB employee (5%) and CBHI (0.5%) are deducted before PAYE.',
        'depreciat': '**Rwanda Tax Depreciation Rates (declining balance):**\n• Land & Buildings: 5%\n• Furniture & Equipment: 10%\n• Heavy Machinery & Vehicles: 25%\n• Computers & Software: 50%\n• Other Assets: 20%',
        'loss': '**Article 31 — Loss Carryforward:**\nTax losses can be carried forward for up to **5 years**. Losses are applied in chronological order (oldest first). Losses cannot be carried back.',
        'wht': '**Rwanda WHT Rates:**\n• Dividends: 15%\n• Interest: 15%\n• Royalties: 15%\n• Services to non-residents: 15%\n• Resident individual services: 3%\n\nRemit to RRA by 15th of the following month.',
        'cit': 'The **Corporate Income Tax (CIT)** rate in Rwanda is **30%** on taxable income. The computation follows Articles 24–31 of the Income Tax Law: start with accounting profit, add non-deductibles (Art 25), adjust depreciation (Art 27-28), apply losses (Art 31).',
      };
      const lowerText = userText.toLowerCase();
      const fallbackKey = Object.keys(fallbacks).find(k => lowerText.includes(k));
      const fallbackMsg = fallbackKey ? fallbacks[fallbackKey] : "I'm currently operating in offline mode. Please check your backend connection. I can still help with basic Rwanda tax questions — ask about CIT, VAT, PAYE, WHT, or depreciation.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: fallbackMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const renderContent = (content) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
          part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part
        )}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="ai-chat-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaRobot size={18} />
                </div>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>AGN Tax AI Advisor</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Rwanda Tax Law Expert • Powered by Gemini</div>
                </div>
              </div>
              <button className="ms-auto bg-transparent border-0 text-white p-0" onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  <div className="bubble">{renderContent(msg.content)}</div>
                </div>
              ))}
              {loading && (
                <div className="chat-message ai">
                  <div className="bubble">
                    <div className="typing-indicator"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            {messages.length <= 2 && (
              <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #f1f1f1' }}>
                <div style={{ fontSize: '0.7rem', color: '#999', marginBottom: 6 }}>Suggested questions</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {SUGGESTIONS.slice(0, 4).map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} disabled={loading}
                      style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', cursor: 'pointer', color: '#495057', transition: 'all 0.2s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Rwanda tax law..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}
              >
                {loading ? <Spinner size="sm" style={{ width: 14, height: 14, borderColor: '#fff', borderRightColor: 'transparent' }} /> : <FaPaperPlane size={14} style={{ color: '#fff' }} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        className="ai-chat-bubble"
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="AGN Tax AI Advisor"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FaChevronDown color="#fff" size={20} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FaRobot color="#fff" size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIAdvisor;
