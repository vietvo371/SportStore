'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Product, Review } from '@/types/product.types';
import { ReviewModal } from './ReviewModal';

export function ProductReviews({ product }: { product: Product }) {
    const { isAuthenticated } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const reviews: Review[] = product.danh_gia || [];
    const avgRating = Number(product.diem_danh_gia) || 0;
    const totalReviews = Number(product.so_luot_danh_gia) || 0;

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length > 0) {
        reviews.forEach(r => {
            if (r.so_sao >= 1 && r.so_sao <= 5) {
                // @ts-ignore
                distribution[Math.floor(r.so_sao)]++;
            }
        });
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const reviewCalcBase = reviews.length > 0 ? reviews.length : totalReviews;

    const handleWriteReview = () => {
        if (!isAuthenticated) {
            window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Summary */}
            <div className="md:col-span-1 space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-4">Đánh giá của khách hàng</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl font-bold text-slate-800">{avgRating.toFixed(1)}</div>
                        <div className="flex flex-col">
                            <div className="flex text-amber-500 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{totalReviews} đánh giá toàn cầu</span>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2 mb-6">
                        {[5, 4, 3, 2, 1].map((star) => {
                            // @ts-ignore
                            const count = distribution[star];
                            const percentage = reviewCalcBase > 0 ? (count / reviewCalcBase) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-12 text-slate-600 font-medium">{star} sao</span>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-right text-slate-500">{percentage.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h4 className="font-semibold mb-2">Đánh giá sản phẩm này</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Chia sẻ suy nghĩ của bạn với những khách hàng khác
                    </p>
                    <button
                        onClick={handleWriteReview}
                        disabled={!!(isAuthenticated && product.can_review === false)}
                        className={`w-full py-2.5 px-4 border rounded-lg font-medium transition-colors
                            ${(isAuthenticated && product.can_review === false)
                                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {product.has_reviewed ? 'Đã đánh giá' : 'Viết đánh giá'}
                    </button>
                    {isAuthenticated && product.has_reviewed && (
                        <p className="text-xs text-center text-green-600 mt-2 font-medium">
                            Bạn đã gửi đánh giá cho sản phẩm này. Cảm ơn bạn!
                        </p>
                    )}
                    {isAuthenticated && !product.has_reviewed && product.can_review === false && (
                        <p className="text-xs text-center text-amber-600 mt-2 font-medium">
                            Bạn cần mua và nhận hàng thành công để có thể đánh giá sản phẩm này.
                        </p>
                    )}
                    {!isAuthenticated && (
                        <p className="text-xs text-center text-slate-400 mt-2">
                            Vui lòng đăng nhập để gửi đánh giá.
                        </p>
                    )}
                </div>
            </div>

            {/* Right Column: Review List */}
            <div className="md:col-span-2 space-y-8">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-muted-foreground text-lg mb-2">Chưa có đánh giá nào</p>
                        <p className="text-sm text-slate-400">Hãy là người đầu tiên trải nghiệm và chia sẻ nhé.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {review.nguoi_dung?.ho_va_ten || 'Khách hàng ẩn danh'}
                                    </p>
                                    <p className="text-xs text-slate-400">Đã xác nhận mua hàng</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.so_sao ? 'fill-current' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                {review.tieu_de && (
                                    <span className="font-bold text-slate-800">{review.tieu_de}</span>
                                )}
                            </div>

                            <span className="text-xs text-slate-400 mb-3 block">
                                Đánh giá vào ngày {formatDate(review.created_at)}
                            </span>

                            {review.noi_dung && (
                                <p className="text-slate-600 leading-relaxed">
                                    {review.noi_dung}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={product.ten_san_pham}
                productId={product.id}
                orderId={product.eligible_order_id || null}
            />
        </div>
    );
}

