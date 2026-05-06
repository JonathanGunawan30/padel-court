'use client'
import Link from "next/link";
import { toast } from "react-toastify";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handlePolicyClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    toast.info(`Ini adalah ${type} untuk project demo. No actual policy applies.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <footer className="bg-padel-dark text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-3xl italic">
                PADEL<span className="text-padel-neon">BOOK</span>
              </span>
            </Link>
            <p className="text-white/50 leading-relaxed mb-8 font-medium">
              Platform booking lapangan padel terbaik untuk pengalaman bermain yang mudah dan menyenangkan. Fasilitas kelas dunia di genggamanmu.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <FaWhatsapp className="text-xl" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <FaTiktok className="text-lg" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-lg font-bold mb-6 italic tracking-tight text-white uppercase">Menu</h3>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><Link href="/" className="hover:text-padel-neon transition-colors">Beranda</Link></li>
              <li><Link href="/#field-list" className="hover:text-padel-neon transition-colors">Lapangan</Link></li>
              <li><Link href="/how-to-book" className="hover:text-padel-neon transition-colors">Cara Booking</Link></li>
              <li><Link href="/about-us" className="hover:text-padel-neon transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-lg font-bold mb-6 italic tracking-tight text-white uppercase">Bantuan</h3>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><Link href="/faq" className="hover:text-padel-neon transition-colors">FAQ</Link></li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handlePolicyClick(e, 'Syarat & Ketentuan')}
                  className="hover:text-padel-neon transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handlePolicyClick(e, 'Kebijakan Privasi')}
                  className="hover:text-padel-neon transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li><Link href="/#contact" className="hover:text-padel-neon transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 italic tracking-tight text-white uppercase">Ikuti Kami</h3>
            <p className="text-white/50 font-medium mb-4 italic uppercase tracking-widest text-xs">Stay Connected</p>
            <p className="text-white/70 font-medium mb-6">
              Dapatkan info promo dan turnamen terbaru langsung di media sosial kami.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/30 font-medium">
          <p>© {currentYear} PadelBook. All rights reserved.</p>
          <div className="flex items-center space-x-8">
            <a 
              href="#" 
              onClick={(e) => handlePolicyClick(e, 'Privacy Policy')}
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              onClick={(e) => handlePolicyClick(e, 'Terms of Service')}
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
