import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  // ── Data state ────────────────────────────────────────────────
  const [suppliers,   setSuppliers]   = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [products,    setProducts]    = useState([]);
  const [fixedCosts,  setFixedCosts]  = useState([]);
  const [sales,       setSales]       = useState([]);
  const [expenses,    setExpenses]    = useState([]);

  // ── UI state ──────────────────────────────────────────────────
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [searchTerm,  setSearchTerm]  = useState('');
  const [loading,     setLoading]     = useState(true);   // initial data fetch
  const [dbError,     setDbError]     = useState(null);   // connection/query error

  // ── Theme (localStorage is fine for a UI preference) ──────────
  const [theme, setTheme] = useState(() => localStorage.getItem('dc_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('dc_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // ── Initial data load from MySQL ─────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const [sup, ing, prod, fc, sal, exp] = await Promise.all([
        api.suppliers.list(),
        api.ingredients.list(),
        api.products.list(),
        api.fixedCosts.list(),
        api.sales.list(),
        api.expenses.list(),
      ]);
      setSuppliers(sup);
      setIngredients(ing);
      setProducts(prod);
      setFixedCosts(fc);
      setSales(sal);
      setExpenses(exp);
    } catch (err) {
      console.error('[AppContext] loadAll error:', err);
      setDbError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Calculators (pure, no side-effects) ──────────────────────
  const calculateIngredientUnitCost = (purchaseCost, purchaseQuantity) => {
    if (!purchaseQuantity || purchaseQuantity <= 0) return 0;
    return parseFloat((purchaseCost / purchaseQuantity).toFixed(4));
  };

  const calculateRecipeRawMaterialCost = (recipeList) => {
    if (!recipeList || !Array.isArray(recipeList)) return 0;
    return recipeList.reduce((sum, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      return sum + (ing ? ing.unitCost * (item.quantity || 0) : 0);
    }, 0);
  };

  const calculateProductCosts = (product) => {
    const rawMaterialCost = calculateRecipeRawMaterialCost(product.recipe);
    const laborCost       = ((product.laborTimeMinutes || 0) / 60) * (product.laborHourlyRate || 0);
    const overheadCost    = rawMaterialCost * ((product.overheadPercentage || 0) / 100);
    const totalCost       = rawMaterialCost + laborCost + overheadCost;
    const targetMargin    = product.targetMarginPercentage || 60;
    const marginFactor    = Math.max(0.05, 1 - targetMargin / 100);
    const suggestedPrice  = totalCost > 0 ? totalCost / marginFactor : 0;
    return { rawMaterialCost, laborCost, overheadCost, totalCost, minPrice: totalCost, suggestedPrice };
  };

  const lowStockIngredients = ingredients.filter(ing => ing.currentStock <= ing.minStock);

  // ── Suppliers ─────────────────────────────────────────────────
  const addSupplier = async (data) => {
    const created = await api.suppliers.create(data);
    setSuppliers(prev => [...prev, created]);
  };
  const updateSupplier = async (id, data) => {
    await api.suppliers.update(id, data);
    setSuppliers(prev => prev.map(s => s.id === id ? { ...data, id } : s));
  };
  const deleteSupplier = async (id) => {
    await api.suppliers.delete(id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // ── Ingredients ───────────────────────────────────────────────
  const addIngredient = async (data) => {
    const created = await api.ingredients.create(data);
    setIngredients(prev => [...prev, created]);
  };
  const updateIngredient = async (id, data) => {
    await api.ingredients.update(id, data);
    // Re-fetch to get server-computed unitCost
    const fresh = await api.ingredients.list();
    setIngredients(fresh);
  };
  const deleteIngredient = async (id) => {
    await api.ingredients.delete(id);
    setIngredients(prev => prev.filter(i => i.id !== id));
  };
  const restockIngredient = async (id, additionalQty) => {
    const updated = await api.ingredients.restock(id, additionalQty);
    setIngredients(prev => prev.map(i => i.id === id ? updated : i));
  };

  // ── Products ──────────────────────────────────────────────────
  const addProduct = async (data) => {
    const created = await api.products.create(data);
    setProducts(prev => [...prev, created]);
  };
  const updateProduct = async (id, data) => {
    const updated = await api.products.update(id, data);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  };
  const deleteProduct = async (id) => {
    await api.products.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ── Fixed Costs ───────────────────────────────────────────────
  const addFixedCost = async (data) => {
    const created = await api.fixedCosts.create(data);
    setFixedCosts(prev => [...prev, created]);
  };
  const updateFixedCost = async (id, data) => {
    await api.fixedCosts.update(id, data);
    setFixedCosts(prev => prev.map(f => f.id === id ? { ...data, id } : f));
  };
  const deleteFixedCost = async (id) => {
    await api.fixedCosts.delete(id);
    setFixedCosts(prev => prev.filter(f => f.id !== id));
  };

  // ── Sales ─────────────────────────────────────────────────────
  const addSale = async (data) => {
    const created = await api.sales.create(data);
    setSales(prev => [created, ...prev]);
    // Refresh ingredients stock (deducted server-side)
    const freshIng = await api.ingredients.list();
    setIngredients(freshIng);
  };
  const updateSaleStatus = async (id, status) => {
    await api.sales.updateStatus(id, status);
    setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };
  const deleteSale = async (id) => {
    await api.sales.delete(id);
    setSales(prev => prev.filter(s => s.id !== id));
  };

  // ── Expenses ──────────────────────────────────────────────────
  const addExpense = async (data) => {
    const created = await api.expenses.create(data);
    setExpenses(prev => [created, ...prev]);
  };
  const deleteExpense = async (id) => {
    await api.expenses.delete(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // ── Data management utilities ─────────────────────────────────
  const resetToDemoData = async () => {
    // Just reload from DB (there is no local demo data anymore)
    await loadAll();
  };

  const exportDataJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ suppliers, ingredients, products, fixedCosts, sales, expenses, exportDate: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `dolce_candele_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // importDataJSON is kept for compatibility (imports into memory only)
  const importDataJSON = (jsonData) => {
    try {
      if (jsonData.suppliers)   setSuppliers(jsonData.suppliers);
      if (jsonData.ingredients) setIngredients(jsonData.ingredients);
      if (jsonData.products)    setProducts(jsonData.products);
      if (jsonData.fixedCosts)  setFixedCosts(jsonData.fixedCosts);
      if (jsonData.sales)       setSales(jsonData.sales);
      if (jsonData.expenses)    setExpenses(jsonData.expenses);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Data
        suppliers, ingredients, products, fixedCosts, sales, expenses,
        // UI
        activeTab, setActiveTab, searchTerm, setSearchTerm,
        theme, setTheme, toggleTheme,
        // Status
        loading, dbError, loadAll,
        // Computed
        lowStockIngredients,
        // Calculators
        calculateIngredientUnitCost, calculateRecipeRawMaterialCost, calculateProductCosts,
        // Suppliers
        addSupplier, updateSupplier, deleteSupplier,
        // Ingredients
        addIngredient, updateIngredient, deleteIngredient, restockIngredient,
        // Products
        addProduct, updateProduct, deleteProduct,
        // Fixed Costs
        addFixedCost, updateFixedCost, deleteFixedCost,
        // Sales
        addSale, updateSaleStatus, deleteSale,
        // Expenses
        addExpense, deleteExpense,
        // Data management
        resetToDemoData, exportDataJSON, importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
