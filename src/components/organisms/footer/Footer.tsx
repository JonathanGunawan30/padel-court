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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481 2.239 2.24 3.477 5.226 3.475 8.408-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.394 1.707zm5.008-4.013c1.559.926 3.012 1.386 4.919 1.387 5.407 0 9.807-4.4 9.809-9.806.002-2.625-1.023-5.092-2.884-6.953-1.862-1.862-4.329-2.886-6.953-2.887-5.406 0-9.807 4.401-9.809 9.808 0 1.86.471 3.204 1.339 4.706l-.88 3.213 3.459-.922zm7.523-11.666c-.285-.635-.585-.648-.854-.659-.221-.009-.475-.009-.728-.009-.253 0-.665.095-.1.012 1.013 1.14 1.013 2.153 0 3.04-.095.317-.431 1.068-.824 1.511-.393.443-.878.815-1.347 1.171.118.145.437.41.933.841 1.202 1.046 2.376 2.085 2.376 2.085s.823.728 1.14.728c.317 0 1.646-.675 1.877-.887.232-.211.232-.443.158-.57-.074-.127-.275-.203-.57-.35s-1.877-.927-2.162-1.033c-.285-.105-.496-.158-.707.158s-.813.927-1.014 1.14c-.2.211-.401.237-.696.09-.295-.148-1.244-.458-2.37-1.462-.877-.781-1.47-1.744-1.641-2.037-.171-.293-.018-.452.129-.597.133-.13.295-.343.443-.515.148-.171.197-.293.295-.488.098-.196.049-.368-.025-.515s-.719-1.73-.979-2.365z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-padel-neon hover:text-padel-dark transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.14-3.51-5.4-.22-2.81 1.58-5.62 4.18-6.69.9-.37 1.86-.54 2.82-.49v4.03c-.66-.08-1.35-.02-1.97.25-.93.42-1.64 1.21-1.86 2.21-.11.57-.11 1.17.02 1.73.43 1.45 1.83 2.44 3.32 2.37 1.2-.07 2.27-.79 2.78-1.87.33-.6.44-1.28.45-1.96-.03-4.13-.03-8.26-.03-12.39z"/>
                </svg>
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