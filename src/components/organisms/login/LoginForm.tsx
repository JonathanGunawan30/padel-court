'use client'
import Link from "next/link";
import React, {useContext, useState} from "react";
import axios from "axios";
import apiConfig from "@/config/api";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {AuthContext} from "@/context/AuthProvider";
import Cookies from "js-cookie";
import { 
  UserIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { setUser } = useContext(AuthContext) as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiConfig.user.baseUrl}/api/v1/auth/login`, {
        username,
        password,
      });
      const { token, data } = response.data;
      Cookies.set("authToken", token, { expires: 1 });
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(data));
      setUser({ token, ...data });
      setIsLoading(false);
      toast.success('Login berhasil');
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Login gagal");
      const newErrors: any = {};
      if (error.response?.data?.data != undefined) {
        error.response.data.data.forEach((err: any) => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">
            Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-padel-neon transition-colors">
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username anda"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-padel-neon/50 focus:border-padel-neon/50 transition-all font-medium"
            />
          </div>
          {errors.Username && (
            <div className="flex items-center space-x-2 text-red-500 text-xs font-bold mt-2 ml-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              <span>{errors.Username}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-padel-neon transition-colors">
              <LockClosedIcon className="w-5 h-5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-padel-neon/50 focus:border-padel-neon/50 transition-all font-medium"
            />
          </div>
          {errors.Password && (
            <div className="flex items-center space-x-2 text-red-500 text-xs font-bold mt-2 ml-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              <span>{errors.Password}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full py-5 bg-padel-neon text-padel-dark rounded-2xl font-black text-lg italic tracking-tight flex items-center justify-center space-x-3 hover:brightness-110 shadow-[0_0_40px_rgba(217,241,22,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-padel-dark border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>MASUK SEKARANG</span>
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Register Link */}
        <p className="text-center text-white/40 text-sm font-medium pt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-padel-neon font-black italic hover:underline decoration-2 underline-offset-4 ml-1">
            DAFTAR DISINI
          </Link>
        </p>
      </form>
    </div>
  )
}
