import { CartProvider } from '@/entities/cart'
import { AppRouter } from '@/app/providers'

export const App = () => {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  )
}
