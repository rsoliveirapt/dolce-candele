import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Package,
  Plus,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const InventoryView = () => {
  const {
    ingredients,
    suppliers,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    restockIngredient,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    searchTerm
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('ingredients'); // ingredients | suppliers
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isAddIngModalOpen, setIsAddIngModalOpen] = useState(false);
  const [editingIng, setEditingIng] = useState(null);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Ingredient Form State
  const [ingName, setIngName] = useState('');
  const [ingSupplierId, setIngSupplierId] = useState('');
  const [ingCategory, setIngCategory] = useState('wax');
  const [ingPurchaseQty, setIngPurchaseQty] = useState('');
  const [ingPurchaseUnit, setIngPurchaseUnit] = useState('g');
  const [ingPurchaseCost, setIngPurchaseCost] = useState('');
  const [ingCurrentStock, setIngCurrentStock] = useState('');
  const [ingMinStock, setIngMinStock] = useState('');

  // Supplier Form State
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supWebsite, setSupWebsite] = useState('');
  const [supLeadTime, setSupLeadTime] = useState(3);
  const [supNotes, setSupNotes] = useState('');

  const categoriesMap = {
    wax: 'Ceras',
    essence: 'Essências',
    wick: 'Pavios',
    container: 'Recipientes',
    dye_decor: 'Corantes & Décor',
    packaging: 'Embalagens & Rótulos'
  };

  // Filter Ingredients
  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || ing.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filter Suppliers
  const filteredSuppliers = suppliers.filter(sup =>
    sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sup.notes && sup.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open Edit Ingredient Modal
  const handleOpenEditIng = (ing) => {
    setEditingIng(ing);
    setIngName(ing.name);
    setIngSupplierId(ing.supplierId || '');
    setIngCategory(ing.category);
    setIngPurchaseQty(ing.purchaseQuantity);
    setIngPurchaseUnit(ing.purchaseUnit);
    setIngPurchaseCost(ing.purchaseCost);
    setIngCurrentStock(ing.currentStock);
    setIngMinStock(ing.minStock);
    setIsAddIngModalOpen(true);
  };

  // Save Ingredient (New or Edit)
  const handleSaveIngredient = (e) => {
    e.preventDefault();
    const payload = {
      name: ingName,
      supplierId: ingSupplierId,
      category: ingCategory,
      purchaseQuantity: parseFloat(ingPurchaseQty),
      purchaseUnit: ingPurchaseUnit,
      purchaseCost: parseFloat(ingPurchaseCost),
      currentStock: parseFloat(ingCurrentStock),
      minStock: parseFloat(ingMinStock)
    };

    if (editingIng) {
      updateIngredient(editingIng.id, payload);
    } else {
      addIngredient(payload);
    }

    setIsAddIngModalOpen(false);
    setEditingIng(null);
    resetIngForm();
  };

  const resetIngForm = () => {
    setIngName('');
    setIngSupplierId('');
    setIngCategory('wax');
    setIngPurchaseQty('');
    setIngPurchaseUnit('g');
    setIngPurchaseCost('');
    setIngCurrentStock('');
    setIngMinStock('');
  };

  // Quick Restock Submit
  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (restockTarget && restockQty) {
      restockIngredient(restockTarget.id, restockQty);
      setIsRestockModalOpen(false);
      setRestockTarget(null);
      setRestockQty('');
    }
  };

  // Supplier Save
  const handleSaveSupplier = (e) => {
    e.preventDefault();
    const payload = {
      name: supName,
      contact: supContact,
      website: supWebsite,
      leadTimeDays: parseInt(supLeadTime) || 3,
      notes: supNotes
    };

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, payload);
    } else {
      addSupplier(payload);
    }

    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
    resetSupForm();
  };

  const resetSupForm = () => {
    setSupName('');
    setSupContact('');
    setSupWebsite('');
    setSupLeadTime(3);
    setSupNotes('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-[#fadbc7]/40 via-white to-[#fadbc7]/20 border border-[#fadbc7]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002a59] text-[#fadbc7] text-xs font-extrabold mb-2">
            <Package className="w-3.5 h-3.5 text-[#fadbc7]" /> Módulo de Inventário & Fornecedores
          </div>
          <h1 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] tracking-tight">
            Gestão de Matérias-Primas & Stock 📦
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
            Controlo automático de quantidades, custo unitário (€/g, €/ml) e alertas de reposição mínima.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'ingredients' ? (
            <button
              onClick={() => {
                resetIngForm();
                setEditingIng(null);
                setIsAddIngModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-[#fadbc7]/30"
            >
              <Plus className="w-4 h-4 text-[#fadbc7]" /> Registar Matéria-Prima
            </button>
          ) : (
            <button
              onClick={() => {
                resetSupForm();
                setEditingSupplier(null);
                setIsSupplierModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-[#fadbc7]/30"
            >
              <Plus className="w-4 h-4 text-[#fadbc7]" /> Novo Fornecedor
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('ingredients')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'ingredients'
                ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            📦 Matérias-Primas ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'suppliers'
                ? 'bg-amber-900 text-amber-50 dark:bg-amber-100 dark:text-amber-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            🏭 Fornecedores Cadastrados ({suppliers.length})
          </button>
        </div>

        {/* Category Filter pill when ingredients active */}
        {activeSubTab === 'ingredients' && (
          <div className="hidden md:flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                selectedCategory === 'all' ? 'bg-rose-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              Todos
            </button>
            {Object.entries(categoriesMap).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  selectedCategory === key ? 'bg-rose-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW SUB-TAB 1: INGREDIENTS TABLE */}
      {activeSubTab === 'ingredients' && (
        <div className="p-6 rounded-3xl glass-card space-y-4">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="pb-3 px-2">Estado</th>
                  <th className="pb-3 px-2">Nome do Insumo</th>
                  <th className="pb-3 px-2">Categoria</th>
                  <th className="pb-3 px-2 text-right">Compra (€)</th>
                  <th className="pb-3 px-2 text-right">Custo Unitário</th>
                  <th className="pb-3 px-2 text-right">Stock Atual</th>
                  <th className="pb-3 px-2 text-right">Mínimo</th>
                  <th className="pb-3 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {filteredIngredients.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const supplier = suppliers.find(s => s.id === item.supplierId);

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 transition-colors">
                      {/* Status Badge */}
                      <td className="py-3.5 px-2">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] border border-rose-500/20 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Crítico
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Em Stock
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-2 font-bold text-stone-900 dark:text-stone-100">
                        {item.name}
                        {supplier && (
                          <span className="block text-[10px] font-normal text-stone-400">
                            Fornecedor: {supplier.name}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-2 font-medium text-stone-500">
                        {categoriesMap[item.category] || item.category}
                      </td>

                      {/* Purchase Info */}
                      <td className="py-3.5 px-2 text-right font-medium text-stone-700 dark:text-stone-300">
                        {item.purchaseCost.toFixed(2)}€ / {item.purchaseQuantity} {item.purchaseUnit}
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3.5 px-2 text-right font-extrabold text-amber-900 dark:text-amber-200">
                        {item.unitCost.toFixed(4)} € <span className="text-[10px] font-normal text-stone-400">/{item.purchaseUnit}</span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3.5 px-2 text-right font-bold">
                        <span className={isLow ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-stone-800 dark:text-stone-200'}>
                          {item.currentStock} {item.purchaseUnit}
                        </span>
                      </td>

                      {/* Min Stock */}
                      <td className="py-3.5 px-2 text-right font-medium text-stone-400">
                        {item.minStock} {item.purchaseUnit}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setRestockTarget(item);
                              setIsRestockModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors"
                            title="Reabastecer Stock Rápido"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditIng(item)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Editar Insumo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteIngredient(item.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* VIEW SUB-TAB 2: SUPPLIERS GRID */}
      {activeSubTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((sup) => (
            <div key={sup.id} className="p-5 rounded-3xl glass-card space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                    {sup.name}
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                    Prazo Médio Entrega: {sup.leadTimeDays} dias
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingSupplier(sup);
                      setSupName(sup.name);
                      setSupContact(sup.contact || '');
                      setSupWebsite(sup.website || '');
                      setSupLeadTime(sup.leadTimeDays || 3);
                      setSupNotes(sup.notes || '');
                      setIsSupplierModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSupplier(sup.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                <p><strong>Contacto:</strong> {sup.contact || 'N/A'}</p>
                {sup.website && (
                  <a
                    href={sup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-rose-600 font-medium hover:underline pt-1"
                  >
                    Visitar Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {sup.notes && (
                <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-stone-800/50 text-[11px] text-stone-500 border border-amber-100 dark:border-stone-700">
                  {sup.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT INGREDIENT */}
      <Modal
        isOpen={isAddIngModalOpen}
        onClose={() => setIsAddIngModalOpen(false)}
        title={editingIng ? 'Editar Matéria-Prima' : 'Registar Nova Matéria-Prima'}
      >
        <form onSubmit={handleSaveIngredient} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Nome da Matéria-Prima *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cera de Soja C-3"
                value={ingName}
                onChange={(e) => setIngName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Categoria *
              </label>
              <select
                value={ingCategory}
                onChange={(e) => setIngCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                {Object.entries(categoriesMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Qtd de Compra *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 5000"
                value={ingPurchaseQty}
                onChange={(e) => setIngPurchaseQty(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Unidade Base *
              </label>
              <select
                value={ingPurchaseUnit}
                onChange={(e) => setIngPurchaseUnit(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="g">Gramas (g)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="unidade">Unidade (un)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Preço Total Compra (€) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 35.00"
                value={ingPurchaseCost}
                onChange={(e) => setIngPurchaseCost(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Stock Atual
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 4200"
                value={ingCurrentStock}
                onChange={(e) => setIngCurrentStock(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 1000"
                value={ingMinStock}
                onChange={(e) => setIngMinStock(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Fornecedor (opcional)
              </label>
              <select
                value={ingSupplierId}
                onChange={(e) => setIngSupplierId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="">Sem Fornecedor</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddIngModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-md"
            >
              Guardar Matéria-Prima
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: QUICK RESTOCK */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title={`Reabastecer Stock: ${restockTarget?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <p className="text-xs text-stone-500">
            Adicione a quantidade comprada para somar diretamente ao stock atual.
          </p>
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Quantidade a Adicionar ({restockTarget?.purchaseUnit})
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Ex: 5000"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRestockModalOpen(false)}
              className="px-4 py-2 text-xs text-stone-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
            >
              Adicionar ao Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: SUPPLIER FORM */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title={editingSupplier ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}
      >
        <form onSubmit={handleSaveSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Nome da Empresa / Fornecedor *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Gran Velas Europa"
              value={supName}
              onChange={(e) => setSupName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Contacto (Email / Tel)
              </label>
              <input
                type="text"
                placeholder="Ex: geral@granvelas.pt"
                value={supContact}
                onChange={(e) => setSupContact(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Link do Website / Loja
              </label>
              <input
                type="text"
                placeholder="Ex: https://www.granvelas.com"
                value={supWebsite}
                onChange={(e) => setSupWebsite(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tempo Médio de Entrega (Dias)
            </label>
            <input
              type="number"
              min="1"
              value={supLeadTime}
              onChange={(e) => setSupLeadTime(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Notas & Observações
            </label>
            <textarea
              rows="2"
              placeholder="Ex: Cera de soja vegetal 100% pura..."
              value={supNotes}
              onChange={(e) => setSupNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(false)}
              className="px-4 py-2 text-xs text-stone-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700"
            >
              Guardar Fornecedor
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
