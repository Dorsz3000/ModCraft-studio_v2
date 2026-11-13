// Adds removable user-created swatches without changing the built-in palette.
(() => {
  const swatches=document.getElementById('swatches');
  const addButton=document.getElementById('samplePalette');
  const color=document.getElementById('color');
  if(!swatches||!addButton||!color)return;
  const builtIn=[...swatches.querySelectorAll('.swatch')].map(b=>b.style.backgroundColor);
  const custom=[];
  function render(){
    swatches.innerHTML='';
    builtIn.forEach(c=>{const b=document.createElement('button');b.className='swatch';b.style.backgroundColor=c;b.title='Kolor wbudowany';b.onclick=()=>{color.value=toHex(c);};swatches.append(b);});
    custom.forEach((c,i)=>{
      const wrap=document.createElement('div');wrap.className='custom-swatch-wrap';
      const b=document.createElement('button');b.className='swatch custom-swatch';b.style.background=c;b.title=c+' — kliknij, aby wybrać';b.onclick=()=>color.value=c;
      const del=document.createElement('button');del.className='swatch-delete';del.type='button';del.textContent='×';del.title='Usuń kolor';del.setAttribute('aria-label','Usuń kolor '+c);
      del.onclick=()=>{custom.splice(i,1);render();};wrap.append(b,del);swatches.append(wrap);
    });
  }
  function toHex(rgb){const m=rgb.match(/\d+/g);return '#'+m.slice(0,3).map(v=>(+v).toString(16).padStart(2,'0')).join('');}
  addButton.onclick=()=>{const c=color.value.toLowerCase();if(custom.includes(c)||builtIn.map(toHex).includes(c))return;custom.push(c);render();};
  render();
})();
