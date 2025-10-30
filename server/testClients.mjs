(async ()=>{
  try{
    const login = await fetch('http://localhost:4000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@admin.com',password:'admin123'})});
    const li = await login.json();
    console.log('login status', login.status, li);
    if(!login.ok) return;
    const token = li.token;
    const users = await fetch('http://localhost:4000/api/users?role=client&page=1&limit=20',{headers:{Authorization:`Bearer ${token}`}});
    const udata = await users.json();
    console.log('clients status', users.status, JSON.stringify(udata, null, 2));
  }catch(e){console.error('err', e.message)}
})();
