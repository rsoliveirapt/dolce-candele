import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Plus,
  Flame,
  Clock,
  Euro,
  ArrowUpRight,
  Trash2,
  Edit2,
  PackageCheck
} from 'lucide-react';

export const ProductsView = () => {
  const { products, ingredients, calculateProductCosts, deleteProduct, setActiveTab, searchTerm } = useApp();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper: Calculate max units batch that can be produced with current ingredient stock
  const calculateMaxProducableBatch = (recipe) => {
    if (!recipe || !Array.isArray(recipe) || recipe.length === 0) return 0;
    let minUnits = Infinity;
    recipe.forEach(item => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (ing && item.quantity > 0) {
        const units = Math.floor(ing.currentStock / item.quantity);
        if (units < minUnits) minUnits = units;
      }
    });
    return minUnits === Infinity ? 0 : minUnits;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-[#fadbc7]/40 via-white to-[#fadbc7]/20 border border-[#fadbc7]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002a59] text-[#fadbc7] text-xs font-extrabold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#fadbc7]" /> Catálogo de Velas Artesanais
          </div>
          <h1 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] tracking-tight">
            Velas de Sobremesa Dolce Candele 🕯️
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
            Veja as receitas ativas, custos unitários, preços sugeridos e capacidade máxima de produção com o stock atual.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('calculator')}
          className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-[#fadbc7]/30"
        >
          <Plus className="w-4 h-4 text-[#fadbc7]" /> Criar / Simular Nova Vela
        </button>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const costs = calculateProductCosts(product);
          const maxBatch = calculateMaxProducableBatch(product.recipe);
          const margin = costs.suggestedPrice > 0
            ? ((costs.suggestedPrice - costs.totalCost) / costs.suggestedPrice) * 100
            : 0;

          return (
            <div
              key={product.id}
              className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between relative group hover:border-amber-300 dark:hover:border-stone-600 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="space-y-3">
                {/* Header Badge & Actions */}
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
                    {product.category || 'Vela de Sobremesa'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Eliminar Vela"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Production Specs Badges */}
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {product.laborTimeMinutes} min labor
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> {product.recipe?.length || 0} insumos na receita
                  </span>
                </div>
              </div>

              {/* Price & Margins Section */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Custo Total Produção:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {costs.totalCost.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Preço Recomendado
                    </span>
                    <span className="text-xl font-black text-stone-900 dark:text-stone-100">
                      {product.suggestedPrice?.toFixed(2)} €
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/20">
                    +{margin.toFixed(0)}% Margem
                  </div>
                </div>

                {/* Stock Production Capacity Badge */}
                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-100 dark:border-stone-700 flex justify-between items-center text-xs">
                  <span className="text-stone-600 dark:text-stone-300 font-medium flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-amber-600" /> Capacidade Stock:
                  </span>
                  <span className="font-black text-amber-900 dark:text-amber-200">
                    {maxBatch} unidades
                  </span>
                </div>

                {/* Action to Calculator */}
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  Abrir Ficha Técnica <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
