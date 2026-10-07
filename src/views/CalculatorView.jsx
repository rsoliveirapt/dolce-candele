import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Flame,
  Euro,
  Clock,
  Zap,
  Info,
  Check
} from 'lucide-react';

export const CalculatorView = () => {
  const { ingredients, products, addProduct, updateProduct, calculateProductCosts } = useApp();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || null);

  // Form State for Candle Calculator
  const [candleName, setCandleName] = useState('');
  const [category, setCategory] = useState('Velas de Sobremesa');
  const [description, setDescription] = useState('');
  const [laborTimeMinutes, setLaborTimeMinutes] = useState(30);
  const [laborHourlyRate, setLaborHourlyRate] = useState(12.50);
  const [overheadPercentage, setOverheadPercentage] = useState(10.0);
  const [targetMarginPercentage, setTargetMarginPercentage] = useState(65.0);

  // Recipe items: array of { ingredientId, quantity, unit }
  const [recipe, setRecipe] = useState(() => {
    if (!ingredients || ingredients.length === 0) return [];
    return [{ ingredientId: ingredients[0].id, quantity: 150, unit: ingredients[0].purchaseUnit || 'g' }];
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Load Existing Product into Calculator Form
  const handleSelectProduct = (prodId) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setCandleName(prod.name);
      setCategory(prod.category || 'Velas de Sobremesa');
      setDescription(prod.description || '');
      setLaborTimeMinutes(prod.laborTimeMinutes || 30);
      setLaborHourlyRate(prod.laborHourlyRate || 12.50);
      setOverheadPercentage(prod.overheadPercentage || 10.0);
      setTargetMarginPercentage(prod.targetMarginPercentage || 60.0);
      setRecipe(prod.recipe || []);
    }
  };

  // Recipe Item Handlers
  const handleAddRecipeItem = () => {
    const defaultIng = ingredients[0];
    if (!defaultIng) return;
    setRecipe(prev => [
      ...prev,
      { ingredientId: defaultIng.id, quantity: 10, unit: defaultIng.purchaseUnit }
    ]);
  };

  const handleRemoveRecipeItem = (index) => {
    setRecipe(prev => prev.filter((_, i) => i !== index));
  };

  const handleRecipeItemChange = (index, field, value) => {
    setRecipe(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        if (field === 'ingredientId') {
          const ing = ingredients.find(ingItem => ingItem.id === value);
          if (ing) updated.unit = ing.purchaseUnit;
        }
        return updated;
      }
      return item;
    }));
  };

  // Dynamic Real-time Calculations
  const rawMaterialCost = recipe.reduce((sum, item) => {
    const ing = ingredients.find(i => i.id === item.ingredientId);
    if (!ing) return sum;
    return sum + ((ing.unitCost || 0) * (parseFloat(item.quantity) || 0));
  }, 0);

  const laborCost = ((parseFloat(laborTimeMinutes) || 0) / 60) * (parseFloat(laborHourlyRate) || 0);
  const overheadCost = rawMaterialCost * ((parseFloat(overheadPercentage) || 0) / 100);
  const totalProductionCost = rawMaterialCost + laborCost + overheadCost;

  const marginFactor = Math.max(0.05, 1 - (parseFloat(targetMarginPercentage) / 100));
  const suggestedSalePrice = totalProductionCost > 0 ? totalProductionCost / marginFactor : 0;
  const netProfitPerCandle = Math.max(0, suggestedSalePrice - totalProductionCost);
  const actualProfitMargin = suggestedSalePrice > 0 ? (netProfitPerCandle / suggestedSalePrice) * 100 : 0;

  // Save / Update Product Recipe
  const handleSaveRecipe = () => {
    if (!candleName.trim()) return;

    const productPayload = {
      name: candleName,
      category,
      description,
      laborTimeMinutes: parseFloat(laborTimeMinutes),
      laborHourlyRate: parseFloat(laborHourlyRate),
      overheadPercentage: parseFloat(overheadPercentage),
      targetMarginPercentage: parseFloat(targetMarginPercentage),
      recipe,
      suggestedPrice: parseFloat(suggestedSalePrice.toFixed(2))
    };

    if (selectedProductId) {
      updateProduct(selectedProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Export Technical Sheet as PDF
  const handlePrintTechnicalSheet = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 0;

    // ── Helpers ──────────────────────────────────────────────
    const line = (x1, y1, x2, y2, color = [220, 200, 180]) => {
      doc.setDrawColor(...color);
      doc.line(x1, y1, x2, y2);
    };
    const rect = (x, y2, w, h, fill) => {
      doc.setFillColor(...fill);
      doc.roundedRect(x, y2, w, h, 3, 3, 'F');
    };
    const text = (str, x, y2, opts = {}) => {
      doc.text(str, x, y2, opts);
    };

    // ── Header bar ───────────────────────────────────────────
    rect(0, 0, pageW, 28, [0, 42, 89]);        // deep navy
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(250, 219, 199);           // peach
    text('DOLCE CANDELE', margin, 12);
    doc.setFontSize(8);
    doc.setTextColor(200, 180, 160);
    doc.setFont('helvetica', 'normal');
    text('Ficha Técnica de Produção  ·  @dolcecandele.pt', margin, 19);
    // Date top-right
    const dateStr = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.setFontSize(7.5);
    text(dateStr, pageW - margin, 12, { align: 'right' });
    y = 36;

    // ── Section 1 – Product identification ───────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 42, 89);
    text('1. Identificação do Produto Artesanal', margin, y);
    y += 2;
    line(margin, y, pageW - margin, y, [0, 42, 89]);
    y += 6;

    const labelW = 38;
    const drawField = (label, value) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 100, 80);
      text(label, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      text(value || '—', margin + labelW, y);
      y += 7;
    };

    drawField('Nome da Vela:', candleName || 'Nova Vela Artesanal');
    drawField('Categoria / Linha:', category);
    if (description) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 100, 80);
      text('Descrição:', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      const descLines = doc.splitTextToSize(description, contentW - labelW);
      doc.text(descLines, margin + labelW, y);
      y += descLines.length * 5 + 3;
    }
    y += 3;

    // ── Section 2 – Recipe & raw materials ───────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 42, 89);
    text('2. Receita & Matérias-Primas (Ficha Técnica)', margin, y);
    y += 2;
    line(margin, y, pageW - margin, y, [0, 42, 89]);
    y += 7;

    // Table header
    const cols = { name: margin, qty: margin + 78, unit: margin + 100, unitCost: margin + 118, total: margin + 148 };
    rect(margin, y - 4, contentW, 7, [0, 42, 89]);
    doc.setFontSize(7.5);
    doc.setTextColor(250, 219, 199);
    doc.setFont('helvetica', 'bold');
    text('Insumo / Matéria-Prima', cols.name + 1, y);
    text('Qtd', cols.qty, y, { align: 'right' });
    text('Un.', cols.unit, y);
    text('€ / Un.', cols.unitCost, y, { align: 'right' });
    text('Total €', cols.total + 12, y, { align: 'right' });
    y += 6;

    // Table rows
    recipe.forEach((item, idx) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (!ing) return;
      const itemCost = (ing.unitCost || 0) * (parseFloat(item.quantity) || 0);
      const rowBg = idx % 2 === 0 ? [255, 252, 248] : [248, 244, 238];
      rect(margin, y - 4, contentW, 7, rowBg);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      const ingName = doc.splitTextToSize(ing.name, 74)[0];
      text(ingName, cols.name + 1, y);
      text(String(item.quantity), cols.qty, y, { align: 'right' });
      text(item.unit || '', cols.unit, y);
      text(ing.unitCost?.toFixed(4) + ' €', cols.unitCost, y, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      text(itemCost.toFixed(2) + ' €', cols.total + 12, y, { align: 'right' });
      y += 7;
    });

    // Subtotal row
    rect(margin, y - 4, contentW, 7, [250, 219, 199]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 42, 89);
    text('Subtotal Matérias-Primas:', cols.name + 1, y);
    text(rawMaterialCost.toFixed(2) + ' €', cols.total + 12, y, { align: 'right' });
    y += 10;

    // ── Section 3 – Labour & overhead ────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 42, 89);
    text('3. Mão de Obra & Custos Indiretos', margin, y);
    y += 2;
    line(margin, y, pageW - margin, y, [0, 42, 89]);
    y += 7;

    const drawCostRow = (label, value, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(8);
      doc.setTextColor(bold ? 0 : 60, bold ? 42 : 60, bold ? 89 : 60);
      text(label, margin + 1, y);
      doc.setFont('helvetica', 'bold');
      text(value, pageW - margin, y, { align: 'right' });
      y += 6;
    };

    drawCostRow(`Mão de Obra (${laborTimeMinutes} min @ ${parseFloat(laborHourlyRate).toFixed(2)} €/h):`, laborCost.toFixed(2) + ' €');
    drawCostRow(`Custos Indiretos / Overhead (${overheadPercentage}% sobre insumos):`, overheadCost.toFixed(2) + ' €');
    y += 2;
    line(margin, y, pageW - margin, y);
    y += 5;
    drawCostRow('CUSTO TOTAL DE PRODUÇÃO:', totalProductionCost.toFixed(2) + ' €', true);
    y += 5;

    // ── Section 4 – Pricing summary ──────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 42, 89);
    text('4. Resumo de Preços', margin, y);
    y += 2;
    line(margin, y, pageW - margin, y, [0, 42, 89]);
    y += 7;

    // Break-even card
    rect(margin, y - 5, contentW, 14, [240, 240, 235]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 90, 80);
    text('PREÇO MÍNIMO (BREAK-EVEN) — Sem prejuízo nem lucro', margin + 2, y);
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    text(totalProductionCost.toFixed(2) + ' €', pageW - margin - 2, y + 5, { align: 'right' });
    y += 18;

    // Recommended sale price card
    rect(margin, y - 5, contentW, 20, [5, 130, 100]);   // emerald green
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(200, 240, 220);
    text(`PREÇO DE VENDA RECOMENDADO  (Margem ${parseFloat(targetMarginPercentage).toFixed(0)}%)`, margin + 2, y);
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    text(suggestedSalePrice.toFixed(2) + ' €', margin + 2, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 240, 200);
    text('Lucro Líquido por Vela:', pageW - margin - 2, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(250, 219, 199);
    text('+' + netProfitPerCandle.toFixed(2) + ' €', pageW - margin - 2, y + 12, { align: 'right' });
    y += 26;

    // Actual margin note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    text(
      `Com este preço (${suggestedSalePrice.toFixed(2)} €) obtém uma margem de lucro real de ${actualProfitMargin.toFixed(0)}% sobre cada vela vendida.`,
      margin, y
    );
    y += 10;

    // ── Footer ───────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight();
    line(margin, pageH - 14, pageW - margin, pageH - 14);
    doc.setFontSize(7);
    doc.setTextColor(160, 140, 120);
    doc.setFont('helvetica', 'normal');
    text('Dolce Candele  ·  Gestão Operacional & Financeira  ·  dolcecandele.pt', pageW / 2, pageH - 9, { align: 'center' });

    // ── Save ─────────────────────────────────────────────────
    const filename = `FichaTecnica_${(candleName || 'VelaArtesanal').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-[#fadbc7]/40 via-white to-[#fadbc7]/20 border border-[#fadbc7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#002a59] dark:text-[#fadbc7] tracking-tight">
            Calculadora de Custo de Produção por Vela 🕯️
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
            Simule matérias-primas, mão de obra e custos indiretos para descobrir o preço mínimo e recomendado de venda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedProductId(null);
              setCandleName('');
              setDescription('');
              setRecipe([]);
            }}
            className="px-4 py-2 text-xs font-extrabold rounded-xl bg-white dark:bg-[#002a59] text-[#002a59] dark:text-[#fadbc7] border border-[#fadbc7] hover:bg-[#fadbc7]/30 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Nova Vela
          </button>
          
          <button
            onClick={handlePrintTechnicalSheet}
            className="px-4 py-2 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" /> Imprimir Ficha
          </button>
        </div>
      </div>

      {/* Select Existing Product Selector */}
      <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
          Carregar Ficha Técnica Existente:
        </label>
        <select
          value={selectedProductId || ''}
          onChange={(e) => handleSelectProduct(e.target.value)}
          className="px-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-semibold focus:ring-2 focus:ring-rose-400"
        >
          <option value="">-- Selecionar Vela do Catálogo --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.suggestedPrice?.toFixed(2)}€)
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Form on Left, Realtime Summary & Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Ingredients (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Product Basics */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              1. Identificação do Produto artesanal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nome da Vela de Sobremesa *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Vela Milkshake de Morango com Chantilly"
                  value={candleName}
                  onChange={(e) => setCandleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Categoria / Linha
                </label>
                <input
                  type="text"
                  placeholder="Ex: Velas em Taça / Sobremesa"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Descrição & Notas de Apresentação
              </label>
              <textarea
                rows="2"
                placeholder="Ex: Base rosa tom morango em cera de soja C-3, topo com chantilly de cera de coco e pavio de madeira..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
            </div>
          </div>

          {/* Section 2: Recipe Ingredients Table */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  2. Receita & Matérias-Primas (Ficha Técnica)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Defina as quantidades exatas de cera, essência, pavio e taça utilizados.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRecipeItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Insumo
              </button>
            </div>

            {/* Ingredients Recipe Table */}
            <div className="space-y-2.5">
              {recipe.map((item, index) => {
                const ing = ingredients.find(i => i.id === item.ingredientId);
                const unitCost = ing ? ing.unitCost : 0;
                const itemTotalCost = unitCost * (parseFloat(item.quantity) || 0);

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-amber-50/40 dark:bg-stone-800/40 border border-amber-100 dark:border-stone-700"
                  >
                    {/* Insumo Select */}
                    <div className="flex-1">
                      <select
                        value={item.ingredientId}
                        onChange={(e) => handleRecipeItemChange(index, 'ingredientId', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-medium"
                      >
                        {ingredients.map(ingItem => (
                          <option key={ingItem.id} value={ingItem.id}>
                            {ingItem.name} ({ingItem.unitCost?.toFixed(4)}€ / {ingItem.purchaseUnit})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Input */}
                    <div className="w-full sm:w-28 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleRecipeItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center font-bold"
                        placeholder="Qtd"
                      />
                      <span className="text-xs text-stone-500 font-semibold w-8">
                        {item.unit}
                      </span>
                    </div>

                    {/* Cost Preview */}
                    <div className="w-full sm:w-24 text-right font-bold text-xs text-amber-900 dark:text-amber-200">
                      {itemTotalCost.toFixed(2)} €
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipeItem(index)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total Raw Materials */}
            <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-700 text-xs">
              <span className="font-semibold text-stone-600 dark:text-stone-300">
                Subtotal Matérias-Primas:
              </span>
              <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">
                {rawMaterialCost.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Section 3: Labor & Overhead */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-500" />
              3. Mão de Obra Artesanal & Custos Indiretos (Overhead)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Tempo Produção (Minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={laborTimeMinutes}
                  onChange={(e) => setLaborTimeMinutes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Valor Hora do Artesão (€/h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={laborHourlyRate}
                  onChange={(e) => setLaborHourlyRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Overhead (% Luz/Água)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={overheadPercentage}
                  onChange={(e) => setOverheadPercentage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-center"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/70 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Custo de Mão de Obra ({laborTimeMinutes} min @ {laborHourlyRate}€/h):</span>
                <span className="font-semibold">{laborCost.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Custos Indiretos ({overheadPercentage}% sobre insumos):</span>
                <span className="font-semibold">{overheadCost.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Section 4: Target Margin Slider */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Euro className="w-4 h-4 text-emerald-500" />
                4. Margem de Lucro Desejada
              </h3>
              <span className="text-sm font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {targetMarginPercentage}% Margem
              </span>
            </div>

            <div>
              <input
                type="range"
                min="20"
                max="85"
                step="5"
                value={targetMarginPercentage}
                onChange={(e) => setTargetMarginPercentage(e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>20% (Margem Mínima)</span>
                <span>50% (Padrão)</span>
                <span>65% (Recomendado Gourmet)</span>
                <span>85% (Coleção Especial)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Technical Sheet Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 p-6 rounded-3xl glass-card bg-gradient-to-b from-amber-50/80 via-white to-rose-50/50 dark:from-stone-900 dark:to-stone-900 border-2 border-amber-200/80 dark:border-stone-700 space-y-6 shadow-xl">
            
            {/* Card Header */}
            <div className="text-center pb-4 border-b border-amber-200/60 dark:border-stone-800">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md mb-2">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                {candleName || 'Nova Vela Artesanal'}
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                {category}
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Matérias-Primas (Cera, Essência, Taça):</span>
                <span className="font-bold">{rawMaterialCost.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Mão de Obra Artesanal:</span>
                <span className="font-bold">{laborCost.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Custos Indiretos (Luz/Gás/Água):</span>
                <span className="font-bold">{overheadCost.toFixed(2)} €</span>
              </div>

              <div className="pt-3 border-t border-amber-200/80 dark:border-stone-800 flex justify-between text-sm font-black text-stone-900 dark:text-stone-100">
                <span>CUSTO TOTAL PRODUÇÃO:</span>
                <span className="text-rose-600 dark:text-rose-400">{totalProductionCost.toFixed(2)} €</span>
              </div>
            </div>

            {/* Sale Prices Cards */}
            <div className="space-y-3 pt-2">
              
              {/* Minimum Break-even Price */}
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Preço Mínimo (Break-Even)
                  </span>
                  <span className="text-xs text-stone-500">Sem prejuízo nem lucro</span>
                </div>
                <span className="text-base font-extrabold text-stone-800 dark:text-stone-200">
                  {totalProductionCost.toFixed(2)} €
                </span>
              </div>

              {/* Recommended Sale Price */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
                    Preço de Venda Recomendado
                  </span>
                  <span className="text-2xl font-black">
                    {suggestedSalePrice.toFixed(2)} €
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-100 font-semibold block">Lucro Líquido</span>
                  <span className="text-lg font-black text-amber-200">
                    +{netProfitPerCandle.toFixed(2)} €
                  </span>
                </div>
              </div>

            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Com este preço ({suggestedSalePrice.toFixed(2)}€), obtém uma margem de lucro real de <strong>{actualProfitMargin.toFixed(0)}%</strong> sobre cada vela vendida.
              </span>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveRecipe}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] font-extrabold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#fadbc7]/30"
            >
              {isSavedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Ficha Guardada com Sucesso!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Guardar Ficha Técnica no Catálogo
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
