import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  HomePage,
  ShopPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
} from '@/pages'
import { Header, Footer } from '@/widgets'
import { ToastProvider } from '@/shared/ui'
import { ScrollToTop } from './ScrollToTop'




export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 selection:bg-blue-600 selection:text-white">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}
