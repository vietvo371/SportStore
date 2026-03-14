import apiClient from '@/lib/api';
import { ChatResponse, ChatSession, SendMessagePayload } from '@/types/chatbot.types';
import { ApiResponse } from '@/types';

export const chatbotService = {
    /**
     * Gửi tin nhắn tới chatbot
     */
    sendMessage: async (payload: SendMessagePayload): Promise<ChatResponse> => {
        const response = await apiClient.post<any, any>('/chatbot/message', payload);
        return response.data;
    },

    /**
     * Lấy lịch sử hội thoại của một phiên
     */
    getHistory: async (maPhien: string): Promise<ChatSession> => {
        const response = await apiClient.get<any, any>(`/chatbot/history`, {
            params: { ma_phien: maPhien }
        });
        return response.data;
    }
};
