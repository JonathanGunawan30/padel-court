'use client'
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";

export default function AdminOverview() {
  const { user } = useContext(AuthContext) as any;
  const [stats, setStats] = useState<any[]>([
    { name: 'Total Revenue', value: '...', icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50' },
    { name: 'Total Orders', value: '...', icon: <ShoppingBagIcon className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
    { name: 'Total Lapangan', value: '...', icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50' },
    { name: 'Total Jadwal', value: '...', icon: <CalendarDaysIcon className="w-6 h-6 text-padel-dark" />, color: 'bg-gray-50' },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.token) return;
    try {
      // Fetch orders for stats and recent list
      const orderResponse = await apiRequest('get', `${apiConfig.order.baseUrl}/api/v1/order?page=1&limit=100`, {
        serviceConfig: apiConfig.order,
        token: user.token
      });
      
      const allOrders = orderResponse.data?.data?.data || [];
      const totalOrders = orderResponse.data?.data?.total_data || 0;
      
      const totalRevenue = allOrders
        .filter((o: any) => o.status === 'order-success')
        .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

      // Fetch fields
      const fieldResponse = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/field/pagination?page=1&limit=1&sort_column=id&sort_order=desc`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      const totalFields = fieldResponse.data?.data?.total_data || 0;

      // Fetch schedules
      const scheduleResponse = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/field/schedule/pagination?page=1&limit=1&sort_column=id&sort_order=desc`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      const totalSchedules = scheduleResponse.data?.data?.total_data || 0;
      
      setStats([
        { 
          name: 'Total Revenue', 
          value: `Rp ${totalRevenue.toLocaleString()}`, 
          icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-500" />, 
          color: 'bg-emerald-50' 
        },
        { 
          name: 'Total Orders', 
          value: totalOrders.toString(), 
          icon: <ShoppingBagIcon className="w-6 h-6 text-amber-500" />, 
          color: 'bg-amber-50' 
        },
        { 
          name: 'Total Lapangan', 
          value: totalFields.toString(), 
          icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />, 
          color: 'bg-blue-50' 
        },
        { 
          name: 'Total Jadwal', 
          value: totalSchedules.toString(), 
          icon: <CalendarDaysIcon className="w-6 h-6 text-padel-dark" />, 
          color: 'bg-gray-50' 
        },
      ]);

      setRecentOrders(allOrders.slice(0, 5));
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.token]);

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

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.color} rounded-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.name}</h3>
            <p className="text-2xl font-black italic text-padel-dark mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-black italic text-padel-dark uppercase tracking-tight">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-black text-padel-dark hover:text-padel-neon transition-colors uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center">
                      <div className="w-8 h-8 border-4 border-padel-dark border-t-padel-neon rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.code} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-black text-padel-dark">#{order.code}</td>
                      <td className="px-8 py-6 font-bold text-gray-500">{order.user_name}</td>
                      <td className="px-8 py-6 text-gray-400">{moment(order.order_date).format('DD MMM YYYY')}</td>
                      <td className="px-8 py-6 font-black text-padel-dark">Rp {order.amount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest ${
                          getStatusDisplay(order.status).class
                        }`}>
                          {getStatusDisplay(order.status).label}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-padel-dark rounded-[2.5rem] p-8 text-white">
          <h2 className="text-xl font-black italic uppercase tracking-tight mb-8">Quick Actions</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">Management</h3>
            <Link 
              href="/admin/schedules"
              className="flex items-center justify-center w-full py-4 bg-padel-neon text-padel-dark rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all text-xs"
            >
              Kelola Jadwal
            </Link>
            <Link 
              href="/admin/fields"
              className="flex items-center justify-center w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all text-xs"
            >
              Tambah Lapangan
            </Link>
            <Link 
              href="/admin/orders"
              className="flex items-center justify-center w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all text-xs"
            >
              Lihat Pesanan
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
             <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-padel-neon mb-2">Admin Note</p>
                <p className="text-xs text-white/50 leading-relaxed font-medium">
                  Gunakan dashboard ini untuk memantau performa bisnis dan mengelola operasional lapangan Padel Anda.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
