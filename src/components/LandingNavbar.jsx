import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Lock, Sun, Moon, Sparkles, UserCheck, LayoutDashboard } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const LandingNavbar = ({ onOpenLogin, onGoToDashboard }) => {
  const { theme, toggleTheme } = useApp();
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[#fadbc7] bg-[#fdf5ef]/90 dark:bg-[#002a59]/90 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#hero" className="flex items-center gap-3 group">
            <img
              src="/dolce-candele-text-nobg.png"
              alt="Dolce Candele"
              className="h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block pl-3 border-l border-[#fadbc7]">
              <span className="text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7] block tracking-tight">
                Dolce Candele
              </span>
              <span className="text-[10px] font-semibold text-[#002a59]/70 dark:text-[#fadbc7]/80 block">
                Velas Artesanais Gourmet & Sobremesas em Cera
              </span>
            </div>
          </a>
        </div>

        {/* Center: Public Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7]">
          <a href="#hero" className="hover:text-[#001f42] dark:hover:text-white transition-colors">Início</a>
          <a href="#colecao-3d" className="hover:text-[#001f42] dark:hover:text-white transition-colors">Coleção 3D</a>
          <a href="#sobre" className="hover:text-[#001f42] dark:hover:text-white transition-colors">Sobre a Marca</a>
          <a href="#encomendas" className="hover:text-[#001f42] dark:hover:text-white transition-colors">Encomendas</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/60 dark:text-[#fadbc7] dark:hover:bg-[#003b7a] transition-all flex items-center gap-1.5 text-xs font-semibold"
            title={theme === 'dark' ? 'Mudar para Light Mode ☀️' : 'Mudar para Dark Mode 🌙'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fadbc7]" /> : <Moon className="w-4 h-4 text-[#002a59]" />}
          </button>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/dolcecandele.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/60 dark:text-[#fadbc7] transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
          >
            <InstagramIcon className="w-4 h-4 text-[#002a59] dark:text-[#fadbc7]" />
            <span className="hidden lg:inline">@dolcecandele.pt</span>
          </a>

          {/* Login / Admin Dashboard CTA */}
          {isAuthenticated ? (
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] font-extrabold text-xs shadow-md border border-[#fadbc7]/40 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#fadbc7]" />
              <span>Painel de Gestão</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] font-extrabold text-xs shadow-md border border-[#fadbc7]/40 transition-all"
            >
              <Lock className="w-4 h-4 text-[#fadbc7]" />
              <span>Acesso Reservado / Gestão</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
