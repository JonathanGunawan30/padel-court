'use client'
import Link from "next/link";
import RegisterForm from "@/components/organisms/register/RegisterForm";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-padel-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-padel-neon opacity-[0.03] blur-[100px] -mr-64 -mt-64 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-padel-neon opacity-[0.03] blur-[100px] -ml-64 -mb-64 rounded-full" />

      <div className="w-full max-w-4xl relative z-10 py-12">
        {/* Back to Home */}
        <div className="mb-12 flex justify-center">
          <Link 
            href="/" 
            className="flex items-center space-x-3 text-white/40 hover:text-padel-neon transition-all group"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-padel-neon/50">
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm tracking-widest uppercase">Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-padel-secondary/50 backdrop-blur-xl border border-white/5 p-8 md:p-12 lg:p-16 rounded-[3rem] shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-white text-sm font-black tracking-[0.3em] uppercase mb-4 opacity-50 italic">
              Join the Community
            </h2>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
              DAFTAR AKUN <span className="text-padel-neon">PADELBOOK</span>
            </h1>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}