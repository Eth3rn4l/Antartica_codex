import { getPool } from './database.js';
const email = process.argv[2];
if (!email) {
  console.error('Usage: node server/findUser.mjs <email>');
  process.exit(1);
}
(async ()=>{
  try{
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, nombre, apellido, email, password, telefono, region, comuna, rut, role, created_at FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
      console.log('User not found in DB');
      process.exit(0);
    }
    console.log(JSON.stringify(rows[0], null, 2));
  }catch(e){
    console.error('Error', e.message);
    process.exit(1);
  }
})();
