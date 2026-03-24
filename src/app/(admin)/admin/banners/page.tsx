'use client';

import { useState } from 'react';
import { useAdminBanners, useToggleBannerStatus } from '@/hooks/useAdminBanners';
import { BannerTable } from '@/components/admin/banners/BannerTable';
import { BannerDialog } from '@/components/admin/banners/BannerDialog';
import { BannerDeleteDialog } from '@/components/admin/banners/BannerDeleteDialog';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw, LayoutTemplate } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminBannersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    
    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<any>(null);

    const { data: response, isLoading, isError, error, refetch } = useAdminBanners({
        page,
        per_page: 10,
        search: search || undefined,
    });

    const toggleStatusMutation = useToggleBannerStatus();

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Banner" />;
    }

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAddClick = () => {
        setSelectedBanner(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (banner: any) => {
        setSelectedBanner(banner);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (banner: any) => {
        setSelectedBanner(banner);
        setIsDeleteDialogOpen(true);
    };

    const handleToggleStatus = (id: number) => {
        toggleStatusMutation.mutate(id);
    };

    const handleDialogClose = (changed?: boolean) => {
        setIsDialogOpen(false);
        if (changed) refetch();
    };

    const handleDeleteDialogClose = (deleted?: boolean) => {
        setIsDeleteDialogOpen(false);
        if (deleted) refetch();
    };

    const banners = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LayoutTemplate className="h-6 w-6 text-indigo-500" />
                        Quản lý Banner
                    </h1>
                    <p className="text-slate-500 text-sm italic">Thiết lập các banner quảng cáo trên trang chủ.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="bg-white border-slate-200"
                    >
                        <RefreshCw className={`h-4 w-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        onClick={handleAddClick}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Banner
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500"
                        />
                    </div>
                </div>

                <BannerTable
                    banners={banners}
                    isLoading={isLoading}
                    isError={isError}
                    meta={meta}
                    onPageChange={setPage}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <BannerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                banner={selectedBanner}
                onClose={handleDialogClose}
            />

            <BannerDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                banner={selectedBanner}
                onClose={handleDeleteDialogClose}
            />
        </div>
    );
}
