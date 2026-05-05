'use client'
import Link from "next/link";
import LoginForm from "@/components/organisms/login/LoginForm";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function Login() {
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-padel-neon opacity-[0.03] blur-[100px] -mr-48 -mt-48 rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-padel-neon opacity-[0.03] blur-[100px] -ml-48 -mb-48 rounded-full" />

      <div className="w-full max-w-xl relative z-10">
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
        <div className="bg-padel-secondary/50 backdrop-blur-xl border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-white text-sm font-black tracking-[0.3em] uppercase mb-4 opacity-50 italic">
              Welcome Back
            </h2>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
              MASUK KE <span className="text-padel-neon">PADELBOOK</span>
            </h1>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
