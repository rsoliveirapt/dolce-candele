import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Receipt,
  Plus,
  Scale,
  Trash2,
  Edit2,
  DollarSign,
  TrendingDown,
  Building,
  Zap,
  Tag
} from 'lucide-react';

export const ExpensesView = () => {
  const {
    expenses,
    fixedCosts,
    addExpense,
    deleteExpense,
    addFixedCost,
    updateFixedCost,
    deleteFixedCost,
    searchTerm
  } = useApp();

  const [activeTab, setActiveTab] = useState('fixed'); // fixed | variable

  // Expense Modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expDescription, setExpDescription] = useState('');
  const [expCategory, setExpCategory] = useState('matérias_primas');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // Fixed Cost Modal
  const [isFCModalOpen, setIsFCModalOpen] = useState(false);
  const [editingFC, setEditingFC] = useState(null);
  const [fcName, setFcName] = useState('');
  const [fcAmount, setFcAmount] = useState('');
  const [fcCategory, setFcCategory] = useState('Operacional');

  const expCategoriesMap = {
    matérias_primas: 'Matérias-Primas',
    equipamento: 'Equipamentos & Utensílios',
    marketing: 'Marketing & Redes Sociais',
    embalagens: 'Embalagens & Rótulos',
    operacional: 'Despesas Gerais'
  };

  const totalVariable = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalFixedMonthly = fixedCosts.reduce((sum, f) => sum + (f.monthlyAmount || 0), 0);

  // Submit Expense
  const handleSaveExpense = (e) => {
    e.preventDefault();
    addExpense({
      description: expDescription,
      category: expCategory,
      amount: parseFloat(expAmount),
      expenseDate: expDate
    });
    setIsExpModalOpen(false);
    setExpDescription('');
    setExpAmount('');
  };

  // Submit Fixed Cost
  const handleSaveFixedCost = (e) => {
    e.preventDefault();
    const payload = {
      name: fcName,
      monthlyAmount: parseFloat(fcAmount),
      category: fcCategory
    };

    if (editingFC) {
      updateFixedCost(editingFC.id, payload);
    } else {
      addFixedCost(payload);
    }

    setIsFCModalOpen(false);
    setEditingFC(null);
    setFcName('');
    setFcAmount('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-200/60 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
            <Receipt className="w-3.5 h-3.5" /> Módulo de Despesas & Custos Operacionais
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Controlo de Despesas & Custos Fixos 💸
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Registe investimentos em equipamentos, matérias-primas e custos fixos mensais para o cálculo exato do ponto de equilíbrio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingFC(null);
              setFcName('');
              setFcAmount('');
              setIsFCModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-stone-900 text-white dark:bg-amber-100 dark:text-amber-950 shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Adicionar Custo Fixo
          </button>
          
          <button
            onClick={() => {
              setExpDescription('');
              setExpAmount('');
              setIsExpModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Registar Despesa
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-2xl glass-card flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Custos Fixos Mensais Totais
            </span>
            <span className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1 block">
              {totalFixedMonthly.toFixed(2)} € /mês
            </span>
            <span className="text-[11px] text-stone-500">Renda, eletricidade, software, anúncios</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Despesas Variáveis Registadas
            </span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              {totalVariable.toFixed(2)} €
            </span>
            <span className="text-[11px] text-stone-500">Insumos, moldes, termómetros, embalagens</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'fixed'
              ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🏛️ Custos Fixos Mensais ({fixedCosts.length})
        </button>

        <button
          onClick={() => setActiveTab('variable')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'variable'
              ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🧾 Histórico de Despesas Operacionais ({expenses.length})
        </button>
      </div>

      {/* VIEW 1: FIXED COSTS */}
      {activeTab === 'fixed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedCosts.map((fc) => (
            <div key={fc.id} className="p-5 rounded-3xl glass-card flex justify-between items-center">
              <div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  {fc.category}
                </span>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mt-0.5">
                  {fc.name}
                </h3>
                <span className="text-xs text-stone-500">Recorrência mensal</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-amber-900 dark:text-amber-200">
                  {fc.monthlyAmount.toFixed(2)} €
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingFC(fc);
                      setFcName(fc.name);
                      setFcAmount(fc.monthlyAmount);
                      setFcCategory(fc.category || 'Operacional');
                      setIsFCModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFixedCost(fc.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: VARIABLE EXPENSES */}
      {activeTab === 'variable' && (
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="pb-3 px-2">Data</th>
                  <th className="pb-3 px-2">Descrição da Despesa</th>
                  <th className="pb-3 px-2">Categoria</th>
                  <th className="pb-3 px-2 text-right">Valor Total (€)</th>
                  <th className="pb-3 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-2 text-stone-500 font-medium">
                      {exp.expenseDate}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-stone-900 dark:text-stone-100">
                      {exp.description}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 font-semibold text-[10px]">
                        {expCategoriesMap[exp.category] || exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right font-black text-rose-600 dark:text-rose-400 text-sm">
                      {exp.amount.toFixed(2)} €
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      <Modal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        title="Registar Nova Despesa Operacional"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Descrição da Despesa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Lote de 50 Taças de Sobremesa"
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Categoria da Despesa
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                {Object.entries(expCategoriesMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Valor Total (€) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 45.00"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Data da Despesa
            </label>
            <input
              type="date"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsExpModalOpen(false)}
              className="px-4 py-2 text-xs text-stone-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-md"
            >
              Guardar Despesa
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: FIXED COST */}
      <Modal
        isOpen={isFCModalOpen}
        onClose={() => setIsFCModalOpen(false)}
        title={editingFC ? 'Editar Custo Fixo Mensal' : 'Adicionar Novo Custo Fixo Mensal'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveFixedCost} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Nome do Custo Fixo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Renda do Espaço Dolce Candele"
              value={fcName}
              onChange={(e) => setFcName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Valor Mensal (€/mês) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 180.00"
              value={fcAmount}
              onChange={(e) => setFcAmount(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Categoria
            </label>
            <input
              type="text"
              placeholder="Ex: Espaço & Instalações"
              value={fcCategory}
              onChange={(e) => setFcCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFCModalOpen(false)}
              className="px-4 py-2 text-xs text-stone-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-900 rounded-xl hover:bg-amber-950 shadow-md"
            >
              Guardar Custo Fixo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
