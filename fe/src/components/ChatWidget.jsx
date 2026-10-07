import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Xin chào! 👋 Bạn đang cần tìm bộ phận nào cho xe hơi của mình, hoặc có câu hỏi nào khác về sản phẩm, giao hàng, hoặc chính sách đổi trả không?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const payload = { message: userMessage };
            if (conversationId) {
                payload.conversation_id = conversationId;
            }
            
            const response = await api.post('/chat', payload);
            
            if (response.data.conversation_id) {
                setConversationId(response.data.conversation_id);
            }

            setMessages(prev => [...prev, { role: 'assistant', text: response.data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}>
            {/* Chat Icon Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                        <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="card shadow-lg border-0" style={{ width: '360px', height: '520px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', animation: 'fadeIn 0.3s' }}>
                    {/* Header */}
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                        <div className="fw-bold d-flex align-items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-robot" viewBox="0 0 16 16">
                              <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.889a28.68 28.68 0 0 1 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                              <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                            </svg>
                            Trợ lý ảo OTO-AI
                        </div>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Messages Body */}
                    <div className="card-body bg-light overflow-auto p-3" style={{ flex: 1, backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-3 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="me-2 mt-1">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                            <i className="bi bi-robot fs-6"></i>
                                        </div>
                                    </div>
                                )}
                                <div 
                                    className={`p-2 px-3 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                    style={{ 
                                        maxWidth: '75%', 
                                        whiteSpace: 'pre-wrap', 
                                        fontSize: '0.95rem',
                                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                        borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px'
                                    }}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="d-flex justify-content-start mb-3">
                                <div className="me-2 mt-1">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <i className="bi bi-robot fs-6"></i>
                                    </div>
                                </div>
                                <div className="p-2 px-3 rounded-4 shadow-sm bg-white text-muted" style={{ borderBottomLeftRadius: '4px' }}>
                                    <span className="spinner-grow spinner-grow-sm me-1 text-primary" role="status" aria-hidden="true" style={{ animationDelay: '0s', width: '10px', height: '10px' }}></span>
                                    <span className="spinner-grow spinner-grow-sm me-1 text-primary" role="status" aria-hidden="true" style={{ animationDelay: '0.2s', width: '10px', height: '10px' }}></span>
                                    <span className="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true" style={{ animationDelay: '0.4s', width: '10px', height: '10px' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="card-footer bg-white p-3 border-0 shadow-sm" style={{ zIndex: 1 }}>
                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input 
                                type="text" 
                                className="form-control rounded-pill bg-light border-0 px-4" 
                                placeholder="Nhập tin nhắn..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
                            />
                            <button type="submit" className="btn btn-primary rounded-circle shadow-sm" disabled={!input.trim() || isLoading} style={{ width: '45px', height: '42px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
