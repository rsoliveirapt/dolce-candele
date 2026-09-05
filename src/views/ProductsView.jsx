import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Sparkles,
  Plus,
  Flame,
  Clock,
  Euro,
  ArrowUpRight,
  Trash2,
  PackageCheck,
  Calculator,
  Info
} from 'lucide-react';

export const ProductsView = () => {
  const { products, ingredients, calculateProductCosts, addProduct, deleteProduct, setActiveTab, searchTerm } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Velas de Sobremesa');
  const [description, setDescription] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [laborTimeMinutes, setLaborTimeMinutes] = useState(30);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate max units batch that can be produced with current ingredient stock
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

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd = {
      name,
      category,
      description,
      suggestedPrice: parseFloat(suggestedPrice) || 0,
      laborTimeMinutes: parseInt(laborTimeMinutes) || 30,
      laborHourlyRate: 12.50,
      overheadPercentage: 10.0,
      targetMarginPercentage: 60.0,
      recipe: []
    };

    addProduct(newProd);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCategory('Velas de Sobremesa');
    setDescription('');
    setSuggestedPrice('');
    setLaborTimeMinutes(30);
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
            Gerencie o seu catálogo de velas, receitas ativas, custos unitários e capacidade de produção.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-[#fadbc7]/30"
        >
          <Plus className="w-4 h-4 text-[#fadbc7]" /> Criar / Simular Nova Vela
        </button>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card border border-[#fadbc7] space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#fadbc7]/40 dark:bg-[#002a59] text-[#002a59] dark:text-[#fadbc7] flex items-center justify-center border border-[#fadbc7]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-[#002a59] dark:text-[#fadbc7]">
            Sem Velas no Catálogo
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            O seu catálogo está limpo e pronto para receber os seus dados reais. Clique no botão abaixo para submeter a sua primeira vela artesanal ou calcular os custos de receita ao cêntimo.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Registar Nova Vela
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-white dark:bg-[#001f42] text-[#002a59] dark:text-[#fadbc7] border border-[#fadbc7] hover:bg-[#fadbc7]/30 transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" /> Abrir Calculadora de Custos
            </button>
          </div>
        </div>
      ) : (
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
                className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between relative group hover:border-[#002a59] dark:hover:border-[#fadbc7] transition-all shadow-lg hover:shadow-xl"
              >
                <div className="space-y-3">
                  {/* Header Badge & Actions */}
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-[#fadbc7]/60 text-[#002a59] dark:bg-[#002a59] dark:text-[#fadbc7] text-[11px] font-extrabold">
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
                    <h3 className="text-lg font-extrabold text-[#002a59] dark:text-[#fadbc7] group-hover:text-rose-600 transition-colors">
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
                <div className="pt-4 border-t border-[#fadbc7]/40 space-y-3">
                  
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
                      <span className="text-xl font-black text-[#002a59] dark:text-[#fadbc7]">
                        {product.suggestedPrice?.toFixed(2)} €
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/20">
                      +{margin.toFixed(0)}% Margem
                    </div>
                  </div>

                  {/* Stock Production Capacity Badge */}
                  <div className="p-3 rounded-2xl bg-[#fadbc7]/30 dark:bg-[#001f42] border border-[#fadbc7] flex justify-between items-center text-xs">
                    <span className="text-stone-600 dark:text-stone-300 font-medium flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-[#002a59] dark:text-[#fadbc7]" /> Capacidade Stock:
                    </span>
                    <span className="font-black text-[#002a59] dark:text-[#fadbc7]">
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
      )}

      {/* MODAL: CREATE NEW CANDLE PRODUCT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registar Nova Vela Artesanal"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="p-3 rounded-xl bg-[#fadbc7]/30 dark:bg-[#002a59]/60 text-xs text-[#002a59] dark:text-[#fadbc7] flex items-start gap-2 border border-[#fadbc7]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Preencha as informações básicas para adicionar a vela diretamente ao seu catálogo ou abra a calculadora para definir as gramagens e insumos da receita.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1">
              Nome da Vela *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Vela Torta Mousse de Baunilha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1">
                Linha / Categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Velas de Sobremesa"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1">
                Preço de Venda Sugerido (€)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 22.50"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold text-[#002a59] dark:text-[#fadbc7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1">
              Descrição do Produto
            </label>
            <textarea
              rows="2"
              placeholder="Ex: Vela em copo de milkshake com chantilly de cera de coco, pavio de madeira e decorações artesanais."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1">
              Tempo Médio de Produção (Minutos)
            </label>
            <input
              type="number"
              value={laborTimeMinutes}
              onChange={(e) => setLaborTimeMinutes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#fadbc7]">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setActiveTab('calculator');
              }}
              className="px-4 py-2.5 text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7] bg-[#fadbc7]/40 hover:bg-[#fadbc7]/70 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-4 h-4" /> Abrir Calculadora de Receita
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-extrabold text-[#fadbc7] bg-[#002a59] hover:bg-[#001f42] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Guardar Vela no Catálogo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
