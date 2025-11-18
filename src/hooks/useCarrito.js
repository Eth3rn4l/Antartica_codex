import { useCallback, useEffect, useState } from 'react';
import { addToCart, checkoutCart, fetchCart, removeFromCart } from '../api/services/cartService.js';

function dispatchCartChanged() {
  try {
    window.dispatchEvent(new Event('cartChanged'));
  } catch {
    /* noop */
  }
}

export function useCarrito() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const getToken = useCallback(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setItems([]);
      return [];
    }
    setLoading(true);
    try {
      const data = await fetchCart(token);
      const list = Array.isArray(data) ? data : [];
      setItems(list);
      return list;
    } catch {
      setItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleExternalChange = () => { refresh(); };
    window.addEventListener('cartChanged', handleExternalChange);
    window.addEventListener('storage', handleExternalChange);
    return () => {
      window.removeEventListener('cartChanged', handleExternalChange);
      window.removeEventListener('storage', handleExternalChange);
    };
  }, [refresh]);

  const addItem = useCallback(async (book, quantity = 1) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    await addToCart(book.id, quantity, token);
    await refresh();
    dispatchCartChanged();
  }, [refresh, getToken]);

  const removeItem = useCallback(async (cartItemId) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    await removeFromCart(cartItemId, token);
    await refresh();
    dispatchCartChanged();
  }, [refresh, getToken]);

  const checkout = useCallback(async () => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    await checkoutCart(token);
    const refreshed = await refresh();
    dispatchCartChanged();
    if (!refreshed.length) {
      alert('Compra Hecha!');
    }
  }, [refresh, getToken]);

  return { items, loading, refresh, addItem, removeItem, checkout, setItems };
}

export default useCarrito;
