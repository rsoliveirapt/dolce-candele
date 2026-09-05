export const initialSuppliers = [
  {
    id: "sup-1",
    name: "Gran Velas Europa",
    contact: "geral@granvelas.pt / +351 912 345 678",
    website: "https://www.granvelas.com",
    leadTimeDays: 3,
    notes: "Fornecedor principal de cera de soja vegetal 100% pura e pavios de madeira de cedro."
  },
  {
    id: "sup-2",
    name: "Aroma Craft Co.",
    contact: "suporte@aromacraft.eu",
    website: "https://www.aromacraft.eu",
    leadTimeDays: 5,
    notes: "Óleos essenciais e essências lipossolúveis premium de alta retenção térmica (morango, baunilha bourbon, café arabica)."
  },
  {
    id: "sup-3",
    name: "Plastiglass Embalagens",
    contact: "comercial@plastiglass.pt",
    website: "https://www.plastiglass.pt",
    leadTimeDays: 2,
    notes: "Taças de gelado em vidro grosso, copos milkshake 250ml e caixas individuais de presente."
  },
  {
    id: "sup-4",
    name: "Mica & Cera Lab",
    contact: "encomendas@micalab.pt",
    website: "https://www.micalab.pt",
    leadTimeDays: 4,
    notes: "Pigmentos minerais em pó mica, corantes líquidos para cera e chantilly de cera pré-moldado."
  }
];

