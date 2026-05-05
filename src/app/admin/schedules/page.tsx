'use client'
import React, { useEffect, useState, useContext } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MySwal = withReactContent(Swal);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Padel style swal configuration
const swalConfig: any = {
  customClass: {
    container: 'swal-container',
    popup: 'rounded-[2rem] border-none shadow-2xl p-8',
    title: 'font-black italic uppercase tracking-tighter text-padel-dark text-2xl',
    confirmButton: 'bg-padel-dark text-padel-neon px-8 py-3 rounded-xl font-black italic uppercase tracking-widest text-xs hover:bg-padel-dark/90 transition-all border-none outline-none focus:ring-0',
    cancelButton: 'bg-gray-100 text-gray-400 px-8 py-3 rounded-xl font-black italic uppercase tracking-widest text-xs hover:bg-gray-200 transition-all border-none outline-none focus:ring-0'
  },
  buttonsStyling: false
};

export default function ScheduleManagement() {
  const { user } = useContext(AuthContext) as any;
  const [schedules, setSchedules] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Selection state for Bulk Delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [formData, setFormData] = useState({
    field_id: "",
    month: moment().month() + 1,
    year: moment().year()
  });

  const fetchFields = async () => {
    try {
      const response = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/field`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      setFields(response.data.data || []);
    } catch (error) {}
  };

  const fetchSchedules = async (page = 1) => {
    if (!user?.token) return;
    setIsLoading(true);
    setSelectedIds([]); // Clear selection on page change
    try {
      const response = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/field/schedule/pagination?page=${page}&limit=${pagination.limit}&sort_column=date&sort_order=desc`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      const result = response.data.data;
      setSchedules(result.data || []);
      setPagination({
        ...pagination,
        page: result.page,
        total: result.total_data,
        totalPages: result.total_page
      });
    } catch (error) {
      toast.error("Gagal memuat jadwal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
    fetchSchedules(pagination.page);
  }, [user?.token, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !formData.field_id) return;

    setIsGenerating(true);
    try {
      await apiRequest('post', `${apiConfig.field.baseUrl}/api/v1/field/schedule/one-month`, {
        serviceConfig: apiConfig.field,
        token: user.token,
        data: {
          field_id: formData.field_id,
          month: parseInt(formData.month.toString()),
          year: parseInt(formData.year.toString())
        }
      });
      toast.success("Jadwal satu bulan berhasil dibuat!");
      setIsModalOpen(false);
      fetchSchedules(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat jadwal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    const result = await MySwal.fire({
      ...swalConfig,
      title: 'Hapus Jadwal?',
      text: "Hapus slot waktu ini dari sistem.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      iconColor: '#0a0a0a'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest('delete', `${apiConfig.field.baseUrl}/api/v1/field/schedule/${uuid}`, {
          serviceConfig: apiConfig.field,
          token: user.token
        });
        toast.success("Jadwal dihapus.");
        fetchSchedules(pagination.page);
      } catch (error) {
        toast.error("Gagal menghapus jadwal.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await MySwal.fire({
      ...swalConfig,
      title: 'Hapus Massal?',
      text: `Anda akan menghapus ${selectedIds.length} slot jadwal sekaligus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Batal',
      iconColor: '#0a0a0a'
    });

    if (result.isConfirmed) {
      setIsBulkDeleting(true);
      let successCount = 0;
      let failCount = 0;

      for (const uuid of selectedIds) {
        try {
          await apiRequest('delete', `${apiConfig.field.baseUrl}/api/v1/field/schedule/${uuid}`, {
            serviceConfig: apiConfig.field,
            token: user.token
          });
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      setIsBulkDeleting(false);
      setSelectedIds([]);
      
      if (failCount > 0) {
        toast.warning(`${successCount} berhasil dihapus, ${failCount} gagal.`);
      } else {
        toast.success(`Semua (${successCount}) jadwal berhasil dihapus.`);
      }
      
      fetchSchedules(pagination.page);
    }
  };

  const toggleSelect = (uuid: string) => {
    setSelectedIds(prev => 
      prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(schedules.map(s => s.uuid));
    }
  };

  const totalPages = pagination.totalPages;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md w-full">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari jadwal..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-padel-neon/50 outline-none transition-all"
            />
          </div>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg"
            >
              <TrashIcon className="w-5 h-5" />
              {isBulkDeleting ? 'Deleting...' : `Hapus (${selectedIds.length})`}
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-padel-dark text-padel-neon px-6 py-3 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-padel-dark/90 transition-all shadow-lg"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Generate Bulanan
        </button>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50/50">
                <th className="px-8 py-5 w-10">
                  <button 
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      selectedIds.length === schedules.length && schedules.length > 0
                        ? "bg-padel-dark border-padel-dark text-padel-neon" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    {selectedIds.length === schedules.length && schedules.length > 0 && <CheckIcon className="w-3 h-3 stroke-[4]" />}
                  </button>
                </th>
                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Lapangan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Tanggal</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Jam</th>
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
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Belum ada jadwal yang terbuat.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.uuid} className={cn("hover:bg-gray-50/30 transition-colors group", selectedIds.includes(schedule.uuid) && "bg-padel-neon/5")}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleSelect(schedule.uuid)}
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all",
                          selectedIds.includes(schedule.uuid)
                            ? "bg-padel-dark border-padel-dark text-padel-neon" 
                            : "bg-white border-gray-300"
                        )}
                      >
                        {selectedIds.includes(schedule.uuid) && <CheckIcon className="w-3 h-3 stroke-[4]" />}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <p className="font-black text-padel-dark uppercase italic tracking-tight">{schedule.field_name}</p>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-bold">
                      {moment(schedule.date).format('DD MMM YYYY')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <ClockIcon className="w-4 h-4" />
                        <span className="font-mono font-bold text-padel-dark">{schedule.time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full italic tracking-widest ${
                        schedule.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => handleDelete(schedule.uuid)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
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
            Page {pagination.page} of {Math.max(1, totalPages)}
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
              disabled={pagination.page >= totalPages || isLoading}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-xs font-black italic uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-padel-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 lg:p-12">
            <h2 className="text-2xl font-black italic text-padel-dark uppercase tracking-tight mb-8">Generate Jadwal</h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Pilih Lapangan</label>
                <select 
                  required
                  value={formData.field_id}
                  onChange={(e) => setFormData({...formData, field_id: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                >
                  <option value="">Pilih Lapangan</option>
                  {fields.map(f => (
                    <option key={f.uuid} value={f.uuid}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Bulan</label>
                  <input 
                    type="number" 
                    min="1" max="12"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Tahun</label>
                  <input 
                    type="number" 
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-padel-dark text-padel-neon py-5 rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all shadow-xl disabled:opacity-50 mt-4"
              >
                {isGenerating ? "Processing..." : "Generate Sekarang"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}