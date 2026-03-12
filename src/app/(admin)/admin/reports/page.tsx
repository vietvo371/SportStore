'use client';

import { useState } from "react";
import { ReportFilters, ReportPeriod } from "@/hooks/useAdminReports";
import { Calendar as CalendarIcon, FilterX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

import { RevenueTab } from "@/components/admin/reports/RevenueTab";
import { ProductsTab } from "@/components/admin/reports/ProductsTab";
import { CustomersTab } from "@/components/admin/reports/CustomersTab";
import { MarketingTab } from "@/components/admin/reports/MarketingTab";
import { ChatbotTab } from "@/components/admin/reports/ChatbotTab";

export default function ReportsManagementPage() {
    const [period, setPeriod] = useState<ReportPeriod>('month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const isCustomValid = dateRange?.from && dateRange?.to;

    const filters: ReportFilters = {
        period,
        from: period === 'custom' && isCustomValid ? dateRange.from : undefined,
        to: period === 'custom' && isCustomValid ? dateRange.to : undefined
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Báo cáo & Thống kê</h1>
                    <p className="text-slate-500 text-sm italic">Theo dõi tình hình kinh doanh và doanh thu bán hàng.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {period === 'custom' && (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center pr-2 transition-all">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"ghost"}
                                        className={cn(
                                            "w-[260px] justify-start text-left font-medium hover:bg-transparent text-slate-700",
                                            !dateRange && "text-slate-400 font-normal"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "dd/MM/y", { locale: vi })} -{" "}
                                                    {format(dateRange.to, "dd/MM/y", { locale: vi })}
                                                </>
                                            ) : (
                                                <span className="text-rose-500 font-medium">
                                                    {format(dateRange.from, "dd/MM/y", { locale: vi })} - (Chọn ngày kết thúc)
                                                </span>
                                            )
                                        ) : (
                                            <span>Chọn từ ngày - đến ngày</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                            {dateRange && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full text-slate-400 hover:text-slate-600"
                                    onClick={() => setDateRange(undefined)}
                                >
                                    <FilterX className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                        <CalendarIcon className="h-5 w-5 text-slate-400 ml-2" />
                        <Select 
                            value={period} 
                            onValueChange={(val: ReportPeriod) => {
                                setPeriod(val);
                                if (val !== 'custom') setDateRange(undefined);
                            }}
                        >
                            <SelectTrigger className="w-[160px] border-none shadow-none focus:ring-0 font-medium text-slate-700">
                                <SelectValue placeholder="Chọn kỳ báo cáo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hôm nay</SelectItem>
                                <SelectItem value="week">Tuần này</SelectItem>
                                <SelectItem value="month">Tháng này</SelectItem>
                                <SelectItem value="year">Năm nay</SelectItem>
                                <SelectItem value="custom">Tùy chỉnh...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="bg-white border border-slate-100 shadow-sm p-1 rounded-xl w-full flex flex-wrap lg:flex-nowrap justify-start h-auto scrollbar-hide mb-6 gap-1">
                    <TabsTrigger value="revenue" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium px-4 py-2 shrink-0">
                        💰 Doanh thu & Đơn hàng
                    </TabsTrigger>
                    <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium px-4 py-2 shrink-0">
                        📦 Sản phẩm & Tồn kho
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium px-4 py-2 shrink-0">
                        👥 Khách hàng
                    </TabsTrigger>
                    <TabsTrigger value="marketing" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium px-4 py-2 shrink-0">
                        🎁 Thống kê Marketing
                    </TabsTrigger>
                    <TabsTrigger value="chatbot" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium px-4 py-2 shrink-0">
                        🤖 AI Chatbot Logs
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="mt-0 outline-none">
                    <RevenueTab filters={filters} />
                </TabsContent>
                
                <TabsContent value="products" className="mt-0 outline-none">
                    <ProductsTab filters={filters} />
                </TabsContent>
                
                <TabsContent value="customers" className="mt-0 outline-none">
                    <CustomersTab filters={filters} />
                </TabsContent>
                
                <TabsContent value="marketing" className="mt-0 outline-none">
                    <MarketingTab filters={filters} />
                </TabsContent>
                
                <TabsContent value="chatbot" className="mt-0 outline-none">
                    <ChatbotTab filters={filters} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
