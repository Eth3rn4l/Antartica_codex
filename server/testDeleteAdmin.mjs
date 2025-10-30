(async ()=>{
  try{
    const login = await fetch('http://localhost:4000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@admin.com',password:'admin123'})});
    const li = await login.json();
    console.log('login status', login.status, li);
    const token = li.token;
    const del = await fetch('http://localhost:4000/api/users/1',{method:'DELETE', headers:{Authorization:`Bearer ${token}`}});
    const body = await del.json().catch(()=>({}));
    console.log('delete status', del.status, body);
  }catch(e){console.error(e)}
})();
