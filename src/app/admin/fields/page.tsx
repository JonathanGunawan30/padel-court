'use client'
import React, { useEffect, useState, useContext, useRef } from "react";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthProvider";
import apiConfig from "@/config/api";
import { apiRequest, getAuthHeaders } from "@/library/api";
import { toast } from "react-toastify";
import moment from "moment";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

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

export default function FieldManagement() {
  const { user } = useContext(AuthContext) as any;
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price_per_hour: 0
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFields = async (page = 1) => {
    if (!user?.token) return;
    setIsLoading(true);
    setSelectedIds([]);
    try {
      const response = await apiRequest('get', `${apiConfig.field.baseUrl}/api/v1/field/pagination?page=${page}&limit=${pagination.limit}&sort_column=created_at&sort_order=desc`, {
        serviceConfig: apiConfig.field,
        token: user.token
      });
      const result = response.data.data;
      setFields(result.data || []);
      setPagination({
        ...pagination,
        page: result.page,
        total: result.total_data,
        totalPages: result.total_page
      });
    } catch (error) {
      toast.error("Gagal memuat daftar lapangan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields(pagination.page);
  }, [user?.token, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("code", formData.code);
      data.append("price_per_hour", formData.price_per_hour.toString());
      
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      const headers = getAuthHeaders(apiConfig.field, user.token);
      
      if (editingField) {
        // Use axios directly for multipart/form-data with PUT
        await axios.put(`${apiConfig.field.baseUrl}/api/v1/field/${editingField.uuid}`, data, { headers });
        toast.success("Lapangan berhasil diperbarui!");
      } else {
        await axios.post(`${apiConfig.field.baseUrl}/api/v1/field`, data, { headers });
        toast.success("Lapangan baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchFields(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingField(null);
    setFormData({ name: "", code: "", price_per_hour: 0 });
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleDelete = async (uuid: string) => {
    const result = await MySwal.fire({
      ...swalConfig,
      title: 'Hapus Lapangan?',
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      iconColor: '#0a0a0a'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest('delete', `${apiConfig.field.baseUrl}/api/v1/field/${uuid}`, {
          serviceConfig: apiConfig.field,
          token: user.token
        });
        toast.success("Lapangan berhasil dihapus.");
        fetchFields(pagination.page);
      } catch (error) {
        toast.error("Gagal menghapus lapangan.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await MySwal.fire({
      ...swalConfig,
      title: 'Hapus Massal?',
      text: `Anda akan menghapus ${selectedIds.length} lapangan sekaligus.`,
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
          await apiRequest('delete', `${apiConfig.field.baseUrl}/api/v1/field/${uuid}`, {
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
        toast.success(`Semua (${successCount}) lapangan berhasil dihapus.`);
      }
      
      fetchFields(pagination.page);
    }
  };

  const toggleSelect = (uuid: string) => {
    setSelectedIds(prev => 
      prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === fields.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(fields.map(f => f.uuid));
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (field: any) => {
    resetForm();
    setEditingField(field);
    setFormData({ 
      name: field.name, 
      code: field.code, 
      price_per_hour: field.price_per_hour 
    });
    if (field.images) {
      setPreviewUrls(field.images);
    }
    setIsModalOpen(true);
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
              placeholder="Cari lapangan..." 
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
          onClick={openAddModal}
          className="bg-padel-dark text-padel-neon px-6 py-3 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-padel-dark/90 transition-all shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Tambah Lapangan
        </button>
      </div>

      {/* Fields Table */}
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
                      selectedIds.length === fields.length && fields.length > 0
                        ? "bg-padel-dark border-padel-dark text-padel-neon" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    {selectedIds.length === fields.length && fields.length > 0 && <CheckIcon className="w-3 h-3 stroke-[4]" />}
                  </button>
                </th>
                <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Info Lapangan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Kode</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Harga / Jam</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Created At</th>
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
              ) : fields.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Belum ada data lapangan.
                  </td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.uuid} className={cn("hover:bg-gray-50/30 transition-colors group", selectedIds.includes(field.uuid) && "bg-padel-neon/5")}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleSelect(field.uuid)}
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all",
                          selectedIds.includes(field.uuid)
                            ? "bg-padel-dark border-padel-dark text-padel-neon" 
                            : "bg-white border-gray-300"
                        )}
                      >
                        {selectedIds.includes(field.uuid) && <CheckIcon className="w-3 h-3 stroke-[4]" />}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden group-hover:bg-padel-neon transition-colors">
                          {field.images && field.images.length > 0 ? (
                            <img src={field.images[0]} alt={field.name} className="w-full h-full object-cover" />
                          ) : (
                            <PhotoIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-padel-dark uppercase italic tracking-tight">{field.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {field.images?.length || 0} Images
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-mono font-bold text-xs uppercase tracking-wider">
                        {field.code}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-padel-dark">
                      Rp {field.price_per_hour.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-gray-400 font-medium">
                      {moment(field.created_at).format('DD MMM YYYY')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(field)}
                          className="p-2 text-gray-400 hover:text-padel-dark hover:bg-gray-100 rounded-xl transition-all"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(field.uuid)}
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

      {/* CRUD Slide-over / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-padel-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden h-full flex flex-col animate-slide-in-right">
            <div className="p-8 lg:p-12 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic text-padel-dark uppercase tracking-tight">
                  {editingField ? "Edit Lapangan" : "Tambah Lapangan"}
                </h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Lengkapi informasi detail lapangan padel.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-padel-dark transition-colors"
              >
                <PlusIcon className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nama Lapangan</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Contoh: Court Alpha"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Kode Lapangan</label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Contoh: CA-01"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Harga Per Jam</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-padel-dark italic">Rp</span>
                  <input 
                    type="number" 
                    required
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({...formData, price_per_hour: parseInt(e.target.value) || 0})}
                    placeholder="250000"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-padel-dark focus:ring-2 focus:ring-padel-dark/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Multi-Image Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Foto Lapangan (Bisa Banyak)</label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center hover:border-padel-neon transition-colors cursor-pointer group bg-gray-50/50"
                >
                  <CloudArrowUpIcon className="w-10 h-10 text-gray-300 group-hover:text-padel-dark transition-colors mb-4" />
                  <p className="text-sm font-bold text-padel-dark uppercase italic">Klik untuk Upload Foto</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium mt-1">PNG, JPG up to 5MB</p>
                  <input 
                    type="file" 
                    multiple 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>

                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div className="p-8 lg:p-12 border-t border-gray-100 bg-gray-50/50">
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-padel-dark text-padel-neon py-5 rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-padel-dark/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-padel-neon border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>{editingField ? "Simpan Perubahan" : "Buat Lapangan"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}