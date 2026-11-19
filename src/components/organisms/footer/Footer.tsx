'use client'
import Link from "next/link";
import { toast } from "react-toastify";

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
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>
              </a>
              <a 
                href="#" 
                aria-label="WhatsApp"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.93 9.93 0 0 0-8.46 15.16L2 22l4.98-1.54A9.93 9.93 0 1 0 12.04 2Zm5.8 14.12c-.24.68-1.42 1.3-1.96 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.35-5.14-4.55-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38h.58c.19 0 .44-.07.69.52.25.6.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.38-.46.51-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.1 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.08.13.08.73-.16 1.41Z"/></svg>
              </a>
              <a 
                href="#" 
                aria-label="TikTok"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.26 8.26 0 0 0 4.8 1.53V6.88a4.82 4.82 0 0 1-.89-.19Z"/></svg>
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
