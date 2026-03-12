import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Column 1: Brand Info */}
                    <div>
                        <Link href="/" className="mb-4 inline-block">
                            <span className="text-xl font-bold tracking-tighter text-primary">SPORTSTORE</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            Chuyên cung cấp quần áo, giày dép và phụ kiện thể thao chính hãng. Cam kết chất lượng cao và dịch vụ tận tâm.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Danh mục</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:text-primary transition-colors">Giày bóng đá</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Áo thể thao</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Dụng cụ tập Gym</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Phụ kiện</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Chính sách</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Vận chuyển & Giao nhận</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Quy định bảo mật</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Liên hệ</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span>123 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4" />
                                <span>support@sportstore.vn</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} SportStore. Bản quyền thuộc về sinh viên Đại học Duy Tân.</p>
                </div>
            </div>
        </footer>
    );
}
