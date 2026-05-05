'use client'
import React, { useEffect, useState, useContext } from "react";
import { 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";

export default function OrderManagement() {
  const { user } = useContext(AuthContext) as any;
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchOrders = async (page = 1) => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const response = await apiRequest('get', `${apiConfig.order.baseUrl}/api/v1/order?page=${page}&limit=${pagination.limit}&sort_column=created_at&sort_order=desc`, {
        serviceConfig: apiConfig.order,
        token: user.token
      });
      const result = response.data.data;
      setOrders(result.data || []);
      setPagination({
        ...pagination,
        page: result.page,
        total: result.total_data,
        totalPages: result.total_page
      });
    } catch (error) {
      toast.error("Gagal memuat daftar pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [user?.token, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari order ID atau nama customer..." 
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-padel-neon/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{pagination.total} Total Pesanan</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-padel-dark border-t-padel-neon rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Belum ada data pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.uuid} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-padel-dark uppercase italic tracking-tight">#{order.code}</p>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-600">
                      {order.user_name}
                    </td>
                    <td className="px-8 py-6 text-gray-400 font-medium">
                      {moment(order.order_date).format('DD MMM YYYY, HH:mm')}
                    </td>
                    <td className="px-8 py-6 font-black text-padel-dark text-lg">
                      Rp {order.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest ${
                        order.status === 'PAYMENT_SUCCESS' ? 'bg-green-100 text-green-600' : 
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end">
                        <button className="p-2 text-gray-400 hover:text-padel-dark hover:bg-gray-100 rounded-xl transition-all">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Page {pagination.page} of {Math.max(1, pagination.totalPages)}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-4 py-2 text-xs font-black italic uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <button 
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-xs font-black italic uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}