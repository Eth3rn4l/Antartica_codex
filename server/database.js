/* eslint-env node */
/* global process */
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

  // Lista de libros que queremos asegurar en la BD con stock 10
  const desiredBooks = [
    { title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', price: 12000, image: '/assets/cienanos.png', description: 'Una novela mágica y realista sobre la familia Buendía.' },
    { title: 'El Principito', author: 'Antoine de Saint-Exupéry', price: 8000, image: '/assets/principito.png', description: 'Un clásico cuento filosófico sobre la vida y la amistad.' },
    { title: '1984', author: 'George Orwell', price: 9500, image: '/assets/1984.png', description: 'Distopía clásica sobre vigilancia y totalitarismo.' },
    { title: 'Harry Potter y la Piedra Filosofal', author: 'J.K. Rowling', price: 11000, image: '/assets/piedrafil.png', description: 'El inicio de la saga del joven mago.' },
    { title: 'Harry Potter y la Cámara Secreta', author: 'J.K. Rowling', price: 11000, image: '/assets/camarasecreta.png', description: 'La segunda aventura de Harry en Hogwarts.' },
    { title: 'Harry Potter y el Prisionero de Azkaban', author: 'J.K. Rowling', price: 11000, image: '/assets/azkaban.png', description: 'Tercera entrega con misterio y viaje en el tiempo.' },
    { title: 'Harry Potter y el Cáliz de Fuego', author: 'J.K. Rowling', price: 12000, image: '/assets/calizdefuego.png', description: 'Torneo de los tres magos y peligros crecientes.' },
    { title: 'Harry Potter y la Orden del Fénix', author: 'J.K. Rowling', price: 13000, image: '/assets/ordenfenix.png', description: 'La resistencia contra las fuerzas oscuras se organiza.' },
    { title: 'Harry Potter y el Misterio del Príncipe', author: 'J.K. Rowling', price: 13000, image: '/assets/misprince.png', description: 'Se revelan secretos del pasado y alianzas importantes.' },
  ];

  // Para cada libro, insertar si no existe (evitar duplicados por título)
  for (const b of desiredBooks) {
    const [exists] = await p.query('SELECT id FROM books WHERE title = ? LIMIT 1', [b.title]);
    if (!exists || exists.length === 0) {
      await p.query(`INSERT INTO books (title, author, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)` , [b.title, b.author, b.price, b.image, b.description, 10]);
    } else {
      // opcional: actualizar stock si está por debajo de 10
      await p.query('UPDATE books SET stock = GREATEST(stock, 10) WHERE id = ?', [exists[0].id]);
    }
  }

  return { success: true };
}

export { initDb, getPool, hashPassword };

export default { initDb, getPool, hashPassword };