export const initialIngredients = [
  // Ceras
  {
    id: "ing-1",
    supplierId: "sup-1",
    name: "Cera de Soja Vegetal C-3 (Container)",
    category: "wax",
    purchaseQuantity: 5000, // 5kg
    purchaseUnit: "g",
    purchaseCost: 35.00,
    unitCost: 0.0070, // 35 / 5000 = 0.007 €/g
    currentStock: 4200,
    minStock: 1000
  },
  {
    id: "ing-2",
    supplierId: "sup-1",
    name: "Cera de Coco e Palma (Molda Chantilly)",
    category: "wax",
    purchaseQuantity: 2500, // 2.5kg
    purchaseUnit: "g",
    purchaseCost: 24.50,
    unitCost: 0.0098, // €/g
    currentStock: 1800,
    minStock: 500
  },
  {
    id: "ing-3",
    supplierId: "sup-1",
    name: "Parafina em Gel Transparente (Efeito Calda)",
    category: "wax",
    purchaseQuantity: 1000, // 1kg
    purchaseUnit: "g",
    purchaseCost: 18.00,
    unitCost: 0.0180, // €/g
    currentStock: 850,
    minStock: 200
  },
  // Essências
  {
    id: "ing-4",
    supplierId: "sup-2",
    name: "Essência Premium Morango Silvestre & Natas",
    category: "essence",
    purchaseQuantity: 250, // 250ml
    purchaseUnit: "ml",
    purchaseCost: 22.50,
    unitCost: 0.0900, // €/ml
    currentStock: 140,
    minStock: 50
  },
  {
    id: "ing-5",
    supplierId: "sup-2",
    name: "Essência Baunilha Bourbon Madagascar",
    category: "essence",
    purchaseQuantity: 250,
    purchaseUnit: "ml",
    purchaseCost: 19.80,
    unitCost: 0.0792, // €/ml
    currentStock: 180,
    minStock: 50
  },
  {
    id: "ing-6",
    supplierId: "sup-2",
    name: "Essência Café Torrado & Caramelo Salgado",
    category: "essence",
    purchaseQuantity: 100,
    purchaseUnit: "ml",
    purchaseCost: 11.50,
    unitCost: 0.1150, // €/ml
    currentStock: 65,
    minStock: 25
  },
  // Pavios
  {
    id: "ing-7",
    supplierId: "sup-1",
    name: "Pavio de Madeira Duplo c/ Suporte de Metal",
    category: "wick",
    purchaseQuantity: 50,
    purchaseUnit: "unidade",
    purchaseCost: 12.50,
    unitCost: 0.2500, // €/un
    currentStock: 32,
    minStock: 15
  },
  {
    id: "ing-8",
    supplierId: "sup-1",
    name: "Pavio de Algodão Encerado ECO-6",
    category: "wick",
    purchaseQuantity: 100,
    purchaseUnit: "unidade",
    purchaseCost: 9.00,
    unitCost: 0.0900, // €/un
    currentStock: 85,
    minStock: 20
  },
  // Recipientes
  {
    id: "ing-9",
    supplierId: "sup-3",
    name: "Taça Vintage de Sobremesa Vidro 220ml",
    category: "container",
    purchaseQuantity: 24,
    purchaseUnit: "unidade",
    purchaseCost: 31.20,
    unitCost: 1.3000, // €/un
    currentStock: 18,
    minStock: 10
  },
  {
    id: "ing-10",
    supplierId: "sup-3",
    name: "Copo Alto Milkshake Cristal 300ml",
    category: "container",
    purchaseQuantity: 20,
    purchaseUnit: "unidade",
    purchaseCost: 32.00,
    unitCost: 1.6000, // €/un
    currentStock: 12,
    minStock: 8
  },
  {
    id: "ing-11",
    supplierId: "sup-3",
    name: "Latinha Rosa Pastel Gloss 150ml",
    category: "container",
    purchaseQuantity: 50,
    purchaseUnit: "unidade",
    purchaseCost: 37.50,
    unitCost: 0.7500, // €/un
    currentStock: 40,
    minStock: 15
  },
  // Corantes & Decorações
  {
    id: "ing-12",
    supplierId: "sup-4",
    name: "Decoração Cera Mini-Morangos (Kit 50un)",
    category: "dye_decor",
    purchaseQuantity: 50,
    purchaseUnit: "unidade",
    purchaseCost: 10.00,
    unitCost: 0.2000, // €/un
    currentStock: 42,
    minStock: 10
  },
  {
    id: "ing-13",
    supplierId: "sup-4",
    name: "Corante Rosa Morango Líquido para Cera",
    category: "dye_decor",
    purchaseQuantity: 30, // 30ml
    purchaseUnit: "ml",
    purchaseCost: 6.00,
    unitCost: 0.2000, // €/ml
    currentStock: 22,
    minStock: 5
  },
  // Embalagens
  {
    id: "ing-14",
    supplierId: "sup-3",
    name: "Caixa Transparente de Presente c/ Fita de Cetim",
    category: "packaging",
    purchaseQuantity: 50,
    purchaseUnit: "unidade",
    purchaseCost: 40.00,
    unitCost: 0.8000, // €/un
    currentStock: 35,
    minStock: 15
  },
  {
    id: "ing-15",
    supplierId: "sup-3",
    name: "Rótulo Autocolante de Segurança e Aviso Dolce Candele",
    category: "packaging",
    purchaseQuantity: 200,
    purchaseUnit: "unidade",
    purchaseCost: 20.00,
    unitCost: 0.1000, // €/un
    currentStock: 160,
    minStock: 30
  }
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Vela Milkshake de Morango com Chantilly",
    category: "Velas de Taça / Sobremesa",
    description: "Vela artesanal em copo alto milkshake, base de morango rosa, chantilly cremoso de cera de coco, pavio de madeira e mini morangos decorativos.",
    laborTimeMinutes: 35,
    laborHourlyRate: 12.50,
    overheadPercentage: 10.0,
    targetMarginPercentage: 65.0,
    recipe: [
      { ingredientId: "ing-1", quantity: 150, unit: "g" },    // Cera soja 150g = 1.05€
      { ingredientId: "ing-2", quantity: 50, unit: "g" },     // Cera coco chantilly 50g = 0.49€
      { ingredientId: "ing-4", quantity: 16, unit: "ml" },   // Essência morango 16ml = 1.44€
      { ingredientId: "ing-7", quantity: 1, unit: "unidade" },// Pavio madeira = 0.25€
      { ingredientId: "ing-10", quantity: 1, unit: "unidade" },// Copo milkshake = 1.60€
      { ingredientId: "ing-12", quantity: 2, unit: "unidade" },// 2 mini morangos = 0.40€
      { ingredientId: "ing-13", quantity: 1, unit: "ml" },    // Corante rosa = 0.20€
      { ingredientId: "ing-14", quantity: 1, unit: "unidade" },// Caixa presente = 0.80€
      { ingredientId: "ing-15", quantity: 1, unit: "unidade" } // Rótulo = 0.10€
    ],
    suggestedPrice: 22.50
  },
  {
    id: "prod-2",
    name: "Vela Cappuccino com Caramelo Salgado",
    category: "Velas em Taça",
    description: "Vela em taça vintage de vidro, aroma forte de café torrado e caramelo, topping de espuma e grãos de cera aromáticos.",
    laborTimeMinutes: 25,
    laborHourlyRate: 12.50,
    overheadPercentage: 10.0,
    targetMarginPercentage: 60.0,
    recipe: [
      { ingredientId: "ing-1", quantity: 160, unit: "g" },    // Cera soja = 1.12€
      { ingredientId: "ing-2", quantity: 30, unit: "g" },     // Cera coco = 0.29€
      { ingredientId: "ing-6", quantity: 14, unit: "ml" },   // Essência café = 1.61€
      { ingredientId: "ing-7", quantity: 1, unit: "unidade" },// Pavio madeira = 0.25€
      { ingredientId: "ing-9", quantity: 1, unit: "unidade" }, // Taça vintage = 1.30€
      { ingredientId: "ing-14", quantity: 1, unit: "unidade" },// Caixa = 0.80€
      { ingredientId: "ing-15", quantity: 1, unit: "unidade" } // Rótulo = 0.10€
    ],
    suggestedPrice: 19.90
  },
  {
    id: "prod-3",
    name: "Vela Torta Mousse de Baunilha",
    category: "Velas de Sobremesa",
    description: "Vela na latinha pastel rosa com aroma aconchegante de baunilha bourbon de Madagascar e flocos de micas douradas.",
    laborTimeMinutes: 20,
    laborHourlyRate: 12.50,
    overheadPercentage: 10.0,
    targetMarginPercentage: 55.0,
    recipe: [
      { ingredientId: "ing-1", quantity: 130, unit: "g" },    // Cera soja = 0.91€
      { ingredientId: "ing-5", quantity: 11, unit: "ml" },   // Baunilha = 0.87€
      { ingredientId: "ing-8", quantity: 1, unit: "unidade" },// Pavio algodão = 0.09€
      { ingredientId: "ing-11", quantity: 1, unit: "unidade" },// Latinha rosa = 0.75€
      { ingredientId: "ing-14", quantity: 1, unit: "unidade" },// Caixa = 0.80€
      { ingredientId: "ing-15", quantity: 1, unit: "unidade" } // Rótulo = 0.10€
    ],
    suggestedPrice: 14.50
  }
];

