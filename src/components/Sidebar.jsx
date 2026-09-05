import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Package,
  Sparkles,
  ShoppingBag,
  Receipt,
  Settings,
  X,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, lowStockIngredients } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Financeiro',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'calculator',
      label: 'Calculadora & Receitas',
      icon: Calculator,
      badge: 'Fichas'
    },
    {
      id: 'inventory',
      label: 'Inventário & Fornecedores',
      icon: Package,
      badge: lowStockIngredients.length > 0 ? `${lowStockIngredients.length} alerta` : null,
      badgeAlert: lowStockIngredients.length > 0
    },
    {
      id: 'products',
      label: 'Catálogo de Velas',
      icon: Sparkles,
      badge: null
    },
    {
      id: 'sales',
      label: 'Vendas & Pedidos',
      icon: ShoppingBag,
      badge: null
    },
    {
      id: 'expenses',
      label: 'Despesas & Custos Fixos',
      icon: Receipt,
      badge: null
    },
    {
      id: 'settings',
      label: 'Definições & Supabase',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#002a59]/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 left-0 z-40 h-[calc(100vh)] lg:h-[calc(100vh-5rem)] w-72 bg-white/95 dark:bg-[#002a59]/95 backdrop-blur-lg border-r border-[#fadbc7] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden pb-4 border-b border-[#fadbc7]">
            <span className="font-extrabold text-lg text-[#002a59] dark:text-[#fadbc7]">Dolce Candele</span>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-[#002a59] hover:bg-[#fadbc7]/40 dark:text-[#fadbc7]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Category Header */}
          <div>
            <p className="px-3 text-[11px] font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-wider mb-2">
              Módulos de Gestão
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
                      isActive
                        ? 'bg-[#002a59] text-[#fadbc7] shadow-md shadow-[#002a59]/20 border border-[#fadbc7]/40'
                        : 'text-[#002a59] dark:text-[#fadbc7] hover:bg-[#fadbc7]/40 hover:text-[#002a59]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#fadbc7]' : 'text-[#002a59]/70 dark:text-[#fadbc7]/80'}`} />
                      <span className="text-left font-extrabold leading-tight text-xs">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 whitespace-nowrap ${
                          item.badgeAlert
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isActive
                            ? 'bg-[#fadbc7] text-[#002a59]'
                            : 'bg-[#fadbc7]/70 text-[#002a59]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info card with Dolce Candele logo */}
        <div className="pt-4 border-t border-[#fadbc7]">
          <div className="p-3.5 rounded-2xl bg-[#fadbc7]/40 dark:bg-[#001f42] border border-[#fadbc7]">
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/dolce-candele-logo.jpg" alt="Logo" className="w-5 h-5 rounded-md object-cover" />
              <span className="text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7]">Dolce Candele</span>
            </div>
            <p className="text-[11px] text-[#002a59]/80 dark:text-[#fadbc7]/90 leading-relaxed font-medium">
              Velas de sobremesa artesanais, calculadas ao cêntimo para a máxima margem de lucro.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
