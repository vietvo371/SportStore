import { useState, useEffect, useCallback } from 'react';
import { chatbotService } from '@/services/chatbot.service';
import { ChatMessage } from '@/types/chatbot.types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function useChatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [maPhien, setMaPhien] = useState<string | null>(null);

    // Initialize session
    useEffect(() => {
        let storedMaPhien = localStorage.getItem('chatbot_session_id');
        if (!storedMaPhien) {
            storedMaPhien = uuidv4();
            localStorage.setItem('chatbot_session_id', storedMaPhien);
        }
        setMaPhien(storedMaPhien);
    }, []);

    // Load history when session is ready
    useEffect(() => {
        if (!maPhien) return;

        const loadHistory = async () => {
            try {
                const session = await chatbotService.getHistory(maPhien);
                if (session?.tin_nhan) {
                    setMessages(session.tin_nhan);
                }
            } catch (error) {
                console.error('Lỗi load lịch sử chatbot:', error);
            }
        };

        loadHistory();
    }, [maPhien]);

    const sendMessage = useCallback(async (noiDung: string) => {
        if (!maPhien || !noiDung.trim()) return;

        // Add user message optimistically
        const userMsg: ChatMessage = {
            id: Date.now(), // temporary ID
            phien_id: 0,
            vai_tro: 'nguoi_dung',
            noi_dung: noiDung,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const data = await chatbotService.sendMessage({
                noi_dung: noiDung,
                ma_phien: maPhien
            });

            // Update with real response
            const botMsg: ChatMessage = {
                id: Date.now() + 1,
                phien_id: 0,
                vai_tro: 'tro_ly',
                noi_dung: data.reply,
                created_at: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            toast.error(error.message || 'Lỗi gửi tin nhắn tới Chatbot');
        } finally {
            setIsLoading(false);
        }
    }, [maPhien]);

    const clearChat = useCallback(() => {
        const newMaPhien = uuidv4();
        localStorage.setItem('chatbot_session_id', newMaPhien);
        setMaPhien(newMaPhien);
        setMessages([]);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        clearChat
    };
}
