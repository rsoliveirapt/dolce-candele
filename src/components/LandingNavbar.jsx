import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, Lock, Sun, Moon, LayoutDashboard } from 'lucide-react';

export const LandingNavbar = ({ onOpenLogin, onGoToDashboard }) => {
  const { theme, toggleTheme } = useApp();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8ebe0]/90 dark:bg-[#001f42]/90 backdrop-blur-md border-b border-[#ebd3c5]/50 transition-colors">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Name Logo */}
        <div className="flex items-center">
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-serif-luxury text-3xl font-bold tracking-tight text-[#3a1f18] dark:text-[#fadbc7] group-hover:opacity-80 transition-opacity italic">
              Dolce Candele
            </span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5a3a30] dark:text-[#fadbc7]/90">
          <a href="#hero" className="hover:text-[#3a1f18] dark:hover:text-white transition-colors">Início</a>
          <a href="#colecoes" className="hover:text-[#3a1f18] dark:hover:text-white transition-colors">Coleções</a>
          <a href="#sobre" className="hover:text-[#3a1f18] dark:hover:text-white transition-colors">Sobre</a>
          <a href="#contactos" className="hover:text-[#3a1f18] dark:hover:text-white transition-colors">Contactos</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3.5">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#3a1f18] hover:bg-[#ebd3c5]/50 dark:text-[#fadbc7] dark:hover:bg-[#002a59] transition-all"
            title={theme === 'dark' ? 'Mudar para Light Mode ☀️' : 'Mudar para Dark Mode 🌙'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fadbc7]" /> : <Moon className="w-4 h-4 text-[#3a1f18]" />}
          </button>

          {/* Search Icon */}
          <button
            className="p-2 rounded-full text-[#3a1f18] dark:text-[#fadbc7] hover:bg-[#ebd3c5]/50 dark:hover:bg-[#002a59] transition-all"
            aria-label="Pesquisar"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Shopping Bag Icon with Badge */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-[#3a1f18] dark:text-[#fadbc7] hover:bg-[#ebd3c5]/50 dark:hover:bg-[#002a59] transition-all"
              aria-label="Carrinho de Compras"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#3a1f18] dark:bg-[#fadbc7] text-white dark:text-[#001f42] rounded-full text-[9px] font-bold flex items-center justify-center">
              0
            </span>
          </div>

          {/* CTA Pill Button */}
          {isAuthenticated ? (
            <button
              onClick={onGoToDashboard}
              className="px-5 py-2.5 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs hover:bg-[#2b150f] dark:hover:bg-white transition-all shadow-sm flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel Gestão</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs hover:bg-[#2b150f] dark:hover:bg-white transition-all shadow-sm flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Descobre agora</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
