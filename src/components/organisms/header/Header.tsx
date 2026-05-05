'use client'
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthProvider";
import {UserIcon} from "@heroicons/react/24/solid";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import TopBanner from "@/components/organisms/header/TopBanner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const { user, logout } = useContext(AuthContext) as any;
  const currentPath = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Lapangan", href: "/#field-list" },
    { name: "Cara Booking", href: "/how-to-book" },
    { name: "Tentang Kami", href: "/about-us" },
  ];

  return (
    <>
    <div className={cn("z-50", isMobileMenuOpen ? "fixed top-0 left-0 right-0" : "relative")}>
      <TopBanner />
      <header className="border-b border-white/10 bg-padel-dark/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl text-white italic">
              PADEL<span className="text-padel-neon">BOOK</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  currentPath === link.href || (link.href.startsWith("#") && currentPath === "/")
                    ? "text-padel-neon"
                    : "text-white/70 hover:text-padel-neon"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white hover:text-padel-neon transition-colors">
                  <UserIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-padel-secondary border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {(user.role === 'admin' || user.role === 'administrator') && (
                    <Link href="/admin/dashboard" className="block px-4 py-3 text-sm text-padel-neon font-black italic hover:bg-padel-accent">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="block px-4 py-3 text-sm text-white hover:bg-padel-accent">
                    Dashboard Saya
                  </Link>
                  <button
                    onClick={handleLogout as any}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-padel-accent"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-bold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-bold text-padel-dark bg-padel-neon rounded-full hover:brightness-110 transition-all shadow-[0_0_20px_rgba(217,241,22,0.3)]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="relative block w-6 h-5">
              <span
                className={cn(
                  "absolute left-0 top-0 block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-out",
                  isMobileMenuOpen && "top-1/2 -translate-y-1/2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-6 bg-current rounded-full transition-all duration-200",
                  isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 bottom-0 block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-out",
                  isMobileMenuOpen && "bottom-1/2 translate-y-1/2 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
    </div>

    {/* Mobile Menu — rendered as sibling of header so parent stacking context doesn't bury the background */}
    <div
      style={{ backgroundColor: "#0a0a0a" }}
      className={cn(
        "lg:hidden fixed inset-0 z-40 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
        <div className="flex flex-col p-8 space-y-8 mt-[140px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-black italic uppercase text-white hover:text-padel-neon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 border-t border-white/10 flex flex-col space-y-4">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'administrator') && (
                  <Link
                    href="/admin/dashboard"
                    className="text-lg font-bold text-padel-neon italic uppercase"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-lg font-bold text-white italic uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard Saya
                </Link>
                <button
                  onClick={handleLogout as any}
                  className="text-xl font-bold text-red-500 text-left italic uppercase"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full py-5 text-center font-black italic uppercase text-white border border-white/20 rounded-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="w-full py-5 text-center font-black italic uppercase text-padel-dark bg-padel-neon rounded-2xl shadow-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
        </div>
      </div>
    </div>
    </>
  );
}
