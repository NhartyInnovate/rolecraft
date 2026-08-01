import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../types';
import { useConversation, useSendMessage } from '../../hooks/useRoleCraftApi';
import { Bot, User, Sparkles, Zap, Paperclip, ArrowUp, CornerDownLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AICoachChatProps {
  sessionId: string;
}

const DEFAULT_SUGGESTED_PROMPTS = [
  '• Quantify leadership impact in my lead role',
  '• Optimize headline for Staff Architect position',
  '• Draft executive elevator pitch',
  '• Generate target role interview questions',
];

export const AICoachChat: React.FC<AICoachChatProps> = ({ sessionId }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: messages = [], isLoading } = useConversation(sessionId);
  const sendMessageMutation = useSendMessage(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessageMutation.isPending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || sendMessageMutation.isPending) return;

    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessageMutation.mutateAsync({ text });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-100 relative overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 scroll-smooth space-y-6">
        <div className="max-w-3xl mx-auto w-full space-y-6 pb-6">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400 tracking-wider">CONNECTING TO GEMINI AI ENGINE...</p>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome / Starter View */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 sm:py-16 text-center space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Executive AI Career Partner
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Ask strategy questions, convert past accomplishments into high-impact metrics, or craft executive elevator pitches tailored to your target role.
                </p>
              </div>

              {/* Starter Action Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                {DEFAULT_SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.replace('• ', ''))}
                    className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, index) => {
              const isCoach = msg.sender === 'coach';
              const isLatest = index === messages.length - 1;

              return (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isCoach ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender Tag */}
                  <div className="flex items-center gap-2 mb-1.5 text-xs">
                    {isCoach ? (
                      <>
                        <div className="w-5 h-5 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                          <Bot className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-white tracking-tight text-[11px]">AI Executive Coach</span>
                        <span className="text-[10px] font-mono text-slate-500">• Gemini 3.6</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-slate-400 text-[10px]">You</span>
                        <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                          <User className="w-3 h-3" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`w-full ${
                      isCoach
                        ? 'bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 sm:p-5 text-slate-200 shadow-sm'
                        : 'bg-indigo-600/10 border border-indigo-500/20 text-slate-100 rounded-2xl rounded-tr-sm p-3.5 sm:p-4 max-w-2xl font-medium'
                    }`}
                  >
                    {isCoach ? (
                      <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-base font-bold text-white mt-3 mb-2 tracking-tight">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1.5 tracking-tight">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-semibold text-indigo-300 mt-2 mb-1 uppercase tracking-wider font-mono">{children}</h3>,
                            p: ({ children }) => <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2 font-light">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs sm:text-sm text-slate-200 mb-3 font-light">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-1.5 text-xs sm:text-sm text-slate-200 mb-3 font-light">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            code: ({ children }) => (
                              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px]">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-indigo-300 overflow-x-auto my-3">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">{msg.text}</p>
                    )}

                    {/* Suggested Action Pills under AI Messages */}
                    {isCoach && (
                      <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                          Suggested Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(msg.action_suggestions && msg.action_suggestions.length > 0
                            ? msg.action_suggestions
                            : isLatest
                            ? ['Quantify leadership impact in my lead role', 'Optimize headline for Staff Architect position', 'Draft executive elevator pitch']
                            : []
                          ).map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(sug)}
                              className="px-3 py-1 bg-slate-950/90 hover:bg-slate-900 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            >
                              <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span>{sug}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}

          {/* AI Response Pending Spinner */}
          {sendMessageMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 bg-slate-900/40 border border-slate-800/50 rounded-2xl max-w-md"
            >
              <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">AI Coach is analyzing</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light">Formulating executive advice...</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Bottom Input Composer */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19] to-transparent pt-3 pb-2 px-2 sm:px-4 z-20">
        <div className="max-w-3xl mx-auto w-full space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 flex items-end gap-2"
          >
            {/* Attachment Button */}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer shrink-0 mb-0.5"
              title="Attach document reference"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI Coach for advice, rewrites, or ATS key terms..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed min-h-[36px] max-h-[160px] py-1.5"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || sendMessageMutation.isPending}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0 mb-0.5 shadow-md shadow-indigo-600/30 flex items-center justify-center"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Footer Keyboard Hint */}
          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Gemini 3.6 Executive AI Engine</span>
            </span>
            <span>Press Enter ↵ to send • Shift + Enter for newline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
