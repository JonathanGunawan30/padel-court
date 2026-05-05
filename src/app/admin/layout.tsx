'use client'
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { 
  Squares2X2Icon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  ShoppingBagIcon, 
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useContext(AuthContext) as any;
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Basic protection: If not admin, redirect
    if (user && user.role !== 'admin' && user.role !== 'administrator') {
      router.push('/dashboard');
    } else if (!user && !localStorage.getItem('authToken')) {
       // if we are definitely sure no one is logged in, redirect to login
       // but wait for context first
    }
  }, [user, router]);

  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: <Squares2X2Icon className="w-6 h-6" /> },
    { name: "Lapangan", href: "/admin/fields", icon: <MapPinIcon className="w-6 h-6" /> },
    { name: "Jam Operasional", href: "/admin/times", icon: <ClockIcon className="w-6 h-6" /> },
    { name: "Jadwal", href: "/admin/schedules", icon: <CalendarDaysIcon className="w-6 h-6" /> },
    { name: "Pesanan", href: "/admin/orders", icon: <ShoppingBagIcon className="w-6 h-6" /> },
    // { name: "Users", href: "/admin/users", icon: <UsersIcon className="w-6 h-6" /> },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-padel-dark text-white transition-all duration-300 transform lg:relative lg:translate-x-0",
          isSidebarOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 bg-padel-neon rounded-lg flex-shrink-0" />
              <span className={cn("font-display text-xl italic transition-opacity", !isSidebarOpen && "lg:opacity-0")}>
                PADEL<span className="text-padel-neon">ADMIN</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-2xl transition-all group",
                  pathname === item.href 
                    ? "bg-padel-neon text-padel-dark font-black italic shadow-[0_0_20px_rgba(217,241,22,0.2)]" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn("transition-transform group-hover:scale-110", pathname === item.href ? "text-padel-dark" : "text-current")}>
                  {item.icon}
                </div>
                <span className={cn("whitespace-nowrap transition-opacity", !isSidebarOpen && "lg:opacity-0")}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors group"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <span className={cn("whitespace-nowrap", !isSidebarOpen && "lg:opacity-0")}>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6 lg:hidden" /> : <Bars3Icon className="w-6 h-6" />}
              <span className="hidden lg:block">
                 {isSidebarOpen ? <Bars3Icon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </span>
            </button>
            <h2 className="text-lg font-black italic text-padel-dark uppercase hidden sm:block">
              {menuItems.find(i => i.href === pathname)?.name || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-6">
            <button className="p-2 text-gray-400 hover:text-padel-dark relative transition-colors">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black italic text-padel-dark leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Mode</p>
              </div>
              <div className="w-10 h-10 bg-padel-dark rounded-xl flex items-center justify-center text-padel-neon font-black italic">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}