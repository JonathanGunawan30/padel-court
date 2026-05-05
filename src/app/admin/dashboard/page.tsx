'use client'
import React, { useEffect, useState, useContext } from "react";
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";

export default function AdminOverview() {
  const { user } = useContext(AuthContext) as any;
  const [stats, setStats] = useState([
    { name: 'Total Revenue', value: 'Rp 12.500.000', icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-500" />, trend: '+12.5%', color: 'bg-emerald-50' },
    { name: 'Active Bookings', value: '42', icon: <CalendarDaysIcon className="w-6 h-6 text-padel-dark" />, trend: '+8.2%', color: 'bg-gray-50' },
    { name: 'Total Orders', value: '156', icon: <ShoppingBagIcon className="w-6 h-6 text-amber-500" />, trend: '+5.4%', color: 'bg-amber-50' },
    { name: 'New Customers', value: '28', icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />, trend: '+14.1%', color: 'bg-blue-50' },
  ]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user?.token) return;
      try {
        const response = await apiRequest('get', `${apiConfig.order.baseUrl}/api/v1/order?page=1&limit=5`, {
          serviceConfig: apiConfig.order,
          token: user.token
        });
        setRecentOrders(response.data.data.data || []);
      } catch (error) {
        toast.error("Gagal memuat pesanan terbaru.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, [user?.token]);

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
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.name}</h3>
            <p className="text-2xl font-black italic text-padel-dark mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts / Tables Placeholder */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-black italic text-padel-dark uppercase tracking-tight">Recent Orders</h2>
            <button className="text-xs font-black text-padel-dark hover:text-padel-neon transition-colors uppercase tracking-widest">
              View All
            </button>
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
                          order.status === 'PAYMENT_SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Field Summary */}
        <div className="bg-padel-dark rounded-[2.5rem] p-8 text-white">
          <h2 className="text-xl font-black italic uppercase tracking-tight mb-8">System Health</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Field Availability</span>
                <span className="text-padel-neon">85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-padel-neon w-[85%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Schedule Completion</span>
                <span className="text-padel-neon">92%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-padel-neon w-[92%]" />
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">Quick Actions</h3>
            <button className="w-full py-4 bg-padel-neon text-padel-dark rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all text-xs">
              Generate Weekly Schedule
            </button>
            <button className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all text-xs">
              Add New Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}