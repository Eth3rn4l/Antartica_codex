import { getPool } from './database.js';

async function run() {
  const samples = [
    { id: 1, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', price: 12000, image: '/assets/cienanos.png', description: 'Una novela mágica y realista sobre la familia Buendía.', stock: 10 },
    { id: 2, title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 8000, image: '/assets/principito.png', description: 'Un clásico cuento filosófico sobre la vida y la amistad.', stock: 10 }
  ];
  try {
    const pool = await getPool();
    for (const b of samples) {
      const [rows] = await pool.query('SELECT id FROM books WHERE id = ?', [b.id]);
      if (rows && rows.length > 0) {
        await pool.query('UPDATE books SET title=?, author=?, price=?, image=?, description=?, stock=? WHERE id=?', [b.title, b.author, b.price, b.image, b.description, b.stock, b.id]);
        console.log('Updated book id', b.id);
      } else {
        await pool.query('INSERT INTO books (id, title, author, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?)', [b.id, b.title, b.author, b.price, b.image, b.description, b.stock]);
        console.log('Inserted book id', b.id);
      }
    }
    console.log('Done');
  } catch (e) {
    console.error('Error', e.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
