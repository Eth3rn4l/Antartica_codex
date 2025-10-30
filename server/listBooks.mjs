(async ()=>{
  try{
    const res = await fetch('http://localhost:4000/api/books');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  }catch(e){console.error('err', e.message)}
})();
