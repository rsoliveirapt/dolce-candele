import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickSaleModal } from './components/QuickSaleModal';
import { LoginModal } from './components/LoginModal';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { CalculatorView } from './views/CalculatorView';
import { InventoryView } from './views/InventoryView';
import { ProductsView } from './views/ProductsView';
import { SalesView } from './views/SalesView';
import { ExpensesView } from './views/ExpensesView';
import { SettingsView } from './views/SettingsView';
import { Globe, LogOut, ShieldCheck } from 'lucide-react';

const MainLayout = () => {
  const { activeTab } = useApp();
  const { isAuthenticated, currentUser, logout, isLoginModalOpen, setIsLoginModalOpen } = useAuth();

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewPublicLanding, setViewPublicLanding] = useState(false);

  // If user is not authenticated OR chooses to view public landing page
  if (!isAuthenticated || viewPublicLanding) {
    return (
      <div className="min-h-screen bg-[#fdf5ef] dark:bg-[#001229] text-[#002a59] dark:text-[#fadbc7] flex flex-col font-sans transition-colors duration-300">
        
        {/* Public Header */}
        <LandingNavbar
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onGoToDashboard={() => setViewPublicLanding(false)}
        />

        {/* Public Landing View */}
        <div className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <LandingView onOpenLogin={() => setIsLoginModalOpen(true)} />
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    );
  }

  // Admin Operational Management View
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'calculator':
        return <CalculatorView />;
      case 'inventory':
        return <InventoryView />;
      case 'products':
        return <ProductsView />;
      case 'sales':
        return <SalesView onOpenQuickSale={() => setIsQuickSaleOpen(true)} />;
      case 'expenses':
        return <ExpensesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5ef] dark:bg-[#001229] text-[#002a59] dark:text-[#fadbc7] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Admin Status Bar */}
      <div className="bg-[#002a59] text-[#fadbc7] px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-[#fadbc7]/30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#fadbc7]" />
          <span>Sessão de Gestão Ativa: <strong>{currentUser?.name || 'Administração'}</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewPublicLanding(true)}
            className="hover:underline flex items-center gap-1 font-bold text-[#fadbc7]"
          >
            <Globe className="w-3.5 h-3.5" /> Ver Página Pública
          </button>
          
          <button
            onClick={logout}
            className="hover:underline flex items-center gap-1 font-bold text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenQuickSale={() => setIsQuickSaleOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 gap-6">
        
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Quick Sale Modal */}
      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </AppProvider>
  );
}
