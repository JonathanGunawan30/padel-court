'use client'
import React, {useContext, useEffect, useState} from "react";
import moment from "moment/moment";
import apiConfig from "@/config/api";
import {Hash} from "node:crypto";
import crypto from "crypto";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {toast} from "react-toastify";
import {AuthContext} from "@/context/AuthProvider";
import {useRouter} from "next/navigation";
import Button from "@/components/atoms/Button";
import Swal from "sweetalert2";
import {status} from "@/constants/status";
import {message} from "@/constants/message";
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  CheckCircleIcon,
  CreditCardIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Schedule({params}: { params: { uuid: any } }) {
  const uuid = params.uuid
  const [today, setToday] = useState<Date>(new Date());
  const [cards, setCards] = useState<any>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {user} = useContext(AuthContext) as any;

  const fetchData = async (selectedDate: any) => {
    if (!uuid) return;
    
    try {
      const now: string = moment(selectedDate || new Date()).format('YYYY-MM-DD');
      const serviceName: string | undefined = apiConfig.field.serviceName;
      const signatureKey: string | undefined = apiConfig.field.signatureKey;
      const requestAt: string = new Date().toISOString();
      const validateKey: string = `${serviceName}:${signatureKey}:${requestAt}`;
      const hash: Hash = crypto.createHash('sha256');
      hash.update(validateKey);
      const apiKey: string = hash.digest('hex');
      
      const response = await axios.get(`${apiConfig.field.baseUrl}/api/v1/field/schedule/lists/${uuid}`, {
        headers: {
          "x-service-name": serviceName,
          "x-request-at": requestAt,
          "x-api-key": apiKey,
        },
        params: {
          date: now,
        },
      });
      
      const fetchedCards = response.data.data.map((item: any) => ({
        uuid: item.uuid,
        date: item.date,
        pricePerHour: item.price_per_hour,
        status: item.status,
        time: item.time,
        isSelected: false,
      }));

      setCards(fetchedCards);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        toast.error(message.general.ERR_NETWORK);
      } else {
        toast.error(error.response?.data?.message || "Terjadi kesalahan.");
      }
    }
  };

  const calculateTotalPrice = () => {
    return selectedSchedule
      .map((uuid: string) => {
        const card = cards.find((card: any) => card.uuid === uuid);
        return card ? convertToNumber(card.pricePerHour) : 0;
      })
      .reduce((total: number, price: number) => total + price, 0);
  }

  const convertToNumber = (rupiah: string) => {
    if (!rupiah) return 0;
    const numberString = rupiah.replace(/Rp\.|,/g, '').replace(/\./g, '');
    return parseInt(numberString, 10);
  }

  const formatToRupiah = (number: number) => {
    return `Rp ${number.toLocaleString('id-ID')}`;
  }

  useEffect(() => {
    fetchData(today);
  }, [today, uuid]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu.');
      router.push('/login');
      return;
    }

    if (selectedSchedule.length === 0) {
      toast.error('Silahkan pilih jadwal terlebih dahulu.');
      return;
    }

    const totalPrice = calculateTotalPrice();
    
    Swal.fire({
      title: "Konfirmasi Pesanan",
      html: `Anda akan memesan <b>${selectedSchedule.length} sesi</b><br/>Total Harga: <b class="text-padel-neon">${formatToRupiah(totalPrice)}</b>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d9f116",
      cancelButtonColor: "#333",
      confirmButtonText: "<span style='color: #0a0a0a; font-weight: bold;'>Ya, Lanjut Bayar</span>",
      background: "#1a1a1a",
      color: "#fff"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const serviceName = apiConfig.order.serviceName;
          const signatureKey = apiConfig.order.signatureKey;
          const requestAt = new Date().toISOString();
          const validateKey = `${serviceName}:${signatureKey}:${requestAt}`;
          const hash = crypto.createHash('sha256').update(validateKey);
          const apiKey = hash.digest('hex');

          const response = await axios.post(`${apiConfig.order.baseUrl}/api/v1/order`, {
            field_schedule_ids: selectedSchedule,
          }, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "x-service-name": serviceName,
              "x-request-at": requestAt,
              "x-api-key": apiKey,
            }
          });

          toast.success("Order berhasil dibuat!");
          router.push(response.data.data.payment_link);
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.response?.data?.message || "Gagal membuat order.");
        }
      }
    });
  }

  const toggleCardSelection = (uuid: any) => {
    const card = cards.find((c: any) => c.uuid === uuid);
    if (card && card.status !== status.BOOKED) {
      if (selectedSchedule.includes(uuid)) {
        setSelectedSchedule(selectedSchedule.filter((id: any) => id !== uuid));
      } else {
        setSelectedSchedule([...selectedSchedule, uuid]);
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setToday(date);
      setSelectedSchedule([]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Main Schedule Selector */}
      <div className="w-full lg:w-2/3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 text-padel-dark opacity-50 mb-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Step 1</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter text-padel-dark uppercase">
              Pilih Tanggal & Waktu
            </h2>
          </div>

          <div className="relative inline-block min-w-[200px]">
            <DatePicker
              selected={today}
              minDate={new Date()}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-padel-dark focus:outline-none focus:ring-4 focus:ring-padel-neon/20 cursor-pointer shadow-sm"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 mb-8 text-sm font-bold uppercase tracking-wider overflow-x-auto pb-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-4 h-4 rounded-full border-2 border-gray-200 bg-white" />
            <span className="text-gray-400">Tersedia</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-padel-neon" />
            <span className="text-padel-dark">Dipilih</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-gray-100" />
            <span className="text-gray-300">Terbooking</span>
          </div>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.length > 0 ? cards.map((card: any) => {
            const isBooked = card.status === status.BOOKED;
            const isSelected = selectedSchedule.includes(card.uuid);

            return (
              <button
                key={card.uuid}
                disabled={isBooked}
                onClick={() => toggleCardSelection(card.uuid)}
                className={cn(
                  "relative group h-24 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center overflow-hidden",
                  isBooked 
                    ? "bg-gray-50 border-transparent cursor-not-allowed" 
                    : isSelected
                      ? "bg-padel-neon border-padel-neon shadow-lg shadow-padel-neon/20 scale-95"
                      : "bg-white border-gray-100 hover:border-padel-neon/50 hover:shadow-md"
                )}
              >
                <span className={cn(
                  "text-lg font-black italic tracking-tighter mb-1 transition-colors",
                  isBooked ? "text-gray-300" : isSelected ? "text-padel-dark" : "text-padel-dark"
                )}>
                  {card.time.split(' - ').map((t: string) => t.substring(0, 5)).join(' - ')}
                </span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  isBooked ? "text-gray-200" : isSelected ? "text-padel-dark/60" : "text-gray-400"
                )}>
                  {isBooked ? "Terbooking" : card.pricePerHour}
                </span>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="w-4 h-4 text-padel-dark" />
                  </div>
                )}
              </button>
            )
          }) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <ExclamationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">Jadwal tidak tersedia untuk tanggal ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-32 space-y-6">
        <div className="bg-padel-dark rounded-[2.5rem] p-8 lg:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-padel-neon mb-6 opacity-80">
              <CreditCardIcon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Order Summary</span>
            </div>

            <h3 className="text-2xl font-black italic tracking-tighter mb-8 uppercase">
              RINGKASAN <span className="text-padel-neon">PESANAN</span>
            </h3>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Total Sesi</span>
                <span className="text-xl font-black italic">{selectedSchedule.length}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Pajak (0%)</span>
                <span className="text-lg font-black italic">Rp 0</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Total Bayar</p>
                  <p className="text-3xl font-black text-padel-neon italic tracking-tighter leading-none">
                    {formatToRupiah(calculateTotalPrice())}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedSchedule.length === 0}
              className={cn(
                "group w-full py-5 rounded-2xl font-black text-lg italic tracking-tight flex items-center justify-center space-x-3 transition-all",
                isLoading || selectedSchedule.length === 0
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-padel-neon text-padel-dark hover:brightness-110 shadow-[0_0_30px_rgba(217,241,22,0.3)] active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-padel-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>LANJUT KE PEMBAYARAN</span>
                  <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="mt-6 text-[10px] text-white/30 text-center font-bold uppercase tracking-widest">
              Harga sudah termasuk biaya administrasi
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-padel-neon/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        </div>
        
        {/* Help/Notice */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex items-start space-x-4">
          <InformationCircleIcon className="w-6 h-6 text-padel-dark flex-shrink-0" />
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Pembayaran dapat dilakukan melalui Transfer Bank atau E-Wallet. Jadwal yang sudah dipesan tidak dapat dibatalkan atau dijadwal ulang secara mandiri.
          </p>
        </div>
      </div>
    </div>
  )
}
