import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/index.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (!user || !token) {
      setCartItems([]);
      return;
    }
    setCartLoading(true);
    apiFetch('/api/cart')
      .then(({ cart }) => {
        if (cart?.items) {
          setCartItems(cart.items.map(normalizeItem));
        }
      })
      .catch(console.error)
      .finally(() => setCartLoading(false));
  }, [user, token]);

  /** Normalize DB cart item → local shape */
  function normalizeItem(i) {
    const p = i.product || {};
    return {
      _itemId: i._id,
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      badge: p.badge,
      color: i.color || p.color,
      colorName: i.colorName || 'Default',
      size: i.size,
      qty: i.qty,
    };
  }

  const addToCart = useCallback(
    async (product, size = 'US 10') => {
      if (!user) {
        // Guest: local state only
        setCartItems((prev) => {
          const existing = prev.find(
            (i) => i.id === product.id && i.size === size
          );
          if (existing)
            return prev.map((i) =>
              i.id === product.id && i.size === size
                ? { ...i, qty: i.qty + 1 }
                : i
            );
          return [
            ...prev,
            { ...product, _itemId: Date.now().toString(), size, qty: 1 },
          ];
        });
        return;
      }

      try {
        const { cart } = await apiFetch('/api/cart', {
          method: 'POST',
          body: {
            productId: product._id || product.id,
            qty: 1,
            size,
            color: product.color,
            colorName: product.colorName || product.category,
          },
        });
        if (cart?.items) setCartItems(cart.items.map(normalizeItem));
      } catch (err) {
        console.error('Add to cart error:', err);
      }
    },
    [user]
  );

  const updateQty = useCallback(
    async (itemId, qty) => {
      if (!user) {
        setCartItems((prev) =>
          qty < 1
            ? prev.filter((i) => i._itemId !== itemId)
            : prev.map((i) => (i._itemId === itemId ? { ...i, qty } : i))
        );
        return;
      }
      try {
        const { cart } = await apiFetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          body: { qty },
        });
        if (cart?.items) setCartItems(cart.items.map(normalizeItem));
      } catch (err) {
        console.error('Update qty error:', err);
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (itemId) => {
      if (!user) {
        setCartItems((prev) => prev.filter((i) => i._itemId !== itemId));
        return;
      }
      try {
        const { cart } = await apiFetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
        });
        if (cart?.items) setCartItems(cart.items.map(normalizeItem));
      } catch (err) {
        console.error('Remove item error:', err);
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    try {
      await apiFetch('/api/cart', { method: 'DELETE' });
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  }, [user]);

  const cartCount = cartItems.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartLoading, addToCart, updateQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
