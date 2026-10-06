# 🛍️ Fake Store

<p align="center">
  <img src="/public/favicon.svg" alt="Fake Store Logo" width="64" height="64" />
</p>

<p align="center">
  <strong>Una tienda online simulada desarrollada para diversos usos y proyectos técnicos.</strong>
</p>

<p align="center">
  <a href="https://github.com/yohanvillarp/fake-store"><img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github" alt="GitHub Repo" /></a>
  <a href="https://github.com/yohanvillarp/fake-store/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/PostgreSQL-ACID-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel" alt="Vercel" />
</p>

---

## 🎯 ¿Para qué puedes usar este proyecto?

**Fake Store** es una tienda online simulada que puede utilizarse para diferentes usos.
---

## 🏛️ Arquitectura del Sistema

```text
                       FAKE STORE
             React 19 + TypeScript (FSD 2.1)
                           │
                           │ POST /api/orders
                           ▼
                   VERCEL SERVERLESS
             Transacciones SQL Atómicas (ACID)
                           │
                           ▼
                 PostgreSQL (Neon / Supabase)
            ┌──────────────┬──────────────┬─────────────┐
            │    Orders    │    Items     │  Payments   │
            └──────────────┴──────────────┴─────────────┘
                           │
                           ▼
                        Power BI ◄────── Olist CSV (Histórico)
                   (Analítica OLAP)
```

---

## 🚀 Inicio Rápido (Local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/yohanvillarp/fake-store.git
cd fake-store
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Opcional)
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
> **Nota:** Si dejas `DATABASE_URL` sin configurar, la tienda funcionará en modo **Mock In-Memory** local sin requerir ninguna base de datos instalada.

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```
Abre en tu navegador: `http://localhost:5173`.

---

## 🗄️ Base de Datos y Scripts

Para inicializar las tablas y productos iniciales en tu PostgreSQL:

```bash
# Ejecuta las migraciones y seed inicial
npm run db:init
```

Archivos SQL disponibles:
- `database/schema.sql`: Definición de tablas (`fake_store_products`, `fake_store_customers`, `fake_store_orders`, `fake_store_order_items`, `fake_store_payments`).
- `database/seed.sql`: Carga inicial de productos con dimensiones y categorías de Olist.

---

## ☁️ Despliegue en Producción (Vercel + Neon)

1. **Base de Datos (Neon):**
   - Crea un proyecto gratuito en [Neon](https://neon.tech).
   - Copia tu cadena de conexión `DATABASE_URL` (con pooling habilitado).
2. **Frontend & Serverless Functions (Vercel):**
   - Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
   - En **Settings ➔ Environment Variables**, añade la variable `DATABASE_URL`.
   - Vercel detectará la configuración automáticamente mediante `vercel.json` y compilará la aplicación.
3. **Dominio personalizado:**
   - En Vercel, ve a **Settings ➔ Domains** y vincula tu propio dominio con SSL automático gratuito.

---

## 📁 Estructura del Código (Feature-Sliced Design 2.1)

```text
src/
├── app/        # Configuración global, providers y estilos (Tailwind v4)
├── pages/      # Vistas completas (Home, Shop, ProductDetail, Cart, Checkout, Orders)
├── widgets/    # Bloques autónomos reutilizables (Header, Footer, CartDrawer)
├── features/   # Acciones de negocio (add-to-cart, filter-by-category, reset-demo)
├── entities/   # Modelos de dominio y tarjetas (product, cart, order)
└── shared/     # Componentes UI atómicos, clientes API, utilidades y tipos
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles. Puedes utilizarlo libremente para fines educativos, demostraciones, portafolios o proyectos personales.

---

<p align="center">
  Creado con ❤️ por <a href="https://github.com/yohanvillarp"><strong>yohanvillarp</strong></a>
</p>
