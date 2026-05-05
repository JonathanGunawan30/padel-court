import Link from "next/link";
import { BoltIcon, ShieldCheckIcon, ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PADEL_IMAGES } from "@/constants/images";

export default function Banner() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 lg:pt-20 overflow-hidden bg-padel-dark">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${PADEL_IMAGES.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-padel-dark via-padel-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-padel-dark to-transparent opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl lg:text-7xl text-white italic leading-[0.95] mb-6">
            BOOKING<br />
            <span className="text-padel-neon">LAPANGAN PADEL</span><br />
            LEBIH MUDAH
          </h1>
          <p className="text-lg lg:text-xl text-white/70 font-medium mb-10 max-w-xl">
            Pilih lapangan favoritmu, tentukan waktu, dan nikmati permainan terbaikmu di fasilitas kelas dunia kami.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="#field-list" 
              className="group flex items-center space-x-3 bg-padel-neon text-padel-dark px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_30px_rgba(217,241,22,0.4)]"
            >
              <span>Lihat Lapangan</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <BoltIcon className="w-6 h-6 text-padel-neon" />
              </div>
              <div>
                <h3 className="text-white font-bold">Cepat & Praktis</h3>
                <p className="text-white/50 text-sm">Booking hanya dalam beberapa klik</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheckIcon className="w-6 h-6 text-padel-neon" />
              </div>
              <div>
                <h3 className="text-white font-bold">Pembayaran Aman</h3>
                <p className="text-white/50 text-sm">Transaksi aman dan terpercaya</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <ClockIcon className="w-6 h-6 text-padel-neon" />
              </div>
              <div>
                <h3 className="text-white font-bold">Buka Setiap Hari</h3>
                <p className="text-white/50 text-sm">06.00 - 23.00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-64 bg-padel-neon/10 blur-[120px] rounded-full -mr-20 -mb-20" />
    </section>
  )
}
