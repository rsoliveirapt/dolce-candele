import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialSuppliers,
  initialIngredients,
  initialProducts,
  initialFixedCosts,
  initialSales,
  initialExpenses
} from '../data/initialData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // One-time legacy demo data clearing migration
  useEffect(() => {
    const isCleared = localStorage.getItem('dc_demo_cleared_v2');
    if (!isCleared) {
      localStorage.removeItem('dc_suppliers');
      localStorage.removeItem('dc_ingredients');
      localStorage.removeItem('dc_products');
      localStorage.removeItem('dc_fixed_costs');
      localStorage.removeItem('dc_sales');
      localStorage.removeItem('dc_expenses');
      localStorage.setItem('dc_demo_cleared_v2', 'true');
    }
  }, []);

  // LocalStorage State Initialization
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('dc_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('dc_ingredients');
    return saved ? JSON.parse(saved) : initialIngredients;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('dc_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [fixedCosts, setFixedCosts] = useState(() => {
    const saved = localStorage.getItem('dc_fixed_costs');
    return saved ? JSON.parse(saved) : initialFixedCosts;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('dc_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('dc_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Theme State (light | dark)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dc_theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('dc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('dc_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('dc_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('dc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dc_fixed_costs', JSON.stringify(fixedCosts));
  }, [fixedCosts]);

  useEffect(() => {
    localStorage.setItem('dc_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('dc_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // ==========================================
  // HELPER CALCULATORS
  // ==========================================

  // Calculate Unit Cost for an Ingredient (€ / g, € / ml, € / unit)
  const calculateIngredientUnitCost = (purchaseCost, purchaseQuantity) => {
    if (!purchaseQuantity || purchaseQuantity <= 0) return 0;
    return parseFloat((purchaseCost / purchaseQuantity).toFixed(4));
  };

  // Calculate Raw Material Cost for a Product Recipe
  const calculateRecipeRawMaterialCost = (recipeList) => {
    if (!recipeList || !Array.isArray(recipeList)) return 0;
    return recipeList.reduce((sum, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (!ing) return sum;
      return sum + (ing.unitCost * (item.quantity || 0));
    }, 0);
  };

  // Calculate Complete Cost Breakdown for a Product
  const calculateProductCosts = (product) => {
    const rawMaterialCost = calculateRecipeRawMaterialCost(product.recipe);
    const laborCost = ((product.laborTimeMinutes || 0) / 60) * (product.laborHourlyRate || 0);
    const overheadCost = rawMaterialCost * ((product.overheadPercentage || 0) / 100);
    const totalCost = rawMaterialCost + laborCost + overheadCost;

    const targetMargin = product.targetMarginPercentage || 60;
    const marginFactor = Math.max(0.05, 1 - (targetMargin / 100));
    const suggestedPrice = totalCost > 0 ? totalCost / marginFactor : 0;
    const minPrice = totalCost;

    return {
      rawMaterialCost,
      laborCost,
      overheadCost,
      totalCost,
      minPrice,
      suggestedPrice
    };
  };

  // Check Low Stock Ingredients
  const lowStockIngredients = ingredients.filter(ing => ing.currentStock <= ing.minStock);

  // ==========================================
  // INVENTORY / INGREDIENT ACTIONS
  // ==========================================
  const addIngredient = (newIng) => {
    const unitCost = calculateIngredientUnitCost(newIng.purchaseCost, newIng.purchaseQuantity);
    const item = {
      ...newIng,
      id: `ing-${Date.now()}`,
      unitCost,
      currentStock: parseFloat(newIng.currentStock || newIng.purchaseQuantity || 0),
      minStock: parseFloat(newIng.minStock || 0)
    };
    setIngredients(prev => [...prev, item]);
  };

  const updateIngredient = (id, updatedIng) => {
    const unitCost = calculateIngredientUnitCost(updatedIng.purchaseCost, updatedIng.purchaseQuantity);
    setIngredients(prev => prev.map(ing => ing.id === id ? { ...updatedIng, id, unitCost } : ing));
  };

  const deleteIngredient = (id) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const restockIngredient = (id, additionalQty) => {
    setIngredients(prev => prev.map(ing => {
      if (ing.id === id) {
        return { ...ing, currentStock: ing.currentStock + parseFloat(additionalQty) };
      }
      return ing;
    }));
  };

  // ==========================================
  // SUPPLIER ACTIONS
  // ==========================================
  const addSupplier = (newSup) => {
    const item = { ...newSup, id: `sup-${Date.now()}` };
    setSuppliers(prev => [...prev, item]);
  };

  const updateSupplier = (id, updatedSup) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...updatedSup, id } : s));
  };

  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const addProduct = (newProd) => {
    const item = { ...newProd, id: `prod-${Date.now()}` };
    setProducts(prev => [...prev, item]);
  };

  const updateProduct = (id, updatedProd) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedProd, id } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ==========================================
  // SALES ACTIONS (WITH AUTOMATIC INVENTORY DEDUCTION)
  // ==========================================
  const addSale = (newSale) => {
    const saleId = `sale-${Date.now()}`;
    const nextOrderNumber = sales.length > 0 ? Math.max(...sales.map(s => s.orderNumber || 1000)) + 1 : 1001;

    const saleRecord = {
      ...newSale,
      id: saleId,
      orderNumber: nextOrderNumber,
      saleDate: newSale.saleDate || new Date().toISOString()
    };

    let updatedIngredients = [...ingredients];
    if (saleRecord.items && Array.isArray(saleRecord.items)) {
      saleRecord.items.forEach(saleItem => {
        const prod = products.find(p => p.id === saleItem.productId);
        if (prod && prod.recipe) {
          prod.recipe.forEach(recipeIng => {
            const ingIndex = updatedIngredients.findIndex(i => i.id === recipeIng.ingredientId);
            if (ingIndex !== -1) {
              const qtyDeducted = (recipeIng.quantity || 0) * (saleItem.quantity || 1);
              const newStock = Math.max(0, updatedIngredients[ingIndex].currentStock - qtyDeducted);
              updatedIngredients[ingIndex] = {
                ...updatedIngredients[ingIndex],
                currentStock: newStock
              };
            }
          });
        }
      });
    }

    setIngredients(updatedIngredients);
    setSales(prev => [saleRecord, ...prev]);
  };

  const updateSaleStatus = (id, status) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteSale = (id) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  // ==========================================
  // EXPENSES & FIXED COSTS
  // ==========================================
  const addExpense = (newExp) => {
    const item = { ...newExp, id: `exp-${Date.now()}` };
    setExpenses(prev => [item, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addFixedCost = (newFC) => {
    const item = { ...newFC, id: `fc-${Date.now()}` };
    setFixedCosts(prev => [...prev, item]);
  };

  const updateFixedCost = (id, updatedFC) => {
    setFixedCosts(prev => prev.map(f => f.id === id ? { ...updatedFC, id } : f));
  };

  const deleteFixedCost = (id) => {
    setFixedCosts(prev => prev.filter(f => f.id !== id));
  };

  // ==========================================
  // DATA MANAGEMENT & RESET
  // ==========================================
  const resetToDemoData = () => {
    setSuppliers([]);
    setIngredients([]);
    setProducts([]);
    setFixedCosts([]);
    setSales([]);
    setExpenses([]);
    localStorage.removeItem('dc_suppliers');
    localStorage.removeItem('dc_ingredients');
    localStorage.removeItem('dc_products');
    localStorage.removeItem('dc_fixed_costs');
    localStorage.removeItem('dc_sales');
    localStorage.removeItem('dc_expenses');
  };

  const exportDataJSON = () => {
    const data = {
      suppliers,
      ingredients,
      products,
      fixedCosts,
      sales,
      expenses,
      exportDate: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dolce_candele_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importDataJSON = (jsonData) => {
    try {
      if (jsonData.suppliers) setSuppliers(jsonData.suppliers);
      if (jsonData.ingredients) setIngredients(jsonData.ingredients);
      if (jsonData.products) setProducts(jsonData.products);
      if (jsonData.fixedCosts) setFixedCosts(jsonData.fixedCosts);
      if (jsonData.sales) setSales(jsonData.sales);
      if (jsonData.expenses) setExpenses(jsonData.expenses);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        suppliers,
        ingredients,
        products,
        fixedCosts,
        sales,
        expenses,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        theme,
        setTheme,
        toggleTheme,
        lowStockIngredients,
        // Calculators
        calculateIngredientUnitCost,
        calculateRecipeRawMaterialCost,
        calculateProductCosts,
        // Handlers
        addIngredient,
        updateIngredient,
        deleteIngredient,
        restockIngredient,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updateSaleStatus,
        deleteSale,
        addExpense,
        deleteExpense,
        addFixedCost,
        updateFixedCost,
        deleteFixedCost,
        resetToDemoData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
