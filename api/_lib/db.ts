import pg from 'pg'
import type { ProductRecord } from './types.js'

const { Pool } = pg

declare global {
  // eslint-disable-next-line no-var
  var __postgres_pool__: pg.Pool | undefined
  // eslint-disable-next-line no-var
  var __mock_products_db__: ProductRecord[] | undefined
  // eslint-disable-next-line no-var
  var __mock_orders_db__: any[] | undefined
}

export const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    product_id: '1e9e8ef04dbcff4541ed26657ea517e5',
    display_name: 'Pixel Desk Lamp',
    category_name: 'furniture_decor',
    price: 59.90,
    stock: 15,
    weight_g: 450,
    length_cm: 20,
    height_cm: 30,
    width_cm: 15,
    source: 'olist',
  },
  {
    product_id: 'a4597b830d1f855d045d949b29e06180',
    display_name: 'Minimalist Ceramic Mug',
    category_name: 'housewares',
    price: 34.50,
    stock: 24,
    weight_g: 320,
    length_cm: 12,
    height_cm: 10,
    width_cm: 10,
    source: 'olist',
  },
  {
    product_id: '368c6c730842d78016ad823897a372db',
    display_name: 'Retro Mechanical Keyboard',
    category_name: 'computers_accessories',
    price: 289.00,
    stock: 8,
    weight_g: 950,
    length_cm: 35,
    height_cm: 4,
    width_cm: 14,
    source: 'olist',
  },
  {
    product_id: 'e0d64dc22b6482d0430d9716b1464877',
    display_name: 'Cozy Cotton Bed Sheets',
    category_name: 'bed_bath_table',
    price: 119.90,
    stock: 12,
    weight_g: 1200,
    length_cm: 30,
    height_cm: 8,
    width_cm: 25,
    source: 'olist',
  },
  {
    product_id: '53b36df63ebb7c41585e8d54d6772e08',
    display_name: 'Vintage Leather Backpack',
    category_name: 'luggage_accessories',
    price: 199.90,
    stock: 7,
    weight_g: 850,
    length_cm: 40,
    height_cm: 15,
    width_cm: 30,
    source: 'olist',
  },
  {
    product_id: '87285b34884572b646c7b8e364c1b070',
    display_name: 'Smart Audio Earbuds',
    category_name: 'telephony',
    price: 149.00,
    stock: 19,
    weight_g: 180,
    length_cm: 10,
    height_cm: 4,
    width_cm: 8,
    source: 'olist',
  },
  {
    product_id: 'b532349141c7b339dd82a04e5ec67d79',
    display_name: 'Canvas Wall Art Print',
    category_name: 'art',
    price: 79.90,
    stock: 10,
    weight_g: 500,
    length_cm: 50,
    height_cm: 2,
    width_cm: 40,
    source: 'olist',
  },
  {
    product_id: '4244733e06e7ecb49c540845c447469f',
    display_name: 'Analog Precision Watch',
    category_name: 'watches_gifts',
    price: 320.00,
    stock: 5,
    weight_g: 220,
    length_cm: 12,
    height_cm: 6,
    width_cm: 10,
    source: 'olist',
  },
]

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.PGHOST)
}

export function getDbPool(): pg.Pool | null {
  if (!isDbConfigured()) {
    return null
  }

  if (global.__postgres_pool__) {
    return global.__postgres_pool__
  }

  const connectionString = process.env.DATABASE_URL

  const poolConfig: pg.PoolConfig = connectionString
    ? {
        connectionString,
        ssl:
          process.env.PGSSLMODE === 'disable' || connectionString.includes('localhost')
            ? false
            : { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'fake_store',
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      }

  const pool = new Pool({
    ...poolConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  global.__postgres_pool__ = pool
  return pool
}

// Ensure database tables exist automatically if connected to PostgreSQL
let hasAutoBootstrapped = false

export async function ensureDbBootstrapped(pool: pg.Pool) {
  if (hasAutoBootstrapped) return

  try {
    await pool.query(`
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

      CREATE TABLE IF NOT EXISTS fake_store_payments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL REFERENCES fake_store_orders(order_id) ON DELETE CASCADE,
        payment_sequential INTEGER NOT NULL DEFAULT 1,
        payment_type VARCHAR(32) NOT NULL,
        payment_installments INTEGER NOT NULL DEFAULT 1 CHECK (payment_installments >= 1),
        payment_value NUMERIC(10, 2) NOT NULL CHECK (payment_value >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (order_id, payment_sequential)
      );
    `)

    // Check if products exist, otherwise seed
    const checkRes = await pool.query('SELECT COUNT(*)::int AS count FROM fake_store_products')
    if (checkRes.rows[0]?.count === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await pool.query(
          `INSERT INTO fake_store_products (
            product_id, display_name, category_name, price, stock, weight_g, length_cm, height_cm, width_cm, source
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (product_id) DO NOTHING`,
          [
            p.product_id,
            p.display_name,
            p.category_name,
            p.price,
            p.stock,
            p.weight_g,
            p.length_cm,
            p.height_cm,
            p.width_cm,
            p.source,
          ],
        )
      }
    }

    hasAutoBootstrapped = true
  } catch (err) {
    console.error('[DB Bootstrap Error]:', err)
  }
}

// In-Memory Database for local development when DATABASE_URL is not set
export function getMockDb(): { products: ProductRecord[]; orders: any[] } {
  if (!global.__mock_products_db__) {
    global.__mock_products_db__ = JSON.parse(JSON.stringify(INITIAL_PRODUCTS))
  }
  if (!global.__mock_orders_db__) {
    global.__mock_orders_db__ = []
  }
  return {
    products: global.__mock_products_db__!,
    orders: global.__mock_orders_db__!,
  }
}

