import { getPool, hashPassword } from './database.js';

async function run() {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, nombre, email, role, password FROM users');
    console.log('Users:');
    for (const r of rows) {
      console.log(`${r.id}\t${r.email}\t${r.role}\t${r.nombre}\t${r.password}`);
    }
    console.log('Hash of admin123:', hashPassword('admin123'));
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
