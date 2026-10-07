-- ================================================================
-- DOLCE CANDELE — Schema MySQL para phpMyAdmin / cPanel
-- Cole este script inteiro no separador SQL do phpMyAdmin.
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── 1. FORNECEDORES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `suppliers` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`           VARCHAR(255) NOT NULL,
    `contact`        VARCHAR(100) DEFAULT NULL,
    `website`        VARCHAR(255) DEFAULT NULL,
    `lead_time_days` INT          DEFAULT 3,
    `notes`          TEXT         DEFAULT NULL,
    `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. INSUMOS / MATÉRIAS-PRIMAS ───────────────────────────────
CREATE TABLE IF NOT EXISTS `ingredients` (
    `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `supplier_id`       INT UNSIGNED DEFAULT NULL,
    `name`              VARCHAR(255) NOT NULL,
    `category`          ENUM('wax','essence','wick','container','dye_decor','packaging') DEFAULT NULL,
    `purchase_quantity` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `purchase_unit`     VARCHAR(20)   NOT NULL DEFAULT 'g',
    `purchase_cost`     DECIMAL(10,2) NOT NULL DEFAULT 0,
    `unit_cost`         DECIMAL(10,4) NOT NULL DEFAULT 0,
    `current_stock`     DECIMAL(10,2) NOT NULL DEFAULT 0,
    `min_stock`         DECIMAL(10,2) NOT NULL DEFAULT 0,
    `created_at`        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. PRODUTOS FINAIS (VELAS) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
    `id`                       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`                     VARCHAR(255) NOT NULL,
    `category`                 VARCHAR(100) DEFAULT 'Velas de Sobremesa',
    `description`              TEXT         DEFAULT NULL,
    `labor_time_minutes`       INT          DEFAULT 30,
    `labor_hourly_rate`        DECIMAL(10,2) DEFAULT 12.50,
    `overhead_percentage`      DECIMAL(5,2)  DEFAULT 10.00,
    `target_margin_percentage` DECIMAL(5,2)  DEFAULT 60.00,
    `total_cost`               DECIMAL(10,2) DEFAULT 0.00,
    `min_price`                DECIMAL(10,2) DEFAULT 0.00,
    `suggested_price`          DECIMAL(10,2) DEFAULT 0.00,
    `created_at`               DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. RECEITAS (ingredientes por produto) ──────────────────────
CREATE TABLE IF NOT EXISTS `recipes` (
    `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id`    INT UNSIGNED NOT NULL,
    `ingredient_id` INT UNSIGNED NOT NULL,
    `quantity`      DECIMAL(10,2) NOT NULL,
    `unit`          VARCHAR(20)   NOT NULL,
    `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`)    REFERENCES `products`(`id`)     ON DELETE CASCADE,
    FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. CUSTOS FIXOS MENSAIS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `fixed_costs` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`           VARCHAR(255) NOT NULL,
    `monthly_amount` DECIMAL(10,2) NOT NULL,
    `category`       VARCHAR(100) DEFAULT 'Operacional',
    `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. VENDAS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sales` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_number`   INT UNSIGNED,
    `customer_name`  VARCHAR(255) DEFAULT NULL,
    `sales_channel`  ENUM('instagram','feiras','loja_online','encomenda_personalizada') DEFAULT NULL,
    `payment_method` ENUM('mbway','stripe','cartao','numerario','transferencia') DEFAULT NULL,
    `gross_amount`   DECIMAL(10,2) NOT NULL DEFAULT 0,
    `platform_fee`   DECIMAL(10,2) NOT NULL DEFAULT 0,
    `net_amount`     DECIMAL(10,2) NOT NULL DEFAULT 0,
    `status`         ENUM('em_producao','pronto','entregue','cancelado') DEFAULT 'em_producao',
    `sale_date`      DATETIME DEFAULT CURRENT_TIMESTAMP,
    `notes`          TEXT DEFAULT NULL,
    `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auto-increment order_number via trigger
DROP TRIGGER IF EXISTS `set_order_number`;
CREATE TRIGGER `set_order_number`
BEFORE INSERT ON `sales`
FOR EACH ROW
SET NEW.order_number = (SELECT IFNULL(MAX(order_number), 1000) + 1 FROM `sales`);


-- ─── 7. ITENS DA VENDA ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sale_items` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id`    INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `quantity`   INT          NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `subtotal`   DECIMAL(10,2) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sale_id`)    REFERENCES `sales`(`id`)    ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. DESPESAS OPERACIONAIS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `expenses` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `description`  VARCHAR(255) NOT NULL,
    `category`     ENUM('matérias_primas','equipamento','marketing','embalagens','operacional') DEFAULT NULL,
    `amount`       DECIMAL(10,2) NOT NULL,
    `expense_date` DATE    DEFAULT (CURRENT_DATE),
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
