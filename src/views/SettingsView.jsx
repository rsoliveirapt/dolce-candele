import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Database,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Check,
  FileCode,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const SettingsView = () => {
  const { resetToDemoData, exportDataJSON, importDataJSON } = useApp();
  const [copiedSql, setCopiedSql] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const sqlSchemaString = `-- ========================================================
-- SCHEMA SQL SUPABASE / POSTGRESQL - DOLCE CANDELE
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FORNECEDORES
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(100),
    website VARCHAR(255),
    lead_time_days INT DEFAULT 3,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSUMOS / MATÉRIAS-PRIMAS
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('wax', 'essence', 'wick', 'container', 'dye_decor', 'packaging')),
    purchase_quantity NUMERIC(10,2) NOT NULL,
    purchase_unit VARCHAR(20) NOT NULL,
    purchase_cost NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(10,4) NOT NULL,
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    min_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUTOS FINAIS (VELAS DE SOBREMESA)
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

-- 4. FICHAS TÉCNICAS / RECEITAS
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CUSTOS FIXOS MENSAIS
CREATE TABLE IF NOT EXISTS fixed_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    monthly_amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Operacional'
);

-- 6. VENDAS E PEDIDOS
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

-- 8. DESPESAS OPERACIONAIS
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('matérias_primas', 'equipamento', 'marketing', 'embalagens', 'operacional')),
    amount NUMERIC(10,2) NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE
);

-- TRIGGER DE BAIXA DE STOCK AUTOMÁTICA EM SUPABASE
CREATE OR REPLACE FUNCTION deduct_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
    recipe_row RECORD;
BEGIN
    FOR item IN SELECT product_id, quantity FROM sale_items WHERE sale_id = NEW.id LOOP
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
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaString);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSqlFile = () => {
    const blob = new Blob([sqlSchemaString], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dolce_candele_supabase_schema.sql';
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const success = importDataJSON(json);
        if (success) {
          setImportStatus('✅ Dados importados com sucesso!');
        } else {
          setImportStatus('❌ Erro na estrutura do ficheiro de backup.');
        }
      } catch (err) {
        setImportStatus('❌ Formato JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-200/60 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" /> Definições & Base de Dados Supabase
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Configuração & Integração de Dados ⚙️
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Exporte cópias de segurança em JSON, restaure dados originais ou copie o esquema relacional completo SQL para o Supabase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Backup & Restore Panel */}
        <div className="p-6 rounded-3xl glass-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-600" />
              Gestão de Cópias de Segurança (Backup)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Guarde os seus dados locais em ficheiro JSON ou restaure informações anteriores.
            </p>
          </div>

          <div className="space-y-3">
            {/* Export JSON Button */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Exportar Backup Completo (JSON)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Descarrega fornecedores, matérias-primas, receitas e vendas.
                </p>
              </div>

              <button
                onClick={exportDataJSON}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-900 text-white hover:bg-amber-950 flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" /> Exportar JSON
              </button>
            </div>

            {/* Import JSON Button */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Restaurar Ficheiro JSON
                </h4>
                <p className="text-[11px] text-stone-500">
                  Carregue um ficheiro de backup anteriormente guardado.
                </p>
              </div>

              <label className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer shadow-xs">
                <Upload className="w-4 h-4" /> Importar JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 p-2 text-center">
                {importStatus}
              </p>
            )}

            {/* Reset to Demo Data */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  if (window.confirm('Tem a certeza que deseja restaurar os dados de demonstração da Dolce Candele?')) {
                    resetToDemoData();
                    window.location.reload();
                  }
                }}
                className="w-full py-3 text-xs font-bold rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-stone-400" /> Restaurar Dados de Demonstração Dolce Candele
              </button>
            </div>

          </div>
        </div>

        {/* Supabase PostgreSQL Schema Panel */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-600" />
                Esquema SQL Supabase (PostgreSQL)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Modelo de dados relacional pronto para implementar na cloud.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopySql}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                title="Copiar Código SQL"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownloadSqlFile}
                className="p-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200 transition-colors"
                title="Descarregar schema.sql"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-2xl bg-stone-900 text-amber-100 font-mono text-[11px] h-96 overflow-y-auto leading-relaxed border border-stone-800">
              {sqlSchemaString}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
