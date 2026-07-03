import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'

const CART_STORAGE_KEY = 'luxe-cart'

const readStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(readStoredCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id === product.id)

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentCart, { ...product, quantity }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const value = useMemo(() => {
    const totalProducts = cart.reduce((total, product) => total + product.quantity, 0)
    const subtotal = cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )

    return {
      cart,
      totalProducts,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }
  }, [cart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
