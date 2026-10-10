import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, ShieldAlert, Sparkles, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const EcoGuideChatbot = ({ caseContext = null }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history');
      if (res.data.success && res.data.history.length > 0) {
        setMessages(res.data.history);
      } else {
        // Starter Welcome Message
        setMessages([
          {
            sender: 'assistant',
            message: caseContext
              ? `👋 Hello! I'm EcoGuide. I noticed you're looking at **${caseContext.productName}** (${caseContext.category}). How can I help with data wiping, battery safety, or understanding your assessment report?`
              : `👋 Hello! I am **EcoGuide**, your AI E-Waste Assistant. Ask me about device repairability, battery hazard warnings, secure data erasing, or tracking your collection!`,
            isRuleBased: true,
            metadata: {
              suggestedActions: [
                { label: 'How to wipe iPhone data', query: 'How do I safely wipe data from an iPhone?' },
                { label: 'Swollen battery safety rules', query: 'What should I do with a swollen battery?' },
                { label: 'Explain repairability scores', query: 'How is the repairability score calculated?' }
              ]
            }
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      message: textToSend,
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: textToSend,
        caseId: caseContext?._id || caseContext?.id || null
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.chat]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          message: '❌ Sorry, I encountered an issue reaching the assistant service. Please try again.',
          isRuleBased: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await api.delete('/chat/history');
      setMessages([
        {
          sender: 'assistant',
          message: 'Chat history cleared. How can EcoGuide assist you now?',
          isRuleBased: true
        }
      ]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans text-xs">
      {/* Engine Status Banner */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium text-slate-300">EcoGuide Assistant</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px] font-semibold">
            Rule-Based Engine (Demo Mode)
          </span>
        </div>
        <button
          onClick={clearHistory}
          title="Clear Conversation"
          className="text-slate-400 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-900/30'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow'
                }`}
              >
                {msg.message}
              </div>

              {/* Action Buttons & Links */}
              {msg.metadata?.suggestedActions && msg.metadata.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.metadata.suggestedActions.map((action, aIdx) => (
                    action.query ? (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(action.query)}
                        className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[10px] font-medium transition-colors text-left"
                      >
                        💡 {action.label}
                      </button>
                    ) : (
                      <Link
                        key={aIdx}
                        to={action.link || '#'}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-[10px] font-medium transition-colors"
                      >
                        {action.label}
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-slate-400 text-xs italic">
            <div className="w-6 h-6 rounded-lg bg-emerald-700/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            </div>
            <span>EcoGuide is processing recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask EcoGuide about data wiping, battery safety..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-colors shadow shadow-emerald-900/40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default EcoGuideChatbot;
