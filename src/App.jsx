import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickSaleModal } from './components/QuickSaleModal';
import { DashboardView } from './views/DashboardView';
import { CalculatorView } from './views/CalculatorView';
import { InventoryView } from './views/InventoryView';
import { ProductsView } from './views/ProductsView';
import { SalesView } from './views/SalesView';
import { ExpensesView } from './views/ExpensesView';
import { SettingsView } from './views/SettingsView';

const MainLayout = () => {
  const { activeTab } = useApp();
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
