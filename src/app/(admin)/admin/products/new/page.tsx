'use client';

import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Thêm sản phẩm mới</h1>
                    <p className="text-slate-500 text-sm">Nhập thông tin cơ bản để tạo sản phẩm.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <ProductForm />
            </div>
        </div>
    );
}
