-- ========================================================
-- SCHEMA SQL SUPABASE / POSTGRESQL - DOLCE CANDELE
-- Gestão Operacional, Fichas Técnicas & Dashboard Financeiro
-- ========================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE FORNECEDORES
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(100),
    website VARCHAR(255),
    lead_time_days INT DEFAULT 3,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE MATÉRIAS-PRIMAS / INSUMOS
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('wax', 'essence', 'wick', 'container', 'dye_decor', 'packaging')),
    purchase_quantity NUMERIC(10,2) NOT NULL,
    purchase_unit VARCHAR(20) NOT NULL, -- 'g', 'kg', 'ml', 'L', 'unidade'
    purchase_cost NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(10,4) NOT NULL, -- Custo calculado por g, ml ou unidade
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    min_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE PRODUTOS FINAIS (VELAS DE SOBREMESA)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Velas de Sobremesa',
    description TEXT,
    labor_time_minutes INT DEFAULT 30,
    labor_hourly_rate NUMERIC(10,2) DEFAULT 12.50,
    overhead_percentage NUMERIC(5,2) DEFAULT 10.00,
    target_margin_percentage NUMERIC(5,2) DEFAULT 60.00,
    total_cost NUMERIC(10,2) DEFAULT 0.00,
    min_price NUMERIC(10,2) DEFAULT 0.00,
    suggested_price NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE RECEITAS / FICHAS TÉCNICAS (INGREDIENTES DO PRODUTO)
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE CUSTOS FIXOS MENSAIS (PARA BREAK-EVEN)
CREATE TABLE IF NOT EXISTS fixed_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    monthly_amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Operacional'
);

-- 6. TABELA DE VENDAS E ENCOMENDAS
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL,
    customer_name VARCHAR(255),
    sales_channel VARCHAR(50) CHECK (sales_channel IN ('instagram', 'feiras', 'loja_online', 'encomenda_personalizada')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('mbway', 'stripe', 'cartao', 'numerario', 'transferencia')),
    gross_amount NUMERIC(10,2) NOT NULL,
    platform_fee NUMERIC(10,2) DEFAULT 0.00,
    net_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('em_producao', 'pronto', 'entregue', 'cancelado')),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 7. ITENS DA VENDA
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- 8. REGISTO DE DESPESAS OPERACIONAIS
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('matérias_primas', 'equipamento', 'marketing', 'embalagens', 'operacional')),
    amount NUMERIC(10,2) NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE
);

-- ========================================================
-- TRIGGER DE BAIXA AUTOMÁTICA NO STOCK AO CRIAR VENDA
-- ========================================================
CREATE OR REPLACE FUNCTION deduct_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
    recipe_row RECORD;
BEGIN
    -- Iterar sobre cada produto vendido no pedido
    FOR item IN SELECT product_id, quantity FROM sale_items WHERE sale_id = NEW.id LOOP
        -- Iterar pelos ingredientes da receita do produto
        FOR recipe_row IN SELECT ingredient_id, quantity FROM recipes WHERE product_id = item.product_id LOOP
            UPDATE ingredients
            SET current_stock = GREATEST(0, current_stock - (recipe_row.quantity * item.quantity))
            WHERE id = recipe_row.ingredient_id;
        END LOOP;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_stock_after_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION deduct_stock_on_sale();
