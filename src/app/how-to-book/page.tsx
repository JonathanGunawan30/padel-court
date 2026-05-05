import Header from "@/components/organisms/header/Header";
import Footer from "@/components/organisms/footer/Footer";
import { 
  ClipboardDocumentCheckIcon, 
  CreditCardIcon, 
  TicketIcon, 
  CheckBadgeIcon,
  UserIcon,
  CalendarDaysIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

export default function HowToBook() {
  const steps = [
    {
      title: "Pilih Jadwal",
      description: "Pilih lapangan favoritmu dan tentukan waktu bermain yang tersedia di kalender booking.",
      icon: <CalendarDaysIcon className="w-8 h-8" />,
    },
    {
      title: "Login / Register",
      description: "Masuk ke akunmu atau daftar baru untuk menyimpan data booking dan riwayat transaksi.",
      icon: <UserIcon className="w-8 h-8" />,
    },
    {
      title: "Konfirmasi Pesanan",
      description: "Periksa kembali detail pesananmu, pastikan waktu dan harga sudah sesuai.",
      icon: <ClipboardDocumentCheckIcon className="w-8 h-8" />,
    },
    {
      title: "Pembayaran Online",
      description: "Lakukan pembayaran aman melalui Midtrans dengan Transfer Bank, E-Wallet, atau metode lainnya.",
      icon: <CreditCardIcon className="w-8 h-8" />,
    },
    {
      title: "Dapatkan Tiket",
      description: "Setelah pembayaran berhasil, tiket booking akan muncul di dashboard dan siap digunakan.",
      icon: <TicketIcon className="w-8 h-8" />,
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-44 pb-20 bg-padel-dark overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 text-padel-neon mb-6">
            <CheckBadgeIcon className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Guide</span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase">
            CARA <span className="text-padel-neon">BOOKING</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">
            Ikuti langkah-langkah mudah di bawah ini untuk memesan lapangan padel favoritmu. Proses instan dan aman.
          </p>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-padel-neon/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-padel-neon/5 to-transparent pointer-events-none" />
      </section>

      {/* Steps Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="mb-8 flex items-center justify-between">
                <div className="p-4 bg-padel-dark rounded-2xl group-hover:bg-padel-neon transition-colors duration-300">
                  <div className="text-padel-neon group-hover:text-padel-dark transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>
                <span className="text-5xl font-black text-gray-100 group-hover:text-padel-neon/20 transition-colors duration-300">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-black italic text-padel-dark uppercase mb-4 tracking-tight">{step.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}

          {/* Payment Partner Notice */}
          <div className="lg:col-span-1 p-10 bg-padel-neon rounded-[2.5rem] flex flex-col justify-center items-center text-center">
            <BanknotesIcon className="w-16 h-16 text-padel-dark mb-6" />
            <h3 className="text-2xl font-black italic text-padel-dark uppercase mb-4">Pembayaran Aman</h3>
            <p className="text-padel-dark font-bold text-sm mb-6 opacity-80">
              Semua transaksi diproses secara otomatis melalui sistem payment gateway terpercaya.
            </p>
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl">
              <span className="font-black italic text-padel-dark">SECURED BY MIDTRANS</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Quick Tips */}
      <section className="pb-24 container mx-auto px-4">
        <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-16 border border-gray-100">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black italic text-padel-dark uppercase mb-10 tracking-tighter">PENTING UNTUK DIKETAHUI</h2>
            <div className="space-y-8">
              <div className="flex space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                  <span className="font-black text-padel-dark italic">?</span>
                </div>
                <div>
                  <h4 className="font-black italic text-padel-dark uppercase mb-2">Berapa lama batas waktu pembayaran?</h4>
                  <p className="text-gray-500 font-medium">Batas waktu pembayaran adalah 15 menit setelah pemesanan dibuat. Jika lewat dari itu, jadwal akan otomatis terbuka kembali.</p>
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                  <span className="font-black text-padel-dark italic">?</span>
                </div>
                <div>
                  <h4 className="font-black italic text-padel-dark uppercase mb-2">Apakah bisa refund jika batal?</h4>
                  <p className="text-gray-500 font-medium">Jadwal yang sudah dibayar tidak dapat dibatalkan atau di-refund sesuai dengan kebijakan layanan kami.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}