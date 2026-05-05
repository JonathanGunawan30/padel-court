'use client'
import Link from "next/link";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import apiConfig from "@/config/api";
import axios from "axios";
import {toast} from "react-toastify";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon, 
  IdentificationIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${apiConfig.user.baseUrl}/api/v1/auth/register`, {
        name,
        email,
        phone_number: phoneNumber,
        username,
        password,
        confirm_password: confirmPassword
      });
      setIsLoading(false);
      toast.success('Register berhasil');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Register gagal");
      const newErrors: any = {};
      if (error.response?.data?.data != undefined) {
        error.response.data.data.forEach((err: any) => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors)
      }
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-padel-neon/50 focus:border-padel-neon/50 transition-all font-medium";
  const labelClass = "text-xs font-black uppercase tracking-widest text-white/50 ml-1";
  const errorClass = "flex items-center space-x-2 text-red-500 text-xs font-bold mt-2 ml-1";
  const iconClass = "absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-padel-neon transition-colors";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className={labelClass}>Nama Lengkap</label>
              <div className="relative group">
                <div className={iconClass}><IdentificationIcon className="w-5 h-5" /></div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              {errors.Name && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.Name}</span></div>}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className={labelClass}>Username</label>
              <div className="relative group">
                <div className={iconClass}><UserIcon className="w-5 h-5" /></div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  className={inputClass}
                />
              </div>
              {errors.Username && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.Username}</span></div>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className={labelClass}>Email Address</label>
              <div className="relative group">
                <div className={iconClass}><EnvelopeIcon className="w-5 h-5" /></div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>
              {errors.Email && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.Email}</span></div>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Phone Number Field */}
            <div className="space-y-2">
              <label className={labelClass}>Nomor HP</label>
              <div className="relative group">
                <div className={iconClass}><PhoneIcon className="w-5 h-5" /></div>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08123456789"
                  className={inputClass}
                />
              </div>
              {errors.PhoneNumber && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.PhoneNumber}</span></div>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={labelClass}>Password</label>
              <div className="relative group">
                <div className={iconClass}><LockClosedIcon className="w-5 h-5" /></div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              {errors.Password && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.Password}</span></div>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className={labelClass}>Konfirmasi Password</label>
              <div className="relative group">
                <div className={iconClass}><LockClosedIcon className="w-5 h-5" /></div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              {errors.ConfirmPassword && <div className={errorClass}><ExclamationCircleIcon className="w-4 h-4" /><span>{errors.ConfirmPassword}</span></div>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full py-5 bg-padel-neon text-padel-dark rounded-2xl font-black text-lg italic tracking-tight flex items-center justify-center space-x-3 hover:brightness-110 shadow-[0_0_40px_rgba(217,241,22,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-padel-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>DAFTAR SEKARANG</span>
                <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-white/40 text-sm font-medium pt-2">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-padel-neon font-black italic hover:underline decoration-2 underline-offset-4 ml-1">
            MASUK DISINI
          </Link>
        </p>
      </form>
    </div>
  )
}