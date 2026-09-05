import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, ShoppingCart } from 'lucide-react';

export const QuickSaleModal = ({ isOpen, onClose }) => {
  const { products, addSale } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [salesChannel, setSalesChannel] = useState('instagram');
  const [paymentMethod, setPaymentMethod] = useState('mbway');
  const [status, setStatus] = useState('entregue');
  const [notes, setNotes] = useState('');
  
  // Cart Items
  const [cartItems, setCartItems] = useState([
    { productId: products[0]?.id || '', quantity: 1 }
  ]);

  const handleAddItem = () => {
    setCartItems(prev => [...prev, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setCartItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Calculate gross total and fees
  const itemsDetailed = cartItems.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const unitPrice = prod ? (prod.suggestedPrice || 15) : 0;
    const subtotal = unitPrice * (parseInt(item.quantity) || 1);
    return {
      productId: item.productId,
      quantity: parseInt(item.quantity) || 1,
      unitPrice,
      subtotal
    };
  });

  const grossAmount = itemsDetailed.reduce((sum, item) => sum + item.subtotal, 0);

  // Platform Fee Estimate
  const getFeeEstimate = (method, amount) => {
    if (method === 'stripe') return amount * 0.036; // 3.6%
    if (method === 'cartao') return amount * 0.015;  // 1.5%
    return 0;
  };

  const platformFee = getFeeEstimate(paymentMethod, grossAmount);
  const netAmount = grossAmount - platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || grossAmount <= 0) return;

    addSale({
      customerName: customerName || 'Cliente Anónimo',
      salesChannel,
      paymentMethod,
      grossAmount,
      platformFee,
      netAmount,
      status,
      items: itemsDetailed,
      notes
    });

    // Reset Form
    setCustomerName('');
    setNotes('');
    setCartItems([{ productId: products[0]?.id || '', quantity: 1 }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registar Nova Venda / Pedido">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Customer & Channel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Nome do Cliente (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Mariana Silva"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Canal de Venda
            </label>
            <select
              value={salesChannel}
              onChange={(e) => setSalesChannel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-rose-400"
            >
              <option value="instagram">Instagram Direct (DM)</option>
              <option value="feiras">Feira Artesanal / Mercadinho</option>
              <option value="loja_online">Loja Online / E-commerce</option>
              <option value="encomenda_personalizada">Encomenda Personalizada</option>
            </select>
          </div>
        </div>

        {/* Product Selection Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Produtos Vendidos
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Item
            </button>
          </div>

          {cartItems.map((item, index) => {
            const prod = products.find(p => p.id === item.productId);
            const unitPrice = prod ? prod.suggestedPrice || 0 : 0;
            const itemSubtotal = unitPrice * (parseInt(item.quantity) || 1);

            return (
              <div key={index} className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.suggestedPrice?.toFixed(2)}€)
                    </option>
                  ))}
                </select>

                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center"
                    placeholder="Qtd"
                  />
                </div>

                <div className="w-24 text-right font-bold text-xs text-amber-900 dark:text-amber-200">
                  {itemSubtotal.toFixed(2)} €
                </div>

                {cartItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Método de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            >
              <option value="mbway">MB Way (Sem taxa)</option>
              <option value="stripe">Stripe / Cartão Online (~3.6% taxa)</option>
              <option value="cartao">Terminal TPA / Cartão (~1.5% taxa)</option>
              <option value="numerario">Numerário / Dinheiro</option>
              <option value="transferencia">Transferência Bancária</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Estado do Pedido
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            >
              <option value="em_producao">🟡 Em Produção</option>
              <option value="pronto">🔵 Pronto p/ Envio / Entrega</option>
              <option value="entregue">🟢 Entregue / Concluído</option>
              <option value="cancelado">🔴 Cancelado</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Notas ou Detalhes da Encomenda
          </label>
          <textarea
            rows="2"
            placeholder="Ex: Entrega em mão, embrulho de presente especial..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
          />
        </div>

        {/* Total Summary */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
            <span>Faturação Bruta:</span>
            <span className="font-semibold">{grossAmount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
            <span>Taxa Estimada ({paymentMethod}):</span>
            <span className="font-semibold text-rose-600">-{platformFee.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-1 border-t border-amber-200/50">
            <span>Valor Líquido Recebido:</span>
            <span className="text-amber-700 dark:text-amber-300">{netAmount.toFixed(2)} €</span>
          </div>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1 italic">
            * Ao confirmar, a cera, essência, pavio e taça serão descontados automaticamente do inventário!
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-[#fadbc7] bg-[#002a59] hover:bg-[#001f42] rounded-xl shadow-md transition-all border border-[#fadbc7]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-[#fadbc7]" /> Confirmar Venda & Baixar Stock
          </button>
        </div>
      </form>
    </Modal>
  );
};
