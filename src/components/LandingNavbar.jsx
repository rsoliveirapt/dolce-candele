import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, Lock, Sun, Moon, LayoutDashboard } from 'lucide-react';

export const LandingNavbar = ({ onOpenLogin, onGoToDashboard }) => {
  const { theme, toggleTheme } = useApp();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8ece1]/90 dark:bg-[#001f42]/90 backdrop-blur-md border-b border-[#ebd0c0]/40 transition-colors">
      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-12 md:px-20 lg:px-28 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Name Logo */}
        <div className="flex items-center">
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-serif-luxury text-3xl font-bold tracking-tight text-[#002658] dark:text-[#fadbc7] group-hover:opacity-80 transition-opacity italic">
              Dolce Candele
            </span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-[#002658]/80 dark:text-[#fadbc7]/90">
          <a href="#hero" className="hover:text-[#002658] dark:hover:text-white transition-colors">Início</a>
          <a href="#colecoes" className="hover:text-[#002658] dark:hover:text-white transition-colors">Coleções</a>
          <a href="#sobre" className="hover:text-[#002658] dark:hover:text-white transition-colors">Sobre</a>
          <a href="#contactos" className="hover:text-[#002658] dark:hover:text-white transition-colors">Contactos</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#002658] hover:bg-[#ebd0c0]/50 dark:text-[#fadbc7] dark:hover:bg-[#002658] transition-all"
            title={theme === 'dark' ? 'Mudar para Light Mode ☀️' : 'Mudar para Dark Mode 🌙'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-[#fadbc7]" /> : <Moon className="w-4.5 h-4.5 text-[#002658]" />}
          </button>

          {/* Search Icon */}
          <button
            className="p-2 rounded-full text-[#002658] dark:text-[#fadbc7] hover:bg-[#ebd0c0]/50 dark:hover:bg-[#002658] transition-all"
            aria-label="Pesquisar"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Shopping Bag Icon with Badge */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-[#002658] dark:text-[#fadbc7] hover:bg-[#ebd0c0]/50 dark:hover:bg-[#002658] transition-all"
              aria-label="Carrinho de Compras"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
            </button>
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#002658] dark:bg-[#fadbc7] text-white dark:text-[#001f42] rounded-full text-[9px] font-bold flex items-center justify-center">
              0
            </span>
          </div>

          {/* CTA Pill Button */}
          {isAuthenticated ? (
            <button
              onClick={onGoToDashboard}
              className="px-6 py-3 rounded-full bg-[#002658] text-[#f8ece1] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs hover:bg-[#001a3d] dark:hover:bg-white transition-all shadow-sm flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel Gestão</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 rounded-full bg-[#002658] text-[#f8ece1] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs hover:bg-[#001a3d] dark:hover:bg-white transition-all shadow-sm flex items-center gap-2"
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
