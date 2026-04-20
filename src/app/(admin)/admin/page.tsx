'use client';

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    ShoppingCart,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
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
    BarChart,
    Bar,
    LineChart,
    Line,
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
    Tooltip as RechartsTooltip,
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

// Gradient palette cho order avatar
const AVATAR_GRADIENTS = [
    'from-pink-400 to-rose-500',
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-violet-400 to-purple-500',
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
            bg: 'bg-zinc-900',
            gradient: 'from-emerald-400/20 to-teal-500/20',
            textColor: 'text-white',
            delta: '+12.5%',
            deltaPositive: true,
            description: 'Tổng tiền thực nhận',
            // SVG decoration
            svgDecor: (
                <svg className="absolute right-0 top-0 w-full h-full pointer-events-none" viewBox="0 0 300 160" fill="none" style={{ zIndex: 0 }}>
                    <circle cx="240" cy="60" r="80" fill="white" fillOpacity="0.05" />
                    <circle cx="270" cy="30" r="50" fill="white" fillOpacity="0.07" />
                    <circle cx="220" cy="120" r="40" fill="white" fillOpacity="0.05" />
                    <circle cx="280" cy="110" r="20" fill="white" fillOpacity="0.09" />
                </svg>
            ),
        },
        {
            name: 'Đơn hàng',
            value: stats.total_orders.toLocaleString(),
            icon: ShoppingCart,
            bg: 'bg-zinc-900',
            gradient: 'from-blue-400/20 to-indigo-500/20',
            textColor: 'text-white',
            delta: '+8.2%',
            deltaPositive: true,
            description: 'Đã hoàn tất thanh toán',
            svgDecor: (
                <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style={{ zIndex: 0 }}>
                    <ellipse cx="170" cy="60" rx="40" ry="18" fill="white" fillOpacity="0.08" />
                    <rect x="120" y="20" width="60" height="20" rx="8" fill="white" fillOpacity="0.06" />
                    <polygon points="150,0 200,0 200,50" fill="white" fillOpacity="0.04" />
                    <circle cx="180" cy="100" r="14" fill="white" fillOpacity="0.1" />
                </svg>
            ),
        },
        {
            name: 'Sản phẩm',
            value: stats.total_products.toLocaleString(),
            icon: Package,
            bg: 'bg-zinc-900',
            gradient: 'from-amber-400/20 to-orange-500/20',
            textColor: 'text-white',
            delta: '+2.4%',
            deltaPositive: true,
            description: 'Số lượng mẫu mã',
            svgDecor: (
                <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style={{ zIndex: 0 }}>
                    <rect x="130" y="0" width="60" height="60" rx="30" fill="white" fillOpacity="0.06" />
                    <ellipse cx="165" cy="75" rx="28" ry="12" fill="white" fillOpacity="0.08" />
                    <polygon points="200,0 200,50 140,0" fill="white" fillOpacity="0.04" />
                    <circle cx="160" cy="30" r="10" fill="white" fillOpacity="0.1" />
                </svg>
            ),
        },
        {
            name: 'Khách hàng',
            value: stats.total_users.toLocaleString(),
            icon: Users,
            bg: 'bg-zinc-900',
            gradient: 'from-violet-400/20 to-purple-500/20',
            textColor: 'text-white',
            delta: '+5.1%',
            deltaPositive: true,
            description: 'Tài khoản hoạt động',
            svgDecor: (
                <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style={{ zIndex: 0 }}>
                    <polygon points="200,0 200,90 100,0" fill="white" fillOpacity="0.05" />
                    <ellipse cx="170" cy="40" rx="30" ry="18" fill="white" fillOpacity="0.08" />
                    <rect x="140" y="60" width="40" height="18" rx="8" fill="white" fillOpacity="0.06" />
                    <circle cx="150" cy="30" r="14" fill="white" fillOpacity="0.1" />
                    <line x1="120" y1="0" x2="200" y2="80" stroke="white" strokeOpacity="0.05" strokeWidth="6" />
                </svg>
            ),
        },
    ];

    const totalCategoryValue = React.useMemo(() => {
        return charts.category_distribution.reduce((acc: number, curr: any) => acc + curr.value, 0);
    }, [charts.category_distribution]);

    // Revenue chart data — find max for hero overlay
    const maxRevenue = React.useMemo(() => {
        if (!charts.revenue?.length) return 0;
        return Math.max(...charts.revenue.map((r: any) => r.total));
    }, [charts.revenue]);

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
                            <Zap className="h-6 w-6 text-primary fill-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            PHÂN TÍCH <span className="text-primary not-italic">DỮ LIỆU</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2 ml-1">
                        <Target className="h-4 w-4 text-slate-300" />
                        Trung tâm điều hành và phân tích dữ liệu thời gian thực
                    </p>
                </div>
                {/* Status pill */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl p-2.5 rounded-2xl border border-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-100">
                    <div className="px-4 py-2 rounded-xl bg-emerald-500 flex items-center gap-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Hệ thống hoạt động</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 pr-2">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statItems.map((stat) => (
                    <Card
                        key={stat.name}
                        className={`relative overflow-hidden ${stat.bg} text-white border-0 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 group`}
                    >
                        {/* Gradient + SVG decoration */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
                        {stat.svgDecor}

                        {/* Content */}
                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                            <CardTitle className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">
                                {stat.name}
                            </CardTitle>
                            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                <stat.icon className="h-4 w-4 text-white/80" />
                            </div>
                        </CardHeader>

                        <CardContent className="relative z-10 pt-0">
                            {/* Value */}
                            <div className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-none mb-3">
                                {stat.value}
                            </div>

                            {/* Delta + description */}
                            <div className="flex items-center justify-between">
                                <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                                    stat.deltaPositive
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-rose-500/20 text-rose-300'
                                }`}>
                                    {stat.deltaPositive
                                        ? <TrendingUp className="h-3 w-3" />
                                        : <TrendingDown className="h-3 w-3" />
                                    }
                                    {stat.delta}
                                </div>
                                <span className="text-[10px] text-white/50 font-medium">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 border border-slate-100 shadow-sm overflow-hidden bg-white rounded-2xl">
                    <CardHeader className="p-6 pb-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                                <CardTitle className="text-xl font-bold text-slate-900">Doanh thu</CardTitle>
                                <CardDescription className="text-slate-400 text-xs font-medium">
                                    Báo cáo doanh thu 6 tháng gần nhất
                                </CardDescription>
                            </div>
                            <div className="flex items-start gap-4 shrink-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                                        Tổng 6 tháng (cao nhất)
                                    </p>
                                    <p className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                                        {formatCurrency(maxRevenue)}
                                    </p>
                                </div>
                                <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Activity className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative p-6 pt-2 h-[320px] overflow-hidden">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <BarChart data={charts.revenue} margin={{ top: 8, right: 4, left: -16, bottom: 0 }} barSize={48} barCategoryGap="30%">
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.06} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                />
                                <ChartTooltip
                                    cursor={{ fill: 'hsl(var(--primary))', fillOpacity: 0.05 }}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="url(#colorRevenue)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={1800}
                                    animationBegin={200}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900">Danh mục</CardTitle>
                        <CardDescription className="text-slate-400 text-xs font-medium">
                            Cơ cấu sản phẩm theo danh mục
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center px-6 pb-6">
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <RechartsTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
                                                        <p className="text-sm font-black">{payload[0].value} sản phẩm</p>
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
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={6}
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
                                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-2xl font-black">
                                                                {totalCategoryValue.toLocaleString()}
                                                            </tspan>
                                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} className="fill-slate-400 text-[10px] font-bold uppercase tracking-widest">
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

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-2 w-full px-2">
                            {charts.category_distribution.map((entry: any, index: number) => (
                                <div key={`${entry.name}-${index}`} className="flex items-center gap-2 group cursor-default">
                                    <div
                                        className="h-2 w-2 rounded-full group-hover:scale-125 transition-transform shrink-0"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-[10px] font-semibold text-slate-500 truncate group-hover:text-slate-900 transition-colors leading-tight">
                                        {entry.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold text-slate-900">Sản phẩm bán chạy</CardTitle>
                                <CardDescription className="text-slate-400 text-xs font-medium">
                                    Top 5 sản phẩm được đặt nhiều nhất
                                </CardDescription>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <Crown className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {top_products.map((product: any, index: number) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-all group"
                                >
                                    {/* Rank badge */}
                                    <div className={`h-9 w-9 min-w-[2.25rem] rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${
                                        index === 0 ? 'bg-amber-100 text-amber-600 shadow-amber-200/50' :
                                        index === 1 ? 'bg-slate-200 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                        'bg-slate-50 text-slate-400'
                                    }`}>
                                        {index === 0 ? <Trophy className="h-4 w-4" /> : index + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                                            {product.ten_san_pham}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                                #{product.id}
                                            </span>
                                            <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5">
                                                <TrendingUp className="h-3 w-3" />
                                                Tăng trưởng
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="text-right shrink-0">
                                        <p className="text-base font-black text-slate-900 leading-none">
                                            {product.total_sold.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                                            Đơn hàng
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold text-slate-900">Đơn hàng mới</CardTitle>
                                <CardDescription className="text-slate-400 text-xs font-medium">
                                    Các giao dịch vừa được ghi nhận
                                </CardDescription>
                            </div>
                            <Link href="/admin/orders">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-4 rounded-xl border-slate-200 font-semibold text-[11px] hover:bg-slate-50 text-slate-600 bg-white"
                                >
                                    Xem tất cả
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {recent_orders.length > 0 ? recent_orders.map((order: any, index: number) => (
                                <div
                                    key={order.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-all group"
                                >
                                    {/* Avatar with gradient */}
                                    <div className={`h-9 w-9 min-w-[2.25rem] rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0`}>
                                        {order.khach_hang?.charAt(0)?.toUpperCase() || 'K'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1 leading-tight">
                                            {order.khach_hang}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                                                {order.ma_don_hang}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {order.thoi_gian}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Amount + Status */}
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-slate-900 leading-none">
                                            {formatCurrency(order.tong_tien)}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 ${
                                            order.trang_thai === 'cho_xac_nhan'
                                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                : order.trang_thai === 'da_giao'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-slate-50 text-slate-500 border border-slate-100'
                                        }`}>
                                            <span className={`h-1 w-1 rounded-full ${
                                                order.trang_thai === 'cho_xac_nhan'
                                                    ? 'bg-amber-500'
                                                    : order.trang_thai === 'da_giao'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-slate-400'
                                            }`} />
                                            {order.trang_thai === 'cho_xac_nhan' ? 'Chờ xác nhận'
                                                : order.trang_thai === 'da_giao' ? 'Đã giao'
                                                : order.trang_thai.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-3">
                                    <ShoppingCart className="h-10 w-10 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest italic">
                                        Chưa có đơn hàng nào
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
