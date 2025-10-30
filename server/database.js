import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
import crypto from 'crypto';

// Config por defecto para XAMPP en local
// Nombre de base de datos por defecto solicitado: BDANTARTICA-LOCAL
const DB_NAME = process.env.DB_NAME || 'BDANTARTICA-LOCAL';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: DB_NAME,
};

let pool;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function ensureDatabaseExists() {
  // Crear conexión sin database para crear la base si hace falta
  const tmp = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
  });
  await tmp.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await tmp.end();
}

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

async function initDb() {
  await ensureDatabaseExists();
  const p = await getPool();

  // Crear tablas mínimas
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      nombre VARCHAR(100),
      apellido VARCHAR(100),
      email VARCHAR(150) UNIQUE,
      password VARCHAR(256),
      telefono VARCHAR(30),
      region VARCHAR(100),
      comuna VARCHAR(100),
      rut VARCHAR(30),
      role VARCHAR(20) DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS books (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(200),
      author VARCHAR(200),
      price DECIMAL(10,2) DEFAULT 0,
      image VARCHAR(255),
      description TEXT,
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT,
      book_id INT,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Insertar o actualizar seeds (upsert) para asegurar que existan con las credenciales esperadas
  await p.query(
    `INSERT INTO users (nombre, apellido, email, password, role) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellido=VALUES(apellido), password=VALUES(password), role=VALUES(role)`,
    ['Administrador', '', 'admin@admin.com', hashPassword('admin123'), 'admin']
  );

  await p.query(
    `INSERT INTO users (nombre, apellido, email, password, telefono, region, comuna, rut, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellido=VALUES(apellido), password=VALUES(password), telefono=VALUES(telefono), region=VALUES(region), comuna=VALUES(comuna), rut=VALUES(rut), role=VALUES(role)`,
    ['Cliente', 'Prueba', 'cliente@cliente.com', hashPassword('cliente123'), '+56912345678', 'Metropolitana', 'Santiago', '20.142.499-2', 'client']
  );

  // Insertar algunos libros de ejemplo si no hay ninguno
  const [books] = await p.query('SELECT id FROM books LIMIT 1');
  if (books.length === 0) {
    const sample = [
      ['Cien Años de Soledad', 'Gabriel García Márquez', 12000, '/assets/cienanos.png', 'Una novela mágica y realista sobre la familia Buendía.', 10],
      ['El Principito', 'Antoine de Saint-Exupéry', 8000, '/assets/principito.png', 'Un clásico cuento filosófico sobre la vida y la amistad.', 10],
    ];
    for (const b of sample) {
      await p.query(`INSERT INTO books (title, author, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)` , b);
    }
  }

  return { success: true };
}

export { initDb, getPool, hashPassword };

export default { initDb, getPool, hashPassword };
