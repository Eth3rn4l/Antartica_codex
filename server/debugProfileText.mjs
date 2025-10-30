(async ()=>{
  try{
    const login = await fetch('http://localhost:4000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'cliente@cliente.com',password:'cliente123'})});
    const li = await login.json();
    console.log('login status', login.status, li);
    if(!login.ok) return;
    const token = li.token;
    const profile = await fetch('http://localhost:4000/api/users/me',{headers:{Authorization:`Bearer ${token}`}});
    console.log('profile status', profile.status);
    const text = await profile.text();
    console.log('profile body:', text.slice(0,1000));
  }catch(e){console.error('err', e)}
})();
