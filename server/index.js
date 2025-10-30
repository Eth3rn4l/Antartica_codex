import express from 'express';
import cors from 'cors';
import { initDb, getPool, hashPassword } from './database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Inicializar DB al arrancar (asegura tablas y seeds)
await initDb();

// Middleware de autenticación
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to require admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, email, password, role, nombre, apellido FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const hashed = hashPassword(password);
    if (user.password !== hashed) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, nombre: user.nombre }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role, nombre: user.nombre } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { nombre, apellido, email, password, telefono, region, comuna, rut } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const pool = await getPool();
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists && exists.length > 0) return res.status(400).json({ error: 'User exists' });
    const hashed = hashPassword(password);
    await pool.query('INSERT INTO users (nombre, apellido, email, password, telefono, region, comuna, rut, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre || '', apellido || '', email, hashed, telefono || '', region || '', comuna || '', rut || '', 'client']);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Books endpoints
app.get('/api/books', async (req, res) => {
  try {
    const pool = await getPool();
    // soporta paginación opcional: ?page=1&limit=20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // default grande para compatibilidad
    const offset = (page - 1) * limit;
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM books');
    const [rows] = await pool.query('SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
    return res.json({ items: rows, total, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/books', authMiddleware, requireAdmin, async (req, res) => {
  const { title, author, price, image, description, stock } = req.body;
  try {
    const pool = await getPool();
    await pool.query('INSERT INTO books (title, author, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)', [title, author, price || 0, image || '', description || '', stock || 0]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/books/:id', authMiddleware, requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await getPool();
    // Obtener libro actual
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    const current = rows[0];
    // Usar valores proporcionados o mantener los actuales
    const title = req.body.title ?? current.title;
    const author = req.body.author ?? current.author;
    const price = (req.body.price !== undefined) ? req.body.price : current.price;
    const image = req.body.image ?? current.image;
    const description = req.body.description ?? current.description;
    const stock = (req.body.stock !== undefined) ? req.body.stock : current.stock;
    await pool.query('UPDATE books SET title=?, author=?, price=?, image=?, description=?, stock=? WHERE id=?', [title, author, price || 0, image || '', description || '', stock || 0, id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/books/:id', authMiddleware, requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Users endpoints (admin)
app.get('/api/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const pool = await getPool();
    // paginación opcional y filtrado por role (ej: ?role=client)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const offset = (page - 1) * limit;
    const roleFilter = req.query.role;

    // total con posible filtro
    let totalSql = 'SELECT COUNT(*) as total FROM users';
    const totalParams = [];
    if (roleFilter) {
      totalSql += ' WHERE role = ?';
      totalParams.push(roleFilter);
    }
    const [[{ total }]] = await pool.query(totalSql, totalParams);

    // rows con posible filtro; ordenar admins al principio por compatibilidad
    let rowsSql = "SELECT id, nombre, apellido, email, telefono, region, comuna, rut, role, created_at FROM users";
    const rowsParams = [];
    if (roleFilter) {
      rowsSql += ' WHERE role = ?';
      rowsParams.push(roleFilter);
    }
  rowsSql += " ORDER BY FIELD(role, 'admin') DESC, id DESC LIMIT ? OFFSET ?";
  rowsParams.push(limit, offset);
  // debug: log SQL and params when roleFilter used
  if (roleFilter) console.log('SQL users list:', rowsSql, 'params:', rowsParams);
  const [rows] = await pool.query(rowsSql, rowsParams);
    return res.json({ items: rows, total, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await getPool();
    // comprobar rol del usuario a borrar
    const [rows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const userToDelete = rows[0];
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Cart endpoints
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT ci.id, ci.book_id, ci.quantity, b.title, b.price, b.image FROM cart_items ci LEFT JOIN books b ON ci.book_id = b.id WHERE ci.user_id = ?',
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { book_id, quantity } = req.body;
  if (!book_id) return res.status(400).json({ error: 'Missing book_id' });
  try {
    const pool = await getPool();
    // check stock
    const [bk] = await pool.query('SELECT stock FROM books WHERE id = ?', [book_id]);
    if (!bk || bk.length === 0) return res.status(404).json({ error: 'Book not found' });
    if (bk[0].stock <= 0) return res.status(400).json({ error: 'Out of stock' });
    await pool.query('INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?)', [req.user.id, book_id, quantity || 1]);
    // reduce stock
    await pool.query('UPDATE books SET stock = stock - ? WHERE id = ?', [quantity || 1, book_id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT book_id, quantity FROM cart_items WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const item = rows[0];
    await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
    // restore stock
    await pool.query('UPDATE books SET stock = stock + ? WHERE id = ?', [item.quantity, item.book_id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
