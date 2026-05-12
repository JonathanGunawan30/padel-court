'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/organisms/header/Header';
import Footer from '@/components/organisms/footer/Footer';

// Dynamic import for Lottie to prevent SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Memuat animation dari public folder
    fetch('/animations/not-found.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Gagal memuat animasi 404:", err));
  }, []);

  return (
    <main className="bg-[#F8F9FA] min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center pt-32 pb-20 text-center">
        {/* Lottie Animation Container */}
        <div className="w-full max-w-[300px] md:max-w-[450px] aspect-square mb-8">
          {animationData ? (
            <Lottie 
              animationData={animationData} 
              loop={true} 
              className="w-full h-full"
            />
          ) : (
            /* Placeholder saat loading animasi */
            <div className="w-full h-full bg-gray-100 rounded-[3rem] animate-pulse flex items-center justify-center">
              <span className="text-4xl font-black text-gray-200 italic uppercase">404</span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-padel-dark uppercase">
            Halaman <span className="text-padel-neon bg-padel-dark px-4 py-1 inline-block -skew-x-6">Hilang!</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm md:text-base px-4">
            Sepertinya bola pukulanmu keluar lapangan. Halaman yang kamu cari tidak ditemukan.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-12">
          <Link 
            href="/"
            className="inline-block bg-padel-dark text-white px-10 py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] hover:bg-padel-dark/90 transition-all shadow-xl hover:shadow-2xl active:scale-95 group"
          >
            <span className="flex items-center gap-3">
              Kembali ke Home
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={3} 
                stroke="currentColor" 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