export const initialFixedCosts = [
  { id: "fc-1", name: "Renda / Espaço Dolce Candele", monthlyAmount: 180.00, category: "Espaço & Instalações" },
  { id: "fc-2", name: "Eletricidade & Aquecedores de Cera", monthlyAmount: 45.00, category: "Energia & Luz" },
  { id: "fc-3", name: "Domínio, Loja Online & Software", monthlyAmount: 25.00, category: "Tecnologia & Web" },
  { id: "fc-4", name: "Marketing Instagram & Anúncios Meta", monthlyAmount: 50.00, category: "Divulgação" }
];

export const initialSales = [
  {
    id: "sale-1",
    orderNumber: 1001,
    customerName: "Mariana Silva",
    salesChannel: "instagram", // instagram, feiras, loja_online, encomenda_personalizada
    paymentMethod: "mbway",   // mbway, stripe, cartao, numerario, transferencia
    grossAmount: 45.00,
    platformFee: 0.00,        // MBWay direto
    netAmount: 45.00,
    status: "entregue",
    saleDate: "2026-09-01T14:30:00Z",
    items: [
      { productId: "prod-1", quantity: 2, unitPrice: 22.50, subtotal: 45.00 }
    ],
    notes: "Encomenda via DM do Instagram. Entregue em mão no Porto."
  },
  {
    id: "sale-2",
    orderNumber: 1002,
    customerName: "Beatriz Ribeiro",
    salesChannel: "loja_online",
    paymentMethod: "stripe",
    grossAmount: 39.80,
    platformFee: 1.45,        // Taxa Stripe ~3.6%
    netAmount: 38.35,
    status: "pronto",
    saleDate: "2026-09-03T11:15:00Z",
    items: [
      { productId: "prod-2", quantity: 2, unitPrice: 19.90, subtotal: 39.80 }
    ],
    notes: "Encomenda no site. Pronto para envio CTT Expresso."
  },
  {
    id: "sale-3",
    orderNumber: 1003,
    customerName: "Sofia Santos",
    salesChannel: "feiras",
    paymentMethod: "cartao",
    grossAmount: 56.90,
    platformFee: 0.85,
    netAmount: 56.05,
    status: "entregue",
    saleDate: "2026-09-04T17:40:00Z",
    items: [
      { productId: "prod-1", quantity: 1, unitPrice: 22.50, subtotal: 22.50 },
      { productId: "prod-2", quantity: 1, unitPrice: 19.90, subtotal: 19.90 },
      { productId: "prod-3", quantity: 1, unitPrice: 14.50, subtotal: 14.50 }
    ],
    notes: "Venda na Feira Artesanal de Sábado."
  },
  {
    id: "sale-4",
    orderNumber: 1004,
    customerName: "Inês Alpoim",
    salesChannel: "encomenda_personalizada",
    paymentMethod: "mbway",
    grossAmount: 67.50,
    platformFee: 0.00,
    netAmount: 67.50,
    status: "em_producao",
    saleDate: "2026-09-05T10:00:00Z",
    items: [
      { productId: "prod-1", quantity: 3, unitPrice: 22.50, subtotal: 67.50 }
    ],
    notes: "Lembranças de aniversário personalizadas."
  }
];

export const initialExpenses = [
  {
    id: "exp-1",
    description: "Reabastecimento Cera de Soja (5kg)",
    category: "matérias_primas",
    amount: 35.00,
    expenseDate: "2026-08-25"
  },
  {
    id: "exp-2",
    description: "Termómetro Laser Infravemelho & Aquecedor Térmico",
    category: "equipamento",
    amount: 42.90,
    expenseDate: "2026-08-28"
  },
  {
    id: "exp-3",
    description: "Anúncios Instagram (Promoção Coleção Outono)",
    category: "marketing",
    amount: 30.00,
    expenseDate: "2026-09-01"
  },
  {
    id: "exp-4",
    description: "Lote 50 Taças Vintage de Sobremesa",
    category: "embalagens",
    amount: 65.00,
    expenseDate: "2026-09-02"
  }
];
