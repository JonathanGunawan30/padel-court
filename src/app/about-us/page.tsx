'use client'
import Header from "@/components/organisms/header/Header";
import Footer from "@/components/organisms/footer/Footer";
import React, { useState, useEffect } from "react";
import { 
  TrophyIcon, 
  UsersIcon, 
  HeartIcon, 
  SparklesIcon,
  GlobeAltIcon,
  HandRaisedIcon
} from "@heroicons/react/24/outline";

const Counter = ({ end, duration = 2000 }: { end: string, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    // Extract numeric part (including decimal) and suffix
    const match = end.match(/(\d+\.?\d*)(.*)/);
    if (!match) return;
    
    const targetValue = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes('.');

    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = progress * targetValue;
      
      const formattedNumber = isDecimal 
        ? currentCount.toFixed(1) 
        : Math.floor(currentCount).toLocaleString();
        
      setDisplayValue(`${formattedNumber}${suffix}`);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{displayValue}</span>;
};

export default function AboutUs() {
  const stats = [
    { label: "Pemain Aktif", value: "5000+", icon: <UsersIcon className="w-6 h-6" /> },
    { label: "Turnamen Selesai", value: "120+", icon: <TrophyIcon className="w-6 h-6" /> },
    { label: "Total Courts", value: "12+", icon: <GlobeAltIcon className="w-6 h-6" /> },
    { label: "Rating Kepuasan", value: "4.9/5", icon: <HeartIcon className="w-6 h-6" /> },
  ];

  const values = [
    {
      title: "Komunitas Pertama",
      description: "Kami percaya Padel adalah tentang membangun hubungan dan komunitas yang sehat di atas lapangan.",
      icon: <HandRaisedIcon className="w-8 h-8 text-padel-neon" />,
    },
    {
      title: "Inovasi Digital",
      description: "Memberikan pengalaman booking terbaik dengan teknologi terkini untuk memudahkan setiap langkahmu.",
      icon: <SparklesIcon className="w-8 h-8 text-padel-neon" />,
    },
    {
      title: "Kualitas Premium",
      description: "Hanya bekerja sama dengan lapangan berkualitas tinggi untuk memastikan pengalaman bermain terbaik.",
      icon: <TrophyIcon className="w-8 h-8 text-padel-neon" />,
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 bg-padel-dark overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter mb-8 uppercase leading-tight">
              MENDIFINISIKAN ULANG <br />
              <span className="text-padel-neon">DUNIA PADEL</span>
            </h1>
            <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed">
              PadelBook lahir dari gairah untuk menyatukan olahraga dan teknologi. Kami adalah platform booking padel terdepan yang berdedikasi untuk mempermudah akses lapangan bagi setiap pecinta padel di Indonesia.
            </p>
          </div>
        </div>
        
        {/* Background Image/Overlay */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-30 lg:opacity-50">
          <img 
            src="https://images.unsplash.com/photo-1721596701108-7a5695029e28?q=80&w=2070&auto=format&fit=crop" 
            alt="Padel Court" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-padel-dark via-padel-dark/80 to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center flex flex-col items-center">
              <div className="p-3 bg-gray-50 rounded-2xl text-padel-dark mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black italic text-padel-dark mb-1">
                <Counter end={stat.value} />
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 lg:py-32 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop" 
                alt="Padel Community" 
                className="rounded-[3rem] shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-padel-neon rounded-[3rem] -z-10 hidden lg:block" />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-padel-dark opacity-30 font-black italic tracking-widest uppercase mb-4 block">Our Story</span>
            <h2 className="text-4xl lg:text-6xl font-black italic text-padel-dark uppercase mb-8 tracking-tighter">DIMULAI DARI SATU <br /><span className="text-padel-neon">SMASH</span></h2>
            <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-lg">
              <p>
                Didirikan pada tahun 2024, PadelBook berawal dari kesulitan kami sendiri dalam mencari dan memesan lapangan padel yang semakin populer. Kami menyadari bahwa olahraga yang luar biasa ini membutuhkan infrastruktur digital yang sama luar biasanya.
              </p>
              <p>
                Visi kami sederhana: Menghilangkan hambatan antara pemain dan lapangan. Kami membangun ekosistem di mana siapapun, dari pemula hingga profesional, dapat menemukan tempat bermain dalam hitungan detik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black italic text-padel-dark uppercase mb-6 tracking-tighter">NILAI YANG KAMI PEGANG</h2>
            <p className="text-gray-500 font-medium">Kualitas dan integritas adalah inti dari setiap baris kode dan setiap kemitraan yang kami bangun.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-padel-dark rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black italic text-padel-dark uppercase mb-4 tracking-tight">{value.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="bg-padel-dark rounded-[4rem] p-12 lg:p-24 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white italic uppercase mb-8 tracking-tighter">
              SIAP UNTUK BERGABUNG <br />
              DENGAN <span className="text-padel-neon">KOMUNITAS KAMI?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-12 py-5 bg-padel-neon text-padel-dark font-black italic uppercase rounded-full hover:brightness-110 transition-all shadow-xl text-lg">
                Mulai Main Sekarang
              </button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-padel-neon/10 blur-[100px] -ml-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-padel-neon/5 blur-[120px] -mr-48 -mb-48 rounded-full" />
        </div>
      </section>

      <Footer />
    </main>
  );
}