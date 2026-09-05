import React, { useState } from 'react';
import {
  PlusCircle,
  Bell,
  Search,
  Sparkles,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Navbar = ({ onOpenQuickSale, onToggleMobileSidebar }) => {
  const { lowStockIngredients, setActiveTab, searchTerm, setSearchTerm, theme, toggleTheme } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[#fadbc7] bg-[#fdf5ef]/90 dark:bg-[#002a59]/90 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/50 dark:text-[#fadbc7] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group py-1"
          >
            {/* Transparent Text Logo */}
            <img
              src="/dolce-candele-text-nobg.png"
              alt="Dolce Candele"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block pl-2 border-l border-[#fadbc7]">
              <p className="text-[11px] font-extrabold text-[#002a59] dark:text-[#fadbc7]">
                Dolce Candele
              </p>
              <p className="text-[10px] font-semibold text-[#002a59]/70 dark:text-[#fadbc7]/80">
                Gestão Operacional & Financeira
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#002a59]/50 dark:text-[#fadbc7]/60" />
          <input
            type="text"
            placeholder="Pesquisar insumo, vela, venda ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/90 dark:bg-[#001f42]/90 border border-[#fadbc7] focus:outline-none focus:ring-2 focus:ring-[#002a59] text-[#002a59] dark:text-[#fadbc7] placeholder:text-[#002a59]/40 dark:placeholder:text-[#fadbc7]/40 transition-all shadow-xs"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/60 dark:text-[#fadbc7] dark:hover:bg-[#003b7a] transition-all flex items-center gap-1.5 text-xs font-semibold"
            title={theme === 'dark' ? 'Mudar para Light Mode ☀️' : 'Mudar para Dark Mode 🌙'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#fadbc7]" />
            ) : (
              <Moon className="w-4 h-4 text-[#002a59]" />
            )}
            <span className="hidden xl:inline text-[11px]">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/dolcecandele.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/60 dark:text-[#fadbc7] transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            title="Ver Instagram @dolcecandele.pt"
          >
            <InstagramIcon className="w-4 h-4 text-[#002a59] dark:text-[#fadbc7]" />
            <span className="hidden lg:inline">@dolcecandele.pt</span>
          </a>

          {/* Stock Alert Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/50 dark:text-[#fadbc7] transition-colors"
              title="Notificações de Stock"
            >
              <Bell className="w-5 h-5" />
              {lowStockIngredients.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {lowStockIngredients.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#001f42] rounded-2xl shadow-xl border border-[#fadbc7] p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#fadbc7]">
                  <h4 className="font-semibold text-sm text-[#002a59] dark:text-[#fadbc7] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Alertas de Stock
                  </h4>
                  <span className="text-xs font-medium text-stone-400">
                    {lowStockIngredients.length} itens críticos
                  </span>
                </div>
                <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                  {lowStockIngredients.length === 0 ? (
                    <p className="text-xs text-stone-500 text-center py-4">
                      ✅ Todo o inventário está abastecido acima do nível mínimo.
                    </p>
                  ) : (
                    lowStockIngredients.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveTab('inventory');
                          setShowNotifications(false);
                        }}
                        className="p-2.5 rounded-xl bg-[#fadbc7]/40 dark:bg-[#002a59]/60 border border-[#fadbc7] hover:bg-[#fadbc7]/70 cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-semibold text-[#002a59] dark:text-[#fadbc7]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#002a59]/80 dark:text-[#fadbc7]/80 mt-0.5">
                          Stock: <span className="font-bold">{item.currentStock} {item.purchaseUnit}</span> (Mín: {item.minStock})
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {lowStockIngredients.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab('inventory');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-1.5 text-xs font-semibold text-[#002a59] bg-[#fadbc7] rounded-xl hover:bg-[#f7caac] transition-colors"
                  >
                    Gerir no Inventário
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Sale Button (#002a59 with #fadbc7) */}
          <button
            onClick={onOpenQuickSale}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] font-bold text-xs shadow-md border border-[#fadbc7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#fadbc7]" />
            <span className="hidden sm:inline">Registar Venda</span>
            <span className="sm:hidden">Venda</span>
          </button>
        </div>
      </div>
    </header>
  );
};
