import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  Trash2,
  CreditCard,
  Store,
  Sparkles
} from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);


export const SalesView = ({ onOpenQuickSale }) => {
  const { sales, updateSaleStatus, deleteSale, products, searchTerm } = useApp();

  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const channelMap = {
    instagram: { label: 'Instagram DM', icon: InstagramIcon },
    feiras: { label: 'Feira Artesanal', icon: Store },
    loja_online: { label: 'Loja Online', icon: ShoppingBag },
    encomenda_personalizada: { label: 'Encomenda Especial', icon: Sparkles }
  };

  const statusMap = {
    em_producao: { label: 'Em Produção', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    pronto: { label: 'Pronto p/ Envio', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    entregue: { label: 'Entregue', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    cancelado: { label: 'Cancelado', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' }
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.orderNumber && s.orderNumber.toString().includes(searchTerm));
    const matchesChannel = selectedChannel === 'all' || s.salesChannel === selectedChannel;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-[#fadbc7]/40 via-white to-[#fadbc7]/20 border border-[#fadbc7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] tracking-tight">
            Registo de Pedidos Dolce Candele 🛍️
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
            Gira os pedidos por canal, aplique taxas de pagamento e acompanhe a baixa automática no stock de matérias-primas.
          </p>
        </div>

        <button
          onClick={onOpenQuickSale}
          className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-[#fadbc7]/30"
        >
          <Plus className="w-4 h-4 text-[#fadbc7]" /> Registar Nova Venda
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Sales Channels Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-bold text-stone-400 uppercase text-[10px]">Canal:</span>
          <button
            onClick={() => setSelectedChannel('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedChannel === 'all' ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            Todos ({sales.length})
          </button>
          {Object.entries(channelMap).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedChannel(key)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedChannel === key ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-400 uppercase text-[10px]">Estado:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-semibold"
          >
            <option value="all">Todos os Estados</option>
            <option value="em_producao">Em Produção</option>
            <option value="pronto">Pronto p/ Envio</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

      </div>

      {/* Sales Table */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                <th className="pb-3 px-2">Nº Pedido</th>
                <th className="pb-3 px-2">Cliente & Data</th>
                <th className="pb-3 px-2">Canal & Pagamento</th>
                <th className="pb-3 px-2">Itens Vendidos</th>
                <th className="pb-3 px-2 text-right">Bruto (€)</th>
                <th className="pb-3 px-2 text-right">Taxa (€)</th>
                <th className="pb-3 px-2 text-right">Líquido Real</th>
                <th className="pb-3 px-2 text-center">Estado</th>
                <th className="pb-3 px-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {filteredSales.map((sale) => {
                const statusInfo = statusMap[sale.status] || { label: sale.status, color: '' };
                const channelInfo = channelMap[sale.salesChannel] || { label: sale.salesChannel };

                return (
                  <tr key={sale.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 transition-colors">
                    
                    {/* Order # */}
                    <td className="py-3.5 px-2 font-extrabold text-amber-900 dark:text-amber-200">
                      #{sale.orderNumber || 1000}
                    </td>

                    {/* Customer & Date */}
                    <td className="py-3.5 px-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        {sale.customerName || 'Cliente Anónimo'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(sale.saleDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Channel & Payment */}
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                        {channelInfo.label}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-stone-400">
                        {sale.paymentMethod}
                      </span>
                    </td>

                    {/* Items List */}
                    <td className="py-3.5 px-2 text-stone-600 dark:text-stone-400 max-w-xs">
                      {sale.items && sale.items.map((item, idx) => {
                        const prod = products.find(p => p.id === item.productId);
                        return (
                          <div key={idx} className="text-[11px] truncate">
                            • {item.quantity}x {prod ? prod.name : 'Vela Artesanal'}
                          </div>
                        );
                      })}
                    </td>

                    {/* Gross */}
                    <td className="py-3.5 px-2 text-right font-medium text-stone-700 dark:text-stone-300">
                      {sale.grossAmount.toFixed(2)} €
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-2 text-right font-medium text-rose-600">
                      -{sale.platformFee?.toFixed(2) || '0.00'} €
                    </td>

                    {/* Net Real Amount */}
                    <td className="py-3.5 px-2 text-right font-black text-emerald-700 dark:text-emerald-400 text-sm">
                      {sale.netAmount.toFixed(2)} €
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-2 text-center">
                      <select
                        value={sale.status}
                        onChange={(e) => updateSaleStatus(sale.id, e.target.value)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${statusInfo.color} cursor-pointer focus:outline-none`}
                      >
                        <option value="em_producao">🟡 Em Produção</option>
                        <option value="pronto">🔵 Pronto p/ Envio</option>
                        <option value="entregue">🟢 Entregue</option>
                        <option value="cancelado">🔴 Cancelado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => deleteSale(sale.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Eliminar Venda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
