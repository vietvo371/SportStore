'use client';

import { useAdminReportsChatbotStats, useAdminReportsChatbotChart, useAdminReportsRecentChats, ReportFilters } from "@/hooks/useAdminReports";
import { Bot, MessageSquare, Zap, CreditCard, Activity, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface ChatbotTabProps {
    filters: ReportFilters;
}

export function ChatbotTab({ filters }: ChatbotTabProps) {
    const { data: stats, isLoading: isLoadingStats } = useAdminReportsChatbotStats(filters);
    const { data: recentChats, isLoading: isLoadingRecent } = useAdminReportsRecentChats(filters, 10);
    const { data: chartData, isLoading: isLoadingChart } = useAdminReportsChatbotChart(filters);

    if (isLoadingStats || isLoadingRecent || isLoadingChart) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p className="text-sm">Đang tải dữ liệu chatbot...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Không thể tải dữ liệu chatbot</p>
            </div>
        );
    }

    const formattedChartData = chartData?.map(item => ({
        ...item,
        formattedDate: item.date.length === 7 ? format(parseISO(item.date + "-01"), "MM/yyyy") : format(parseISO(item.date), "dd/MM")
    })) || [];

    return (
        <div className="space-y-6">
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Tổng phiên Chat</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total_sessions.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Trung bình tin nhắn</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.avg_messages} <span className="text-base text-slate-400 font-normal">/ phiên</span></p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Hao tốn Tokens</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total_tokens.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Chi phí dự kiến</p>
                        <p className="text-2xl font-bold text-slate-900">${stats.estimated_cost_usd}</p>
                    </div>
                </div>
            </div>

            {/* Token Usage Chart */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 overflow-hidden mt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-900">Mức Độ Tiêu Thụ Token (Gemini API)</h2>
                </div>
                
                <div className="h-64 sm:h-80 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedChartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="formattedDate" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="tokens" 
                                name="Số Tokens"
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorTokens)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chatbot Logs Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mt-6">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-900">Lịch sử Sessions Gần Đây</h2>
                </div>
                
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-[200px]">Thời gian bắt đầu</th>
                                <th className="px-6 py-4 font-semibold">Tài khoản</th>
                                <th className="px-6 py-4 font-semibold text-center">Số lượng tin nhắn</th>
                                <th className="px-6 py-4 font-semibold text-right">Tổng Tokens tiêu thụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentChats && recentChats.length > 0 ? recentChats.map((chat: any) => (
                                <tr key={chat.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {format(parseISO(chat.created_at), "dd/MM/yyyy HH:mm")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {chat.user_name ? (
                                            <span className="font-semibold text-slate-900">{chat.user_name}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Khách vãng lai</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                                            {chat.message_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-amber-600 whitespace-nowrap">
                                        {chat.total_tokens.toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        Chưa có phiên chat nào được ghi nhận.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
