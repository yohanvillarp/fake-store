export type OrderStatus =
  | 'created'
  | 'approved'
  | 'invoiced'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'canceled'
  | 'unavailable'

export type PaymentType =
  | 'credit_card'
  | 'boleto'
  | 'voucher'
  | 'debit_card'

export interface ProductRecord {
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
  created_at?: string
  updated_at?: string
}

export interface CustomerInput {
  customer_id?: string
  first_name: string
  last_name: string
  email: string
  country?: string
  state: string
  city: string
  zip_code: string
}

export interface OrderItemInput {
  product_id: string
  quantity: number
}

export interface PaymentInput {
  payment_type: PaymentType
  payment_installments?: number
}

export interface CreateOrderPayload {
  customer: CustomerInput
  items: OrderItemInput[]
  payment: PaymentInput
}

export interface OrderRecord {
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
  created_at?: string
}

export interface OrderItemRecord {
  id?: number
  order_id: string
  order_item_id: number
  product_id: string
  display_name?: string
  category_name?: string
  quantity: number
  unit_price: number
  freight_value: number
  created_at?: string
}

export interface PaymentRecord {
  id?: number
  order_id: string
  payment_sequential: number
  payment_type: string
  payment_installments: number
  payment_value: number
  created_at?: string
}

export interface CustomerRecord {
  customer_id: string
  first_name: string
  last_name: string
  email: string
  country: string
  state: string
  city: string
  zip_code: string
  source: string
  created_at?: string
}

export interface OrderDetailedRecord extends OrderRecord {
  customer: CustomerRecord
  items: OrderItemRecord[]
  payments: PaymentRecord[]
}
