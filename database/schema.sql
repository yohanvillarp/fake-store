-- =============================================================================
-- Fake Store - Academic OLTP Database Schema
-- Compatible with PostgreSQL (Neon, Supabase, RDS, Local)
-- Corresponds conceptually to Brazilian E-Commerce by Olist
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: fake_store_products
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fake_store_products (
    product_id VARCHAR(36) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    weight_g INTEGER DEFAULT 500,
    length_cm INTEGER DEFAULT 20,
    height_cm INTEGER DEFAULT 15,
    width_cm INTEGER DEFAULT 15,
    source VARCHAR(32) NOT NULL DEFAULT 'olist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. Table: fake_store_customers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fake_store_customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Brazil',
    state VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    source VARCHAR(32) NOT NULL DEFAULT 'fake_store',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. Table: fake_store_orders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fake_store_orders (
    order_id VARCHAR(36) PRIMARY KEY,
    order_code VARCHAR(32) UNIQUE NOT NULL,
    customer_id VARCHAR(36) NOT NULL REFERENCES fake_store_customers(customer_id),
    order_status VARCHAR(32) NOT NULL DEFAULT 'completed',
    order_purchase_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    freight_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (freight_value >= 0),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    source VARCHAR(32) NOT NULL DEFAULT 'fake_store',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. Table: fake_store_order_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fake_store_order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES fake_store_orders(order_id) ON DELETE CASCADE,
    order_item_id INTEGER NOT NULL,
    product_id VARCHAR(36) NOT NULL REFERENCES fake_store_products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    freight_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (freight_value >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, order_item_id)
);

-- -----------------------------------------------------------------------------
-- 5. Table: fake_store_payments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fake_store_payments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES fake_store_orders(order_id) ON DELETE CASCADE,
    payment_sequential INTEGER NOT NULL DEFAULT 1,
    payment_type VARCHAR(32) NOT NULL, -- 'credit_card', 'boleto', 'voucher', 'debit_card'
    payment_installments INTEGER NOT NULL DEFAULT 1 CHECK (payment_installments >= 1),
    payment_value NUMERIC(10, 2) NOT NULL CHECK (payment_value >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, payment_sequential)
);

-- -----------------------------------------------------------------------------
-- Performance Indexes for Power BI and Foreign Keys
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_fso_customer_id ON fake_store_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_fso_purchase_timestamp ON fake_store_orders(order_purchase_timestamp);
CREATE INDEX IF NOT EXISTS idx_fsoi_product_id ON fake_store_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_fsp_payment_type ON fake_store_payments(payment_type);

-- -----------------------------------------------------------------------------
-- Power BI Compatibility View
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_fake_store_powerbi_orders AS
SELECT 
    o.order_id,
    o.order_code,
    o.order_status,
    o.order_purchase_timestamp,
    o.order_approved_at,
    o.subtotal,
    o.freight_value,
    o.total,
    o.source,
    c.customer_id,
    c.city AS customer_city,
    c.state AS customer_state,
    c.country AS customer_country,
    COUNT(DISTINCT i.id) AS total_items,
    COALESCE(SUM(i.quantity), 0) AS total_units,
    STRING_AGG(DISTINCT p.payment_type, ', ') AS payment_methods,
    COALESCE(SUM(p.payment_value), 0.00) AS total_paid
FROM fake_store_orders o
JOIN fake_store_customers c ON o.customer_id = c.customer_id
LEFT JOIN fake_store_order_items i ON o.order_id = i.order_id
LEFT JOIN fake_store_payments p ON o.order_id = p.order_id
GROUP BY 
    o.order_id,
    o.order_code,
    o.order_status,
    o.order_purchase_timestamp,
    o.order_approved_at,
    o.subtotal,
    o.freight_value,
    o.total,
    o.source,
    c.customer_id,
    c.city,
    c.state,
    c.country;
