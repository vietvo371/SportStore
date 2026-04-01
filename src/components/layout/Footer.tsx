import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-900 text-slate-300 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Column 1: Brand Info */}
                    <div>
                        <Link href="/" className="mb-6 inline-flex items-center group">
                            <div className="relative w-48 h-20 overflow-hidden transition-transform group-hover:scale-105">
                                <Image src="/sportstore-logo.png" alt="SportStore Logo" fill className="object-contain" sizes="192px" />
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Chuyên cung cấp quần áo, giày dép và phụ kiện thể thao chính hãng. Cam kết chất lượng cao và dịch vụ tận tâm.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-base font-semibold mb-4 text-white">Danh mục</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/products?category=thoi-trang" className="hover:text-primary transition-colors">Thời trang</Link></li>
                            <li><Link href="/products?category=bong-da" className="hover:text-primary transition-colors">Bóng đá</Link></li>
                            <li><Link href="/products?category=thoi-trang-ao-polo" className="hover:text-primary transition-colors">Thời trang áo polo</Link></li>
                            <li><Link href="/products?category=bong-da-balo-tui-the-thao" className="hover:text-primary transition-colors">Bóng đá, balo, túi thể thao</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h3 className="text-base font-semibold mb-4 text-white">Chính sách</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-primary transition-colors">Vận chuyển & Giao nhận</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Quy định bảo mật</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-base font-semibold mb-4 text-white">Liên hệ</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span>233 Nguyễn Hoàng, P. Bình Hiên, Đà Nẵng</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4" />
                                <span>0942 793 313</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4" />
                                <span>sportstore@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} SportStore. Bản quyền thuộc về sinh viên Đại học Duy Tân.</p>
                </div>
            </div>
        </footer>
    );
}
