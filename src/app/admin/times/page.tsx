'use client'
import React, { useEffect, useState, useContext } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  ClockIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest } from "@/library/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MySwal = withReactContent(Swal);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export default function TimeManagement() {
  const { user } = useContext(AuthContext) as any;
  const [times, setTimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: ""
  });

  const fetchTimes = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const response = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/time`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      setTimes(response.data.data || []);
    } catch (error) {
      toast.error("Gagal memuat data jam operasional.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, [user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('post', `${apiConfig.field.baseUrl}/api/v1/time`, {
        serviceConfig: apiConfig.field,
        token: user.token,
        data: formData
      });
      toast.success("Jam operasional berhasil ditambahkan!");
      setIsModalOpen(false);
      setFormData({ start_time: "", end_time: "" });
      fetchTimes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  const handleDelete = async (uuid: string) => {
    const result = await MySwal.fire({
      ...swalConfig,
      title: 'Hapus Slot Jam?',
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      iconColor: '#0a0a0a'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest('delete', `${apiConfig.field.baseUrl}/api/v1/time/${uuid}`, {
          serviceConfig: apiConfig.field,
          token: user.token
        });
        toast.success("Slot jam berhasil dihapus.");
        fetchTimes();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal menghapus slot jam.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black italic text-padel-dark uppercase tracking-tight">Jam Operasional</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Master data slot waktu untuk generate jadwal.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-padel-dark text-padel-neon px-6 py-3 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-padel-dark/90 transition-all shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Tambah Slot Jam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-10 h-10 border-4 border-padel-dark border-t-padel-neon rounded-full animate-spin mx-auto" />
          </div>
        ) : times.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
            <ClockIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada data jam operasional.</p>
          </div>
        ) : (
          times.map((time, index) => (
            <div key={`${time.uuid}-${index}`} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-padel-dark group-hover:bg-padel-neon transition-colors">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-black text-padel-dark italic tracking-tight">{time.start_time.substring(0, 5)} - {time.end_time.substring(0, 5)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Time Slot</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(time.uuid)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-padel-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 lg:p-12">
            <h2 className="text-2xl font-black italic text-padel-dark uppercase tracking-tight mb-8">Tambah Slot Jam</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Jam Mulai</label>
                <input 
                  type="time" 
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Jam Selesai</label>
                <input 
                  type="time" 
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-padel-dark text-padel-neon py-5 rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-4"
              >
                Simpan Slot Jam
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}