import React from "react";
import Header from "@/components/organisms/header/Header";
import Footer from "@/components/organisms/footer/Footer";
import Detail from "@/components/organisms/detail/Detail";
import Schedule from "@/components/organisms/detail/Schedule";
import { CalendarIcon } from "@heroicons/react/24/solid";

export default async function Booking({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;

  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section for Booking */}
      <section className="relative pt-44 pb-20 bg-padel-dark overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-padel-neon mb-6">
              <CalendarIcon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Reservation</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter mb-4">
              BOOKING <span className="text-padel-neon">JADWAL</span>
            </h1>
            <p className="text-lg text-white/60 font-medium max-w-xl">
              Pilih jadwal yang tersedia dan amankan slotmu sekarang. Proses cepat dan pembayaran aman.
            </p>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-padel-neon/5 to-transparent pointer-events-none" />
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-24">
        <div className="flex flex-col gap-12">
          {/* Field Detail Card */}
          <Detail params={{ uuid }} />
          
          {/* Schedule Selector */}
          <Schedule params={{ uuid }} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
