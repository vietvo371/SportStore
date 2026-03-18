'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatbot } from '@/hooks/useChatbot';
import ReactMarkdown from 'react-markdown';

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { messages, isLoading, sendMessage, clearChat } = useChatbot();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;
        const msg = inputValue;
        setInputValue('');
        await sendMessage(msg);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">SportStore AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Trực tuyến</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10"
                                    onClick={clearChat}
                                    title="Xóa cuộc trò chuyện"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth"
                        >
                            {messages.length === 0 && (
                                <div className="text-center py-10 px-6">
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bot className="h-8 w-8 text-primary" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-2">Xin chào! 👋</h4>
                                    <p className="text-sm text-slate-500">
                                        Tôi là trợ lý ảo của SportStore. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn size hoặc giải đáp thắc mắc.
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id || idx}
                                    className={`flex ${msg.vai_tro === 'nguoi_dung' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                            msg.vai_tro === 'nguoi_dung'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-white border shadow-sm text-slate-800 rounded-tl-none'
                                        }`}
                                    >
                                        <div className={`prose prose-sm max-w-none ${msg.vai_tro === 'nguoi_dung' ? 'prose-invert' : ''}`}>
                                            <ReactMarkdown>{msg.noi_dung}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border shadow-sm p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span className="text-xs text-slate-500 font-medium">AI đang trả lời...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    placeholder="Nhập tin nhắn..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="shrink-0 shadow-lg shadow-primary/20"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-slate-400 mt-2 text-center">
                                Cung cấp bởi <strong>SPORTSTORE AI</strong>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-slate-800 text-white' : 'bg-primary text-white'
                }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </motion.button>
        </div>
    );
}
