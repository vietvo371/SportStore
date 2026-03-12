"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Layers, Shield, LayoutGrid, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryTable } from "@/components/admin/catalog/CategoryTable";
import { BrandTable } from "@/components/admin/catalog/BrandTable";
import { CategoryDialog } from "@/components/admin/catalog/CategoryDialog";
import { BrandDialog } from "@/components/admin/catalog/BrandDialog";
import { useAdminCategories, useAdminBrands } from "@/hooks/useAdminCatalog";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { Loader2 } from "lucide-react";

export default function CatalogPage() {
    const [activeTab, setActiveTab] = useState("categories");
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog states
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [brandDialogOpen, setBrandDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);

    // Data fetching
    const { data: categoriesResponse, isLoading: catsLoading, error: catsError } = useAdminCategories({ search: searchTerm });
    const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useAdminBrands({ search: searchTerm });

    if ((catsError as any)?.status === 403 || (brandsError as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Catalog" />;
    }

    const categories = categoriesResponse?.data || [];
    const brands = brandsResponse?.data || [];

    const handleCreateNew = () => {
        if (activeTab === "categories") {
            setSelectedCategory(null);
            setCategoryDialogOpen(true);
        } else {
            setSelectedBrand(null);
            setBrandDialogOpen(true);
        }
    };

    const handleEditCategory = (category: any) => {
        setSelectedCategory(category);
        setCategoryDialogOpen(true);
    };

    const handleEditBrand = (brand: any) => {
        setSelectedBrand(brand);
        setBrandDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Catalog</h1>
                    <p className="text-slate-500 text-sm italic">Quản lý hệ thống danh mục sản phẩm và thương hiệu.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleCreateNew}
                        className="shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm {activeTab === "categories" ? "Danh mục" : "Thương hiệu"}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={activeTab === "categories" ? "Tìm danh mục..." : "Tìm thương hiệu..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Main Tabs Container */}
            <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="categories" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Danh mục
                    </TabsTrigger>
                    <TabsTrigger value="brands" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Thương hiệu
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-0 outline-none">
                    {catsLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">Đang tải danh mục...</p>
                        </div>
                    ) : (
                        <CategoryTable categories={categories} onEdit={handleEditCategory} />
                    )}
                </TabsContent>

                <TabsContent value="brands" className="mt-0 outline-none">
                    {brandsLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">Đang tải thương hiệu...</p>
                        </div>
                    ) : (
                        <BrandTable brands={brands} onEdit={handleEditBrand} />
                    )}
                </TabsContent>
            </Tabs>

            {/* Unified Dialogs */}
            <CategoryDialog
                open={categoryDialogOpen}
                onOpenChange={setCategoryDialogOpen}
                category={selectedCategory}
                categories={categories}
            />

            <BrandDialog
                open={brandDialogOpen}
                onOpenChange={setBrandDialogOpen}
                brand={selectedBrand}
            />
        </div>
    );
}
