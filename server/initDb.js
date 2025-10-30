import { initDb } from './database.js';

(async () => {
  try {
    console.log('Inicializando base de datos...');
    const r = await initDb();
    console.log('Inicialización completada:', r);
    process.exit(0);
  } catch (err) {
    console.error('Error inicializando la base de datos:', err.message);
    process.exit(1);
  }
})();
