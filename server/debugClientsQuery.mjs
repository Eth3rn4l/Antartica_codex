import { getPool } from './database.js';
(async ()=>{
  try{
    const pool = await getPool();
    const [rows] = await pool.query("SELECT id, nombre, role FROM users WHERE role = 'client' ORDER BY id DESC");
    console.log(rows);
  }catch(e){console.error(e)}
})();
