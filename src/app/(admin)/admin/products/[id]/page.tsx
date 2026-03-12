'use client';

import { useAdminProduct } from "@/hooks/useAdmin";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: response, isLoading, error } = useAdminProduct(parseInt(id));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !response?.data) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100 italic">
                Sản phẩm không tồn tại hoặc đã bị xóa.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa sản phẩm</h1>
                    <p className="text-slate-500 text-sm italic">ID: {id} • {response.data.ten_san_pham}</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <ProductForm initialData={response.data} isEdit />
            </div>
        </div>
    );
}
