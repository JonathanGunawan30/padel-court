'use client'
import React, { useEffect, useState, useContext } from "react";
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OrderManagement() {
  const { user } = useContext(AuthContext) as any;
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest",
                        getStatusDisplay(order.status).class
                      )}>
                        {getStatusDisplay(order.status).label}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="p-2 text-gray-400 hover:text-padel-dark hover:bg-gray-100 rounded-xl transition-all"
                        >
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
        <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing Page {pagination.page} of {Math.max(1, pagination.totalPages)}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full">
            <button 
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-4 py-2 text-xs font-black italic uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shrink-0"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-1">
              {(() => {
                const range = [];
                const delta = 1;
                const left = pagination.page - delta;
                const right = pagination.page + delta + 1;
                let l: any;

                for (let i = 1; i <= pagination.totalPages; i++) {
                  if (i === 1 || i === pagination.totalPages || (i >= left && i < right)) {
                    range.push(i);
                  }
                }

                return range.reduce((acc: any[], i) => {
                  if (l) {
                    if (i - l === 2) {
                      acc.push(l + 1);
                    } else if (i - l !== 1) {
                      acc.push('...');
                    }
                  }
                  acc.push(i);
                  l = i;
                  return acc;
                }, []).map((page, index) => (
                  <button
                    key={index}
                    disabled={page === '...' || isLoading}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    className={cn(
                      "min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-black italic uppercase rounded-xl transition-all",
                      page === pagination.page 
                        ? "bg-padel-dark text-padel-neon shadow-lg shadow-padel-dark/10" 
                        : page === '...' 
                          ? "text-gray-400 cursor-default"
                          : "bg-white border border-gray-200 text-padel-dark hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ));
              })()}
            </div>

            <button 
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-xs font-black italic uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shrink-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-padel-dark/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black italic text-padel-dark uppercase tracking-tighter">Order Details</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">#{selectedOrder.code}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Schedules Section */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CalendarDaysIcon className="w-3 h-3" /> Booked Schedules
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {selectedOrder.schedules?.map((schedule: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-padel-dark text-padel-neon rounded-xl flex items-center justify-center font-black italic text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-padel-dark text-sm">{schedule.field_name}</p>
                          <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                            {moment(schedule.date).format('DD MMM YYYY')} • {schedule.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Customer
                  </p>
                  <p className="font-bold text-padel-dark">{selectedOrder.user_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarDaysIcon className="w-3 h-3" /> Order Date
                  </p>
                  <p className="font-bold text-padel-dark">{moment(selectedOrder.order_date).format('DD MMM YYYY, HH:mm')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCardIcon className="w-3 h-3" /> Total Amount
                  </p>
                  <p className="text-xl font-black italic text-padel-dark">Rp {selectedOrder.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                  <span className={cn(
                    "inline-block text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest mt-1",
                    getStatusDisplay(selectedOrder.status).class
                  )}>
                    {getStatusDisplay(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex flex-wrap gap-4">
                {selectedOrder.status === 'pending' && selectedOrder.payment_link && (
                  <a 
                    href={selectedOrder.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 bg-padel-neon text-padel-dark rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all text-xs"
                  >
                    Payment Link
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                )}
                {selectedOrder.invoice_link && (
                  <a 
                    href={selectedOrder.invoice_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 bg-padel-dark text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-padel-dark/90 transition-all text-xs shadow-lg shadow-padel-dark/10"
                  >
                    Download Invoice
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  </a>
                )}
                {!selectedOrder.invoice_link && selectedOrder.status !== 'pending' && (
                   <p className="text-center w-full text-gray-400 text-xs font-bold uppercase tracking-widest italic py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      No document available for this order status.
                   </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
