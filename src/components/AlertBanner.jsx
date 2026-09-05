import React from 'react';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertBanner = () => {
  const { lowStockIngredients, setActiveTab } = useApp();

  if (lowStockIngredients.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">
            {lowStockIngredients.length} {lowStockIngredients.length === 1 ? 'insumo com stock crítico' : 'insumos com stock crítico'}
          </h4>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
            {lowStockIngredients.slice(0, 3).map(i => i.name).join(', ')}
            {lowStockIngredients.length > 3 ? ` e mais ${lowStockIngredients.length - 3}...` : ''}
          </p>
        </div>
      </div>
      <button
        onClick={() => setActiveTab('inventory')}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Package className="w-4 h-4" />
        Ver Inventário
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
