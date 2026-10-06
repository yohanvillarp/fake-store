import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

// Automatically load .env.local or .env if DATABASE_URL is not set in environment
if (!process.env.DATABASE_URL && !process.env.PGHOST) {
  const envLocalPath = path.resolve(import.meta.dirname, '../.env.local')
  const envPath = path.resolve(import.meta.dirname, '../.env')
  const targetPath = fs.existsSync(envLocalPath) ? envLocalPath : fs.existsSync(envPath) ? envPath : null
  if (targetPath && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(targetPath)
  }
}

async function initDb() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString && !process.env.PGHOST) {
    console.log('[DB Init] No DATABASE_URL or PGHOST provided. Please set DATABASE_URL in .env')
    console.log('[DB Init] Example: DATABASE_URL=postgresql://user:pass@host:5432/dbname')
    process.exit(0)
  }

  const clientConfig = connectionString
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

  console.log('[DB Init] Connecting to PostgreSQL database...')
  const client = new Client(clientConfig)

  try {
    await client.connect()
    console.log('[DB Init] Connected successfully.')

    const schemaPath = path.resolve(import.meta.dirname, '../database/schema.sql')
    const seedPath = path.resolve(import.meta.dirname, '../database/seed.sql')

    console.log('[DB Init] Executing schema.sql...')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    await client.query(schemaSql)
    console.log('[DB Init] Schema created successfully.')

    console.log('[DB Init] Executing seed.sql...')
    const seedSql = fs.readFileSync(seedPath, 'utf8')
    await client.query(seedSql)
    console.log('[DB Init] Products seeded successfully.')

    console.log('[DB Init] Fake Store database is ready for OLTP transactions!')
  } catch (err) {
    console.error('[DB Init] Error initializing database:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initDb()
