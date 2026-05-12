'use client'
import React, { useState, useContext, useEffect } from "react";
import Header from "@/components/organisms/header/Header";
import Footer from "@/components/organisms/footer/Footer";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { 
  UserIcon, 
  ShoppingBagIcon, 
  ChevronRightIcon,
  TicketIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/outline";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext) as any;
  const [activeTab, setActiveTab] = useState<'history' | 'profile'>('history');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone_number: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || ""
      });
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const response = await apiRequest('get', `${apiConfig.order.baseUrl}/api/v1/order/user`, {
        serviceConfig: apiConfig.order,
        token: user.token
      });
      
      const sortedBookings = (response.data.data || []).sort((a: any, b: any) => {
        return moment(b.order_date).valueOf() - moment(a.order_date).valueOf();
      });

      setBookings(sortedBookings);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error("Gagal memuat riwayat booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'order-success':
        return { label: 'Lunas', class: 'bg-green-100 text-green-600' };
      case 'pending':
        return { label: 'Menunggu Pembayaran', class: 'bg-amber-100 text-amber-600' };
      case 'expired':
        return { label: 'Kedaluwarsa', class: 'bg-red-100 text-red-600' };
      default:
        return { label: status, class: 'bg-gray-100 text-gray-600' };
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, user?.token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uuid || !user?.token) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest('put', `${apiConfig.user.baseUrl}/api/v1/auth/${user.uuid}`, {
        serviceConfig: apiConfig.user,
        token: user.token,
        data: {
          ...profileData,
          username: user.username
        }
      });
      
      const updatedUser = { ...user, ...response.data.data };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-44 pb-24">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-padel-dark uppercase mb-2">
            HELLO, <span className="text-padel-neon bg-padel-dark px-4 py-1 inline-block -skew-x-6">{user?.name?.split(' ')[0] || 'PLAYER'}</span>
          </h1>
          <p className="text-gray-500 font-medium">Kelola pesanan dan data dirimu dengan mudah.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-80 space-y-2">
            <button 
              onClick={() => setActiveTab('history')}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group",
                activeTab === 'history' 
                  ? "bg-padel-dark text-white shadow-xl" 
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
              )}
            >
              <div className="flex items-center space-x-4">
                <ShoppingBagIcon className={cn("w-6 h-6", activeTab === 'history' ? "text-padel-neon" : "text-gray-300 group-hover:text-padel-dark")} />
                <span className="font-bold uppercase tracking-tight italic">Booking History</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 opacity-50" />
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group",
                activeTab === 'profile' 
                  ? "bg-padel-dark text-white shadow-xl" 
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
              )}
            >
              <div className="flex items-center space-x-4">
                <UserIcon className={cn("w-6 h-6", activeTab === 'profile' ? "text-padel-neon" : "text-gray-300 group-hover:text-padel-dark")} />
                <span className="font-bold uppercase tracking-tight italic">Profile Settings</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 opacity-50" />
            </button>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1">
            {activeTab === 'history' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-black italic text-padel-dark uppercase tracking-tight">Recent Bookings</h2>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bookings.length} Total</span>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <div className="w-12 h-12 border-4 border-padel-dark border-t-padel-neon rounded-full animate-spin mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <TicketIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Belum ada riwayat booking.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((booking) => (
                      <div key={booking.code} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl transition-all duration-500 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start space-x-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-padel-neon transition-colors duration-500">
                              <TicketIcon className="w-8 h-8 text-padel-dark opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="text-lg font-black text-padel-dark uppercase italic tracking-tight">Order #{booking.code}</h3>
                                <span className={cn(
                                  "text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest",
                                  getStatusDisplay(booking.status).class
                                )}>
                                  {getStatusDisplay(booking.status).label}
                                </span>
                              </div>
                              
                              {/* schedules details */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {booking.schedules?.map((schedule: any, idx: number) => (
                                  <div key={idx} className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl flex flex-col">
                                    <span className="text-[10px] font-black text-padel-dark italic uppercase">{schedule.field_name}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                      {moment(schedule.date).format('DD MMM')} • {schedule.time}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm font-bold text-gray-400 mt-3">
                                <div className="flex items-center space-x-2">
                                  <CalendarDaysIcon className="w-4 h-4" />
                                  <span>{moment(booking.order_date).format('DD MMM YYYY, HH:mm')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CreditCardIcon className="w-4 h-4" />
                                  <span>{booking.amount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                            {booking.payment_link && booking.status === 'PENDING' && (
                              <a 
                                href={booking.payment_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-black text-padel-dark bg-padel-neon px-6 py-3 rounded-xl hover:brightness-110 transition-all uppercase tracking-widest flex items-center gap-2"
                              >
                                Bayar Sekarang
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </a>
                            )}
                            {booking.invoice_link && (
                              <a 
                                href={booking.invoice_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-black text-white bg-padel-dark px-6 py-3 rounded-xl hover:bg-padel-dark/90 transition-all uppercase tracking-widest flex items-center gap-2"
                              >
                                Invoice
                                <DocumentArrowDownIcon className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {bookings.length > itemsPerPage && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 px-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Halaman {currentPage} dari {Math.ceil(bookings.length / itemsPerPage)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-6 py-3 text-xs font-black italic uppercase bg-white border border-gray-100 rounded-2xl text-padel-dark hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                          >
                            Sebelumnya
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(bookings.length / itemsPerPage) }, (_, i) => i + 1)
                              .filter(page => {
                                const totalPages = Math.ceil(bookings.length / itemsPerPage);
                                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                              })
                              .reduce((acc: any[], page, index, array) => {
                                if (index > 0 && page - array[index - 1] > 1) {
                                  acc.push('...');
                                }
                                acc.push(page);
                                return acc;
                              }, [])
                              .map((page, index) => (
                                <button
                                  key={index}
                                  disabled={page === '...'}
                                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                  className={cn(
                                    "w-10 h-10 flex items-center justify-center text-xs font-black italic uppercase rounded-2xl transition-all",
                                    page === currentPage 
                                      ? "bg-padel-dark text-padel-neon shadow-lg" 
                                      : page === '...' 
                                        ? "text-gray-400 cursor-default"
                                        : "bg-white border border-gray-100 text-padel-dark hover:bg-gray-50"
                                  )}
                                >
                                  {page}
                                </button>
                              ))
                            }
                          </div>

                          <button 
                            disabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-6 py-3 text-xs font-black italic uppercase bg-white border border-gray-100 rounded-2xl text-padel-dark hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                          >
                            Selanjutnya
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
                <div className="mb-10">
                  <h2 className="text-2xl font-black italic text-padel-dark uppercase tracking-tighter mb-2">Data Diri</h2>
                  <p className="text-gray-400 text-sm font-medium">Update informasi personal anda secara berkala.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                      <div className="relative group">
                        <IdentificationIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-padel-dark transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-5 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Username</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-padel-dark transition-colors" />
                        <input 
                          type="text" 
                          value={user?.username || ""}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-5 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all opacity-50 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                      <div className="relative group">
                        <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-padel-dark transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-5 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                      <div className="relative group">
                        <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-padel-dark transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={profileData.phone_number}
                          onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-5 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-padel-dark text-white px-10 py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-padel-dark/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}