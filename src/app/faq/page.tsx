import Header from "@/components/organisms/header/Header";
import Footer from "@/components/organisms/footer/Footer";
import { 
  QuestionMarkCircleIcon, 
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CreditCardIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";

export default function FAQ() {
  const faqs = [
    {
      question: "Bagaimana cara melakukan booking?",
      answer: "Anda dapat memilih lapangan, menentukan jadwal yang tersedia, dan melakukan pembayaran langsung melalui sistem kami. Panduan lengkap tersedia di halaman 'Cara Booking'.",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-padel-neon" />
    },
    {
      question: "Berapa lama batas waktu pembayaran?",
      answer: "Setelah melakukan pemesanan, Anda memiliki waktu 15 menit untuk menyelesaikan pembayaran. Jika tidak, jadwal akan otomatis dilepaskan kembali ke publik.",
      icon: <ClockIcon className="w-6 h-6 text-padel-neon" />
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menggunakan Midtrans sebagai payment gateway, mendukung Transfer Bank (VA), E-Wallet (GoPay, ShopeePay), dan QRIS.",
      icon: <CreditCardIcon className="w-6 h-6 text-padel-neon" />
    },
    {
      question: "Apakah saya bisa membatalkan pesanan?",
      answer: "Sesuai dengan kebijakan layanan kami, pesanan yang sudah dibayar tidak dapat dibatalkan atau dijadwal ulang secara mandiri.",
      icon: <NoSymbolIcon className="w-6 h-6 text-padel-neon" />
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-44 pb-20 bg-padel-dark overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 text-padel-neon mb-6">
            <QuestionMarkCircleIcon className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Support Center</span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase">
            FREQUENTLY ASKED <span className="text-padel-neon">QUESTIONS</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">
            Temukan jawaban cepat untuk pertanyaan yang sering diajukan mengenai layanan PadelBook.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-padel-neon/5 to-transparent pointer-events-none" />
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="group bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-padel-dark rounded-2xl">
                  {faq.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black italic text-padel-dark uppercase mb-4 tracking-tight">
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="pb-24 container mx-auto px-4 text-center">
        <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100">
          <h2 className="text-2xl font-black italic text-padel-dark uppercase mb-4">Masih butuh bantuan?</h2>
          <p className="text-gray-500 font-medium mb-8">Tim kami siap membantu Anda 24/7 melalui WhatsApp atau Email.</p>
          <button className="px-10 py-4 bg-padel-dark text-white font-black italic uppercase rounded-full hover:bg-padel-accent transition-all shadow-xl">
            Hubungi CS Kami
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}