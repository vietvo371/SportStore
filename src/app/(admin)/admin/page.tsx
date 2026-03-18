'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    ShoppingCart,
    Package,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    Trophy,
    Activity,
    Target,
    Zap,
    Crown,
    LayoutDashboard
} from "lucide-react";

import { useAdminDashboard } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
    Tooltip as RechartsTooltip
} from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    total: {
        label: "Doanh thu",
        color: "hsl(var(--primary))",
    },
    value: {
        label: "Số lượng",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

const COLORS = [
    'hsl(var(--primary))',
    '#f59e0b',
    '#10b981',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4'
];

export default function AdminDashboard() {
    const { data: response, isLoading, isError } = useAdminDashboard();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] gap-4">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
                    <LayoutDashboard className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Đang đồng bộ dữ liệu hệ thống...</p>
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <div className="p-12 text-center bg-rose-50/50 text-rose-600 rounded-[2.5rem] border border-rose-100 border-dashed m-8">
                <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
                    <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Mất kết nối dữ liệu</h3>
                <p className="text-sm font-medium opacity-70 mt-1">Lỗi khi tải dữ liệu thống kê. Vui lòng kiểm tra lại backend.</p>
            </div>
        );
    }

    const { stats, recent_orders, charts, top_products } = response.data;

    const statItems = [
        {
            name: 'Doanh thu',
            value: formatCurrency(stats.total_revenue),
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trend: '+12.5%',
            description: 'Tổng tiền thực nhận'
        },
        {
            name: 'Đơn hàng',
            value: stats.total_orders.toLocaleString(),
            icon: ShoppingCart,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            trend: '+8.2%',
            description: 'Đã hoàn tất thanh toán'
        },
        {
            name: 'Sản phẩm',
            value: stats.total_products.toLocaleString(),
            icon: Package,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            trend: '+2.4%',
            description: 'Số lượng mẫu mã'
        },
        {
            name: 'Khách hàng',
            value: stats.total_users.toLocaleString(),
            icon: Users,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
            trend: '+5.1%',
            description: 'Tài khoản hoạt động'
        },
    ];

    const totalCategoryValue = React.useMemo(() => {
        return charts.category_distribution.reduce((acc: number, curr: any) => acc + curr.value, 0);
    }, [charts.category_distribution]);

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
                            <Zap className="h-6 w-6 text-primary fill-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            ANALYTICS <span className="text-primary not-italic">HUB</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2 ml-1">
                        <Target className="h-4 w-4 text-slate-300" />
                        Trung tâm điều hành và phân tích dữ liệu thời gian thực
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-100">
                    <div className="px-5 py-2.5 rounded-xl bg-slate-900 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Monitoring</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 pr-4">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat) => (
                    <Card key={stat.name} className="border-none shadow-2xl shadow-slate-200/50 hover:shadow-primary/10 transition-all duration-500 group overflow-hidden bg-white/80 backdrop-blur-md ring-1 ring-white relative">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.name}</CardTitle>
                            <div className={`${stat.bg} ${stat.border} border p-3 rounded-2xl group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm shadow-slate-100`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                            <div className="flex items-center justify-between mt-4">
                                <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border ${stat.border} ${stat.bg} ${stat.color}`}>
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{stat.trend}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Advanced Revenue Chart */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md ring-1 ring-white overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Biểu đồ tăng trưởng</CardTitle>
                                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.1em]">Báo cáo doanh thu định kỳ 6 tháng</CardDescription>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 h-[400px]">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={charts.revenue} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <ChartTooltip
                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    content={<ChartTooltipContent hideLabel indicator="line" />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Donut Distribution */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md ring-1 ring-white flex flex-col rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tight text-center">Tỷ trọng danh mục</CardTitle>
                        <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.1em] text-center mt-1">Cơ cấu tồn kho sản phẩm</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-8 pt-0 flex flex-col items-center justify-center">
                        <div className="h-[280px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <RechartsTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
                                                        <p className="text-sm font-black">{payload[0].value} Sản phẩm</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Pie
                                        data={charts.category_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={105}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1500}
                                    >
                                        {charts.category_distribution.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                            />
                                        ))}
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    return (
                                                        <text
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                className="fill-slate-900 text-3xl font-black"
                                                            >
                                                                {totalCategoryValue.toLocaleString()}
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 24}
                                                                className="fill-slate-400 text-[10px] font-black uppercase tracking-widest"
                                                            >
                                                                Tổng số
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 w-full px-4">
                            {charts.category_distribution.map((entry: any, index: number) => (
                                <div key={`${entry.name}-${index}`} className="flex items-center gap-2 group cursor-default">
                                    <div className="h-2 w-2 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-[10px] font-black text-slate-500 uppercase truncate group-hover:text-slate-900 transition-colors">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products - Leaderboard Style */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md ring-1 ring-white overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Sản phẩm ngôi sao</CardTitle>
                                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.1em]">Top 5 sản phẩm bán chạy nhất</CardDescription>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm shadow-amber-200/50">
                                <Crown className="h-6 w-6" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {top_products.map((product: any, index: number) => (
                                <div key={product.id} className="flex items-center gap-6 p-6 hover:bg-slate-50/80 transition-all group relative overflow-hidden">
                                    {index === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />}
                                    <div className={`h-10 w-10 min-w-[2.5rem] rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${index === 0 ? 'bg-amber-100 text-amber-600 scale-110' :
                                            index === 1 ? 'bg-slate-200 text-slate-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-50 text-slate-400'
                                        }`}>
                                        {index === 0 ? <Trophy className="h-4 w-4" /> : index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer tracking-tight">{product.ten_san_pham}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">ID: #{product.id}</span>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" /> Growth
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-slate-900 leading-none">{product.total_sold}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Đơn hàng</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Live Activity Center */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md ring-1 ring-white flex flex-col rounded-[2.5rem]">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Hoạt động thời gian thực</CardTitle>
                                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.1em]">Các giao dịch vừa ghi nhận</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 text-slate-600 bg-white shadow-sm transition-all active:scale-95">XEM TẤT CẢ</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="divide-y divide-slate-50">
                            {recent_orders.length > 0 ? recent_orders.map((order: any) => (
                                <div key={order.id} className="flex items-center gap-5 p-6 hover:bg-slate-50/80 transition-all group">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:border-primary/20 shadow-sm transition-all">
                                        <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 line-clamp-1 tracking-tight">{order.khach_hang}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-mono text-primary font-black bg-primary/5 px-2 py-0.5 rounded-md">{order.ma_don_hang}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.thoi_gian}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-emerald-600 tracking-tight">{formatCurrency(order.tong_tien)}</p>
                                        <div className={`mt-1 inline-flex items-center gap-1.5 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${order.trang_thai === 'cho_xac_nhan' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                                                order.trang_thai === 'da_giao' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                                                    'bg-slate-50 text-slate-500 border border-slate-100/50'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${order.trang_thai === 'cho_xac_nhan' ? 'bg-amber-500 animate-pulse' :
                                                    order.trang_thai === 'da_giao' ? 'bg-emerald-500' :
                                                        'bg-slate-400'
                                                }`} />
                                            {order.trang_thai.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-[400px] flex flex-col items-center justify-center text-slate-300 gap-3">
                                    <Activity className="h-10 w-10 opacity-20" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] italic">Chưa phát hiện hoạt động mới</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

