import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('aquaguard_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('aquaguard_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast.success(`🛒 ${item.name} added to cart!`)
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
    toast.success(`Removed from cart`)
  }

  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + amount
        return newQ > 0 ? { ...i, quantity: newQ } : i
      }
      return i
    }))
  }

  const clearCart = () => {
    setCart([])
    toast.success(`Cart cleared`)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
