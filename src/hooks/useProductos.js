import { useCallback, useEffect, useState } from 'react';
import { getBooks } from '../api/services/productsService.js';

export function useProductos(fallback = []) {
  const [books, setBooks] = useState(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks(params);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : data?.items || [];
      setBooks(items);
      return items;
    } catch (err) {
      setError(err.message);
      setBooks(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [fallback]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { books, setBooks, loading, error, reload };
}

export default useProductos;
