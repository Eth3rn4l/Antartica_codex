import { getPool } from './database.js';
(async ()=>{
  try{
    const pool = await getPool();
    const [rows] = await pool.query("SELECT id, role, FIELD(role,'admin') as field_admin, CASE WHEN role='admin' THEN 0 ELSE 1 END as case_admin FROM users ORDER BY FIELD(role,'admin') DESC, id DESC");
    console.log(JSON.stringify(rows, null, 2));
  }catch(e){console.error(e)}
})();
