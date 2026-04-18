import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'user') {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await cartAPI.get();
      setCart(data);
    } catch (e) {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId, quantity = 1) => {
    const data = await cartAPI.add(productId, quantity);
    setCart(data);
    return data;
  };
  const updateItem = async (productId, quantity) => {
    const data = await cartAPI.update(productId, quantity);
    setCart(data);
    return data;
  };
  const removeItem = async (productId) => {
    const data = await cartAPI.remove(productId);
    setCart(data);
    return data;
  };
  const clear = async () => {
    await cartAPI.clear();
    setCart({ items: [] });
  };

  const itemCount = (cart.items || []).reduce((s, i) => s + (i.quantity || 0), 0);
  const subtotal = (cart.items || []).reduce(
    (s, i) => s + (i.product?.price || 0) * (i.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, subtotal, refresh, addItem, updateItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}
