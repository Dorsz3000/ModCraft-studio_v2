(() => {
  const root = document.getElementById('modelEditorRoot');
  if (!root) return;
  root.innerHTML = `
    <div class="model-editor">
      <div class="model-stage">
        <div class="model-stage-head"><span>Podgląd 3D · przeciągnij, aby obracać</span><span id="modelCount">1 element</span></div>
        <canvas id="modelCanvas" width="900" height="620"></canvas>
        <div class="model-help">Przeciągaj myszą, aby obracać model. Kółko myszy przybliża i oddala.</div>
      </div>
      <div class="model-parts"><h3>ELEMENTY MODELU</h3><div id="modelPartsList"></div><button id="modelAddPart" class="primary">＋ Dodaj kostkę</button></div>
      <div class="model-properties"><h3>WŁAŚCIWOŚCI ELEMENTU</h3><div id="modelProps"><p class="model-empty">Wybierz element z listy.</p></div></div>
    </div>`;
  const canvas = document.getElementById('modelCanvas'), ctx = canvas.getContext('2d');
  let parts = [{id:1,name:'Kostka 1',x:0,y:0,z:0,w:16,h:16,d:16,color:'#39a7e8'}];
  let selected=1, rotY=-0.65, rotX=-0.45, zoom=1, drag=null, nextId=2;
  const $ = id => document.getElementById(id);
  function project(x,y,z) {
    const cy=Math.cos(rotY), sy=Math.sin(rotY), cx=Math.cos(rotX), sx=Math.sin(rotX);
    const xx=x*cy-z*sy, zz=x*sy+z*cy, yy=y*cx-zz*sx, z2=y*sx+zz*cx;
    const scale=zoom*15, depth=500/(500+z2*0.65);
    return [canvas.width/2+xx*scale*depth, canvas.height/2+yy*scale*depth, z2];
  }
  function shade(hex,f) {
    const n=parseInt(hex.slice(1),16), r=Math.round(((n>>16)&255)*f), g=Math.round(((n>>8)&255)*f), b=Math.round((n&255)*f);
    return `rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`;
  }
  function facesFor(p) {
    const x=p.x-p.w/2,y=p.y-p.h/2,z=p.z-p.d/2,X=x+p.w,Y=y+p.h,Z=z+p.d;
    const v=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
    const f=[[0,1,2,3,.72],[4,7,6,5,1.12],[0,4,5,1,.88],[3,2,6,7,.96],[0,3,7,4,.78],[1,5,6,2,.84]];
    return f.map(a=>({pts:a.slice(0,4).map(i=>project(...v[i])),depth:a.slice(0,4).reduce((s,i)=>s+project(...v[i])[2],0)/4,fill:shade(p.color,a[4]),part:p}));
  }
  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(150,170,200,.12)'; ctx.lineWidth=1;
    for(let i=-8;i<=8;i++) { const a=project(i*16,128,-128),b=project(i*16,128,128),c=project(-128,128,i*16),d=project(128,128,i*16); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.moveTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.stroke(); }
    parts.flatMap(facesFor).sort((a,b)=>b.depth-a.depth).forEach(face=>{ctx.beginPath();face.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=face.fill;ctx.fill();ctx.strokeStyle=face.part.id===selected?'#f5d36b':'rgba(8,12,20,.8)';ctx.lineWidth=face.part.id===selected?2.5:1.2;ctx.stroke();});
    $('modelCount').textContent=parts.length+' element'+(parts.length===1?'':'y');
  }
  function props() {
    const p=parts.find(v=>v.id===selected), box=$('modelProps'); box.innerHTML='';
    if(!p){box.innerHTML='<p class="model-empty">Wybierz element z listy.</p>';return;}
    box.innerHTML=`<label>Nazwa<input id="partName" type="text" value="${p.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"></label>
      <label>Kolor<input data-key="color" type="color" value="${p.color}"></label>
      <h3>POZYCJA (X / Y / Z)</h3><div class="model-number">${numField('X','x',p.x)}${numField('Y','y',p.y)}${numField('Z','z',p.z)}</div>
      <h3>ROZMIAR (X / Y / Z)</h3><div class="model-number">${numField('Szer.','w',p.w)}${numField('Wys.','h',p.h)}${numField('Gł.','d',p.d)}</div>
      <button id="deleteModelPart" class="model-delete">Usuń zaznaczony element</button>`;
    $('partName').oninput=e=>{p.name=e.target.value;const row=[...$('modelPartsList').children].find((_,i)=>parts[i]?.id===p.id);if(row)row.lastChild.textContent=p.name;};
    box.querySelectorAll('[data-key]').forEach(input=>input.oninput=()=>{const k=input.dataset.key;p[k]=k==='color'?input.value:Number(input.value);if(['w','h','d'].includes(k))p[k]=Math.max(1,p[k]);list();});
    $('deleteModelPart').onclick=()=>{parts=parts.filter(v=>v.id!==selected);selected=parts[0]?.id??null;list();};
  }
  function numField(label,key,value){return `<label>${label}<input data-key="${key}" type="number" step="1" value="${value}"></label>`;}
  function list() {
    const box=$('modelPartsList');box.innerHTML='';
    if(!parts.length)box.innerHTML='<p class="model-empty">Model jest pusty. Dodaj kostkę, aby rozpocząć.</p>';
    parts.forEach(p=>{const b=document.createElement('button');b.className='model-part-row'+(p.id===selected?' active':'');const dot=document.createElement('span');dot.className='model-part-dot';dot.style.background=p.color;const t=document.createElement('span');t.textContent=p.name;b.append(dot,t);b.onclick=()=>{selected=p.id;list();};box.append(b);});
    props();render();
  }
  function add(){const id=nextId++;parts.push({id,name:'Kostka '+id,x:(parts.length%3)*20,y:0,z:0,w:16,h:16,d:16,color:'#70b7e8'});selected=id;list();}
  $('addCube3d').onclick=add; $('modelAddPart').onclick=add;
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,rx:rotX,ry:rotY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;rotY=drag.ry+(e.clientX-drag.x)*.008;rotX=Math.max(-1.45,Math.min(1.45,drag.rx+(e.clientY-drag.y)*.008));render();});
  canvas.addEventListener('pointerup',()=>drag=null); canvas.addEventListener('pointercancel',()=>drag=null);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.45,Math.min(2.5,zoom*(e.deltaY<0?1.1:.9)));render();},{passive:false});
  $('exportModel3d').onclick=()=>{const data={format:'modcraft-model',version:1,units:'minecraft_pixels',parts};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='modcraft-model.json';a.click();URL.revokeObjectURL(a.href);};
  list();
})();
