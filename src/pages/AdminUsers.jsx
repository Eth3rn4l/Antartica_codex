import React, { useEffect, useState } from 'react';

export default function AdminUsers() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, l = limit) => {
    try {
      const res = await fetch(`${API_BASE}/api/users?page=${p}&limit=${l}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      // aceptar dos formatos: array (legacy) o { items, total, page, limit }
      let list = [];
      if (Array.isArray(data)) {
        list = data;
        setTotal(data.length || 0);
        setPage(p);
        setLimit(l);
      } else {
        list = data.items || [];
        setTotal(data.total || 0);
        setPage(data.page || p);
        setLimit(data.limit || l);
      }
      // asegurar que los admins siempre vayan arriba (respaldo en frontend)
      list.sort((a, b) => {
        if ((a.role === 'admin') && (b.role !== 'admin')) return -1;
        if ((b.role === 'admin') && (a.role !== 'admin')) return 1;
        return b.id - a.id;
      });
      setUsers(list);
    } catch (e) {
      console.error(e);
      setUsers([]);
      setTotal(0);
    }
  };

  useEffect(() => { load(1, limit); }, []);

  const removeUser = async (id, role) => {
    if (!token) return window.location.href = '/login';
    if (role === 'admin') return alert('No se puede eliminar un usuario con rol admin.');
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error eliminando usuario');
      }
      load(page, limit);
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#194C57' }}>Administrar Usuarios</h2>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Mostrando página {page} — {total} usuarios</div>
          <div>
            <button onClick={() => { if (page > 1) { load(page - 1, limit); } }} style={{ marginRight: 8 }}>Anterior</button>
            <button onClick={() => { if ((page * limit) < total) load(page + 1, limit); }}>Siguiente</button>
          </div>
        </div>
        <ul>
          {users.map(u => (
            <li key={u.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <strong>{u.nombre || '-'}</strong> ({u.email}) — <em>role:</em> {u.role} — <span style={{ color: '#666' }}>ID: {u.id}</span>
              </div>
              {u.role === 'admin' ? (
                <button disabled title="No se puede eliminar usuarios admin" style={{ marginLeft: '0.5rem', backgroundColor: '#ccc', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', color: '#666', cursor: 'not-allowed' }}>Admin</button>
              ) : (
                <button onClick={() => removeUser(u.id, u.role)} style={{ marginLeft: '0.5rem', backgroundColor: '#ff4d4d', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', color: 'white', cursor: 'pointer' }}>Eliminar</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
