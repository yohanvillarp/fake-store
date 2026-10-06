export interface ApiProduct {
  product_id: string
  display_name: string
  category_name: string
  price: number
  stock: number
  weight_g: number
  length_cm: number
  height_cm: number
  width_cm: number
  source: string
}

export interface ApiCustomer {
  customer_id?: string
  first_name: string
  last_name: string
  email: string
  country?: string
  state: string
  city: string
  zip_code: string
}

export interface ApiOrderItem {
  id?: number
  order_id?: string
  order_item_id?: number
  product_id: string
  display_name?: string
  category_name?: string
  quantity: number
  unit_price?: number
  freight_value?: number
}

export interface ApiPayment {
  payment_sequential?: number
  payment_type: string
  payment_installments?: number
  payment_value?: number
}

export interface ApiOrderSummary {
  order_id: string
  order_code: string
  order_status: string
  order_purchase_timestamp: string
  freight_value: number
  subtotal: number
  total: number
  source: string
  customer_name: string
  city: string
  state: string
  items_count: number
  total_units: number
  payment_type: string
}

export interface ApiOrderDetail {
  order_id: string
  order_code: string
  customer_id: string
  order_status: string
  order_purchase_timestamp: string
  order_approved_at: string
  freight_value: number
  subtotal: number
  total: number
  source: string
  customer: ApiCustomer
  items: ApiOrderItem[]
  payments: ApiPayment[]
}

export interface CreateOrderPayload {
  customer: ApiCustomer
  items: { product_id: string; quantity: number }[]
  payment: {
    payment_type: string
    payment_installments?: number
  }
}

async function parseJsonResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    if (!res.ok) {
      throw new Error(`Error en servidor (${res.status} ${res.statusText})`)
    }
    throw new Error(`Respuesta no válida del servidor (esperado JSON, recibido ${contentType || 'HTML'}).`)
  }
  return res.json()
}

export const api = {
  async getProducts(): Promise<ApiProduct[]> {
    const res = await fetch('/api/products')
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch products')
    }
    return data.products
  },

  async getProduct(productId: string): Promise<ApiProduct> {
    const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`)
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch product')
    }
    return data.product
  },

  async getOrders(): Promise<ApiOrderSummary[]> {
    const res = await fetch('/api/orders')
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch orders')
    }
    return data.orders
  },

  async getOrder(orderId: string): Promise<ApiOrderDetail> {
    const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`)
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch order')
    }
    return data.order
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: ApiOrderDetail }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create order transaction')
    }
    return data
  },

  async getHealth(): Promise<{ status: string; database: string }> {
    const res = await fetch('/api/health')
    return parseJsonResponse(res)
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirm: true }),
    })
    const data = await parseJsonResponse(res)
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to reset demo')
    }
    return data
  },
}

