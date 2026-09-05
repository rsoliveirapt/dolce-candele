import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertBanner } from '../components/AlertBanner';
import {
  TrendingUp,
  Euro,
  Scale,
  PackageCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardView = () => {
  const { sales, expenses, fixedCosts, products, calculateProductCosts, setActiveTab } = useApp();

  // Metrics Calculations
  const grossRevenue = sales
    .filter(s => s.status !== 'cancelado')
    .reduce((sum, s) => sum + (s.grossAmount || 0), 0);

  const totalFees = sales
    .filter(s => s.status !== 'cancelado')
    .reduce((sum, s) => sum + (s.platformFee || 0), 0);

  const netRevenue = grossRevenue - totalFees;

  const totalVariableExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalFixedCostsMonthly = fixedCosts.reduce((sum, f) => sum + (f.monthlyAmount || 0), 0);

  // Estimated Real Profit = Net Revenue - Total Variable Expenses - Total Fixed Costs
  const realNetProfit = netRevenue - totalVariableExpenses - totalFixedCostsMonthly;

  // Average Candle Cost across active catalog
  const catalogCosts = products.map(p => calculateProductCosts(p));
  const avgCandleCost = catalogCosts.length > 0
    ? catalogCosts.reduce((sum, c) => sum + c.totalCost, 0) / catalogCosts.length
    : 5.50;

  const avgCandlePrice = catalogCosts.length > 0
    ? catalogCosts.reduce((sum, c) => sum + c.suggestedPrice, 0) / catalogCosts.length
    : 19.90;

  const avgContributionMarginPerCandle = Math.max(1, avgCandlePrice - avgCandleCost);

  // Break-even Units Required per month
  const breakEvenUnitsMonth = Math.ceil(totalFixedCostsMonthly / avgContributionMarginPerCandle);
  const breakEvenRevenueMonth = breakEvenUnitsMonth * avgCandlePrice;

  // Total Candles Sold
  const totalCandlesSold = sales
    .filter(s => s.status !== 'cancelado')
    .reduce((sum, s) => {
      if (s.items && Array.isArray(s.items)) {
        return sum + s.items.reduce((iSum, item) => iSum + (item.quantity || 1), 0);
      }
      return sum + 1;
    }, 0);

  // Recharts Data: Monthly History
  const monthlyData = [
    { name: 'Mai', fatura: 420, lucro: 210, despesas: 180 },
    { name: 'Jun', fatura: 650, lucro: 340, despesas: 220 },
    { name: 'Jul', fatura: 890, lucro: 480, despesas: 310 },
    { name: 'Ago', fatura: 1120, lucro: 610, despesas: 390 },
    { name: 'Set (Atual)', fatura: Math.round(grossRevenue), lucro: Math.round(Math.max(0, realNetProfit)), despesas: Math.round(totalVariableExpenses + totalFixedCostsMonthly) }
  ];

  // Expenses Category Pie Chart Data
  const expensesByCategory = [
    { name: 'Matérias-Primas', value: 135.00, color: '#002a59' },
    { name: 'Equipamentos', value: 42.90, color: '#d97706' },
    { name: 'Marketing & Ads', value: 80.00, color: '#8b5cf6' },
    { name: 'Embalagens', value: 105.00, color: '#06b6d4' },
    { name: 'Custos Fixos', value: totalFixedCostsMonthly, color: '#f7caac' }
  ];

  // Top Products by Revenue
  const topProducts = products.map(prod => {
    const costs = calculateProductCosts(prod);
    const margin = costs.suggestedPrice > 0 ? ((costs.suggestedPrice - costs.totalCost) / costs.suggestedPrice) * 100 : 0;
    return {
      ...prod,
      costs,
      margin
    };
  }).sort((a, b) => b.margin - a.margin);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Alert Banner for Stock */}
      <AlertBanner />

      {/* Header Banner using #002a59 and #fadbc7 */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#002a59] text-[#fadbc7] overflow-hidden shadow-xl border border-[#fadbc7]/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-[#fadbc7]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/dolce-candele-logo.jpg" alt="Logo Dolce Candele" className="w-16 h-16 rounded-2xl border-2 border-[#fadbc7] shadow-lg object-cover bg-white" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fadbc7]/20 backdrop-blur-md text-[#fadbc7] text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Visão Operacional & Financeira
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Dolce Candele 🕯️
              </h1>
              <p className="text-xs sm:text-sm text-[#fadbc7]/90 mt-0.5 max-w-xl font-medium">
                Acompanhe a rentabilidade real, os custos por vela e o ponto de equilíbrio para garantir a máxima margem em cada produção.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-4 py-2.5 rounded-xl bg-[#fadbc7] text-[#002a59] font-extrabold text-xs hover:bg-[#f7caac] shadow-md transition-all flex items-center gap-1.5"
            >
              Simular Nova Vela
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Faturação Bruta */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-wider">
                Faturação Bruta (Set)
              </p>
              <h3 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] mt-1">
                {grossRevenue.toFixed(2)} €
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#fadbc7] text-[#002a59]">
              <Euro className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-700 font-bold gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs mês anterior</span>
          </div>
        </div>

        {/* Metric 2: Lucro Líquido Real */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-wider">
                Lucro Líquido Real
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                {realNetProfit.toFixed(2)} €
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-500 font-medium">
            Após insumos, taxas e custos fixos
          </p>
        </div>

        {/* Metric 3: Ponto de Equilíbrio (Break-even) */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-wider">
                Break-Even Mensal
              </p>
              <h3 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] mt-1">
                {breakEvenUnitsMonth} <span className="text-sm font-normal text-stone-500">velas</span>
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#002a59] text-[#fadbc7]">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-500 font-medium">
            {breakEvenRevenueMonth.toFixed(0)}€ em vendas para cobrir custos fixos ({totalFixedCostsMonthly}€/mês)
          </p>
        </div>

        {/* Metric 4: Total Velas Vendidas */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-wider">
                Velas Entregues
              </p>
              <h3 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] mt-1">
                {totalCandlesSold} <span className="text-sm font-normal text-stone-500">unidades</span>
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#fadbc7] text-[#002a59]">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-500 font-medium">
            Margem média por vela: ~{avgContributionMarginPerCandle.toFixed(2)}€
          </p>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Faturação vs Lucro */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#002a59] dark:text-[#fadbc7] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#002a59]" />
                Histórico de Faturação vs Lucro Líquido (€)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Evolução financeira dos últimos 5 meses
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorFatura" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002a59" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#002a59" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fadbc7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fadbc7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fadbc7" />
                <XAxis dataKey="name" stroke="#002a59" fontSize={11} tickLine={false} />
                <YAxis stroke="#002a59" fontSize={11} tickLine={false} unit="€" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #fadbc7',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="fatura" name="Faturação Bruta (€)" stroke="#002a59" strokeWidth={3} fillOpacity={1} fill="url(#colorFatura)" />
                <Area type="monotone" dataKey="lucro" name="Lucro Líquido Real (€)" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorLucro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Despesas por Categoria */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#002a59] dark:text-[#fadbc7] flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#002a59]" />
              Distribuição de Custos
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Despesas por categoria operacional
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)} €`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[#fadbc7]">
            {expensesByCategory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#002a59] dark:text-[#fadbc7] font-medium">{item.name}</span>
                </div>
                <span className="font-extrabold text-[#002a59] dark:text-[#fadbc7]">
                  {item.value.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Products & Break-Even Calculator Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Profitable Candles */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#002a59] dark:text-[#fadbc7] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Velas Mais Lucrativas do Catálogo
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Margem percentual e retorno por unidade produzida
              </p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-extrabold text-[#002a59] hover:underline flex items-center gap-1"
            >
              Ver Catálogo <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-[#fadbc7]/30 dark:bg-[#001f42]/40 border border-[#fadbc7] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-[#002a59] dark:text-[#fadbc7]">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">
                    {prod.category} • Temp: {prod.laborTimeMinutes} min labor
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Custo vs Venda</span>
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {prod.costs.totalCost.toFixed(2)}€ → <span className="font-extrabold text-[#002a59] dark:text-[#fadbc7]">{prod.suggestedPrice.toFixed(2)}€</span>
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/20">
                    +{prod.margin.toFixed(0)}% Margem
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Break-even Quick Widget */}
        <div className="p-6 rounded-3xl glass-card space-y-4 bg-gradient-to-b from-[#fadbc7]/30 to-white dark:from-[#002a59] dark:to-[#001f42]">
          <div>
            <h3 className="text-base font-extrabold text-[#002a59] dark:text-[#fadbc7] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#002a59]" />
              Simulador Ponto de Equilíbrio
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Cálculo de cobertura de custos fixos
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#002a59] border border-[#fadbc7] space-y-3">
            <div className="flex justify-between text-xs text-[#002a59] dark:text-[#fadbc7]">
              <span>Custos Fixos Mensais Totais:</span>
              <span className="font-bold">{totalFixedCostsMonthly.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-[#002a59] dark:text-[#fadbc7]">
              <span>Margem Média por Vela:</span>
              <span className="font-bold">{avgContributionMarginPerCandle.toFixed(2)} €</span>
            </div>
            
            <div className="pt-2 border-t border-[#fadbc7] text-center">
              <span className="text-[11px] font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-widest block">
                Meta de Vendas Mensal
              </span>
              <span className="text-3xl font-black text-[#002a59] dark:text-[#fadbc7] my-1 block">
                {breakEvenUnitsMonth} Velas
              </span>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                ou {breakEvenRevenueMonth.toFixed(2)} € em vendas
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#002a59]/80 dark:text-[#fadbc7]/80 font-medium italic text-center">
            A partir da vela nº {breakEvenUnitsMonth + 1}, todo o valor faturado é lucro 100% limpo para a Dolce Candele!
          </p>
        </div>

      </div>

    </div>
  );
};
