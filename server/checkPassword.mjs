import { getPool, hashPassword } from './database.js';
const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
  console.error('Usage: node server/checkPassword.mjs <email> <password>');
  process.exit(1);
}
(async ()=>{
  try{
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
      console.log('User not found in DB');
      process.exit(0);
    }
    const stored = rows[0].password;
    const hashed = hashPassword(password);
    console.log('Stored hash: ', stored);
    console.log('Hash of given password: ', hashed);
    console.log('Match:', stored === hashed);
  }catch(e){
    console.error('Error', e.message);
    process.exit(1);
  }
})();
