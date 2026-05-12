'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const statusCode = searchParams.get('status_code');

  const isSuccess = transactionStatus === 'settlement' || transactionStatus === 'capture' || statusCode === '200';
  const isPending = transactionStatus === 'pending' || statusCode === '201';
  const isFailure = transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire';
  
  return (
    <div className="min-h-screen bg-padel-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-padel-secondary border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 ${
            isSuccess ? 'bg-padel-neon/10' : 
            isPending ? 'bg-yellow-500/10' : 
            'bg-red-500/10'
          }`} />
          
          <div className="relative z-10 text-center">
            <div className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full border ${
              isSuccess ? 'bg-padel-neon/10 border-padel-neon/20' : 
              isPending ? 'bg-yellow-500/10 border-yellow-500/20' : 
              'bg-red-500/10 border-red-500/20'
            }`}>
              {isSuccess ? (
                <CheckCircleIcon className="w-12 h-12 text-padel-neon" />
              ) : isPending ? (
                <ClockIcon className="w-12 h-12 text-yellow-500" />
              ) : (
                <XCircleIcon className="w-12 h-12 text-red-500" />
              )}
            </div>
            
            <h1 className="font-display text-4xl text-white mb-4 italic uppercase">
              {isSuccess ? (
                <>TERIMA <span className="text-padel-neon">KASIH!</span></>
              ) : isPending ? (
                <>MENUNGGU <span className="text-yellow-500">PEMBAYARAN</span></>
              ) : (
                <>TRANSAKSI <span className="text-red-500">GAGAL</span></>
              )}
            </h1>
            
            <div className="space-y-4 mb-10">
              <p className="text-white/70 font-medium leading-relaxed">
                {isSuccess 
                  ? "Pembayaran Anda telah berhasil diproses. Silahkan datang sesuai dengan jadwal yang telah dipilih."
                  : isPending
                  ? "Pembayaran Anda sedang menunggu penyelesaian. Silahkan selesaikan pembayaran sesuai instruksi."
                  : "Maaf, transaksi Anda tidak dapat diproses. Silahkan coba lagi atau hubungi layanan pelanggan kami."
                }
              </p>
              
              {orderId && (
                <div className="bg-padel-dark/50 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Order ID</p>
                  <p className="text-padel-neon font-mono text-sm break-all">{orderId}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="w-full bg-padel-neon text-padel-dark font-bold py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(217,241,22,0.2)] text-center"
              >
                Back to Home
              </Link>
              {isSuccess && (
                <Link 
                  href="/dashboard" 
                  className="w-full bg-white/5 text-white/70 font-bold py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10 text-center"
                >
                  View My Bookings
                </Link>
              )}
              {isFailure && (
                <Link 
                  href="/booking" 
                  className="w-full bg-white/5 text-white/70 font-bold py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10 text-center"
                >
                  Try Again
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-padel-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-padel-neon"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
