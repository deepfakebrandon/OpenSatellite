import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { STLExporter } from "three/addons/exporters/STLExporter.js";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
<header class="topbar">
  <div class="brand"><div class="brand-mark"><span></span><span></span><span></span></div><strong>Open<span>Satellite</span></strong><small>MODEL WORKSPACE</small></div>
  <div class="top-actions"><button class="quiet" id="undoBtn" title="Undo (Ctrl+Z)">↶</button><button class="quiet" id="redoBtn" title="Redo (Ctrl+Shift+Z)">↷</button><i></i><button class="button muted" id="newBtn">New project</button><button class="button primary" id="openBtn"><b>＋</b> Import model</button></div>
</header>
<main class="layout">
  <aside class="left-panel">
    <div class="section-head"><div><span class="eyebrow">WORKSPACE</span><h2>Scene</h2></div><button class="icon-btn" id="addShape" title="Add sample block">＋</button></div>
    <div class="project-chip"><div class="project-icon">◈</div><div><strong>Untitled project</strong><span>Local workspace</span></div><span class="dot"></span></div>
    <div class="list-label"><span>OBJECTS <b id="objectCount">1</b></span><button class="text-btn" id="fitBtn">FIT VIEW</button></div>
    <div class="object-list" id="objectList"></div>
    <div class="left-bottom"><div class="hint-icon">⌘</div><div><strong>Drag a model here</strong><span>STL or OBJ · mm units</span></div></div>
  </aside>
  <section class="center">
    <div class="viewport-top"><div class="breadcrumbs"><span>Workspace</span><b>/</b><strong id="activeName">Sample part</strong></div><div class="view-tools"><button class="view-btn active" data-view="perspective">Perspective</button><button class="view-btn" data-view="top">Top</button><button class="view-btn" data-view="front">Front</button><i></i><button class="view-btn grid-toggle" id="gridBtn">▦ Grid</button></div></div>
    <div class="canvas-wrap" id="canvasWrap"><div class="canvas-hint"><span class="mouse-icon">↖</span> Orbit <kbd>left drag</kbd><span>·</span> Pan <kbd>right drag</kbd><span>·</span> Zoom <kbd>wheel</kbd></div><div class="orientation"><div class="axis-ring"><span class="axis z">Z</span><span class="axis x">X</span><span class="axis y">Y</span><div class="axis-center"></div></div></div><div class="empty-drop" id="dropHint"><div class="drop-glyph">⇧</div><h3>Bring a model into your workspace</h3><p>Drop an STL or OBJ file to get started.</p><button class="button primary" id="emptyImport">Choose a model</button></div></div>
    <div class="viewport-bottom"><div class="status-left"><span class="live-dot"></span><span id="statusText">Ready to prepare</span><b>·</b><span>Units <strong>mm</strong></span></div><div class="zoom-controls"><button id="zoomOut">−</button><span id="zoomValue">100%</span><button id="zoomIn">＋</button><i></i><button id="homeView" title="Reset view">⌂</button></div></div>
  </section>
  <aside class="right-panel">
    <div class="right-title"><div><span class="eyebrow">SELECTION</span><h2 id="selectionTitle">Sample part</h2></div><button class="icon-btn" id="deleteBtn" title="Remove selected">⌫</button></div>
    <div class="tabs"><button class="tab active" data-tab="transform">Transform</button><button class="tab" data-tab="inspect">Inspect</button></div>
    <div id="transformPanel">
      <div class="tool-segment"><button class="tool active" data-mode="translate" title="Move (G)">✥</button><button class="tool" data-mode="rotate" title="Rotate (R)">⟳</button><button class="tool" data-mode="scale" title="Scale (S)">⤢</button></div>
      <div class="subhead"><span>POSITION</span><button class="reset-link" data-reset="position">RESET</button></div>
      <div class="axis-fields"><label><i class="red"></i>X<input data-axis="position" data-index="0" value="0.0"><em>mm</em></label><label><i class="green"></i>Y<input data-axis="position" data-index="1" value="0.0"><em>mm</em></label><label><i class="blue"></i>Z<input data-axis="position" data-index="2" value="0.0"><em>mm</em></label></div>
      <div class="subhead"><span>ROTATION</span><button class="reset-link" data-reset="rotation">RESET</button></div>
      <div class="axis-fields"><label><i class="red"></i>X<input data-axis="rotation" data-index="0" value="0"><em>°</em></label><label><i class="green"></i>Y<input data-axis="rotation" data-index="1" value="0"><em>°</em></label><label><i class="blue"></i>Z<input data-axis="rotation" data-index="2" value="0"><em>°</em></label></div>
      <div class="subhead"><span>SCALE</span><button class="lock active" id="lockScale">▣</button><button class="reset-link" data-reset="scale">RESET</button></div>
      <div class="axis-fields"><label><i class="red"></i>X<input data-axis="scale" data-index="0" value="1.00"><em>×</em></label><label><i class="green"></i>Y<input data-axis="scale" data-index="1" value="1.00"><em>×</em></label><label><i class="blue"></i>Z<input data-axis="scale" data-index="2" value="1.00"><em>×</em></label></div>
      <div class="subhead"><span>PLACEMENT</span></div><button class="wide-action" id="layFlat"><span>⌄</span> Place on build plate</button><button class="wide-action" id="centerBtn"><span>⊙</span> Center on plate</button>
    </div>
    <div id="inspectPanel" class="inspect-panel hidden"><div class="metric"><span>Triangles</span><strong id="triangles">12</strong></div><div class="metric"><span>Dimensions</span><strong id="dimensions">20 × 20 × 20 mm</strong></div><div class="metric"><span>Watertight</span><strong class="state-pill">Unknown</strong></div><p>Mesh checks are informational. Imported geometry is not repaired automatically.</p></div>
    <div class="right-footer"><div class="export-note"><span class="export-icon">↥</span><span><strong>Ready to export</strong><small>Save a printable mesh</small></span></div><button class="button export-btn" id="exportBtn">Export STL <span>↗</span></button></div>
  </aside>
</main>
<input type="file" id="fileInput" accept=".stl,.obj" hidden />
`;

const wrap = document.querySelector<HTMLDivElement>("#canvasWrap")!;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#171e20");
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000);
camera.position.set(65, 56, 72);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
wrap.prepend(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.target.set(0, 12, 0);
const transform = new TransformControls(camera, renderer.domElement);
scene.add(transform.getHelper());
transform.addEventListener("dragging-changed", e => orbit.enabled = !e.value);
transform.addEventListener("objectChange", syncFields);
const hemi = new THREE.HemisphereLight(0xe9f8f3, 0x343b3c, 2.2); scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-35, 70, 40); scene.add(key);
const fill = new THREE.DirectionalLight(0x8ab6bb, 1.1); fill.position.set(40, 25, -35); scene.add(fill);

const grid = new THREE.GridHelper(140, 28, 0x465457, 0x303b3d);
grid.position.y = 0; scene.add(grid);
const plate = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshStandardMaterial({color:0x222b2d, roughness:0.95, side:THREE.DoubleSide}));
plate.rotation.x = -Math.PI / 2; plate.position.y = -0.025; scene.add(plate);
const objects: THREE.Object3D[] = [];
let selected: THREE.Object3D | null = null;
let gridVisible = true;
let scaleLocked = true;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function resize() {
 const rect=wrap.getBoundingClientRect(); renderer.setSize(rect.width,rect.height,false);
 camera.aspect=rect.width/rect.height; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(wrap); resize();

function addSample() {
 const geometry = new THREE.BoxGeometry(24, 30, 18, 1, 1, 1);
 const material = new THREE.MeshStandardMaterial({color:0x81c7ad, metalness:0.12, roughness:0.43});
 const mesh = new THREE.Mesh(geometry, material);
 mesh.name = "Sample part"; mesh.position.set(0,15,0);
 mesh.userData.original = {position:mesh.position.clone(), rotation:mesh.rotation.clone(), scale:mesh.scale.clone()};
 const bevel = new THREE.EdgesGeometry(geometry);
 const outline = new THREE.LineSegments(bevel,new THREE.LineBasicMaterial({color:0x344843,transparent:true,opacity:.35}));
 mesh.add(outline);
 addObject(mesh);
}
function addObject(object:THREE.Object3D) {
 objects.push(object); scene.add(object); select(object); renderList();
}
function label(o:THREE.Object3D) { return o.name || "Imported model"; }
function renderList() {
 const host=document.querySelector<HTMLDivElement>("#objectList")!;
 host.innerHTML="";
 objects.forEach((o,i)=>{
  const row=document.createElement("button"); row.className="object-row"+(o===selected?" selected":"");
  row.innerHTML=`<span class="cube-icon">${o instanceof THREE.Mesh?"◧":"▧"}</span><span><strong>${escapeHtml(label(o))}</strong><small>${geometryCount(o)} triangles</small></span><span class="eye">◉</span>`;
  row.onclick=()=>select(o); host.append(row);
 });
 document.querySelector("#objectCount")!.textContent=String(objects.length);
}
function escapeHtml(s:string){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));}
function geometryCount(o:THREE.Object3D):number {let n=0;o.traverse(x=>{if(x instanceof THREE.Mesh)n+=x.geometry.index?x.geometry.index.count/3:x.geometry.attributes.position.count/3});return Math.round(n);}
function select(o:THREE.Object3D|null) {
 selected=o; transform.detach(); if(o) transform.attach(o);
 const name=o?label(o):"No selection";
 document.querySelector("#activeName")!.textContent=name;
 document.querySelector("#selectionTitle")!.textContent=name;
 document.querySelector("#dropHint")!.classList.toggle("visible",objects.length===0);
 renderList(); syncFields(); updateMetrics();
}
function syncFields() {
 if(!selected)return;
 (["position","rotation","scale"] as const).forEach(key=>{
   const v=selected![key];
   document.querySelectorAll<HTMLInputElement>(`input[data-axis="${key}"]`).forEach(inp=>{
     const n=axisValue(v,Number(inp.dataset.index));
    inp.value=key==="rotation"?(THREE.MathUtils.radToDeg(n)).toFixed(1):key==="scale"?n.toFixed(2):n.toFixed(1);
   });
 });
}
function axisValue(v:THREE.Vector3|THREE.Euler,index:number){return index===0?v.x:index===1?v.y:v.z;}
function setAxis(v:THREE.Vector3|THREE.Euler,index:number,value:number){if(index===0)v.x=value;else if(index===1)v.y=value;else v.z=value;}
function updateMetrics(){
 if(!selected)return;
 const box=new THREE.Box3().setFromObject(selected), size=box.getSize(new THREE.Vector3());
 document.querySelector("#triangles")!.textContent=geometryCount(selected).toLocaleString();
 document.querySelector("#dimensions")!.textContent=`${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} mm`;
}
function fitView() {
 if(!selected)return;
 const box=new THREE.Box3().setFromObject(selected), size=box.getSize(new THREE.Vector3()), center=box.getCenter(new THREE.Vector3());
 const span=Math.max(size.x,size.y,size.z,16);
 orbit.target.copy(center); camera.position.copy(center).add(new THREE.Vector3(span*1.9,span*1.5,span*2.05)); camera.near=Math.max(.1,span/1000);camera.far=span*100;camera.updateProjectionMatrix();orbit.update();
}
function importFile(file:File) {
 const ext=file.name.split(".").pop()?.toLowerCase();
 const reader=new FileReader();
 reader.onerror=()=>setStatus("Could not read that file");
 reader.onload=()=>{
  try {
   let object:THREE.Object3D;
   if(ext==="stl") {
    const geometry=new STLLoader().parse(reader.result as ArrayBuffer);
    geometry.computeVertexNormals();
    object=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0x91c8bd,metalness:.08,roughness:.48}));
   } else if(ext==="obj") object=new OBJLoader().parse(reader.result as string);
   else {setStatus("Choose an STL or OBJ model");return;}
   object.name=file.name.replace(/\.[^.]+$/,"");
   const box=new THREE.Box3().setFromObject(object), center=box.getCenter(new THREE.Vector3());
   object.position.sub(center);
   const bounds=new THREE.Box3().setFromObject(object);
   object.position.y-=bounds.min.y;
   object.userData.original={position:object.position.clone(),rotation:object.rotation.clone(),scale:object.scale.clone()};
   addObject(object);fitView();setStatus("Model imported");
  } catch {setStatus("That model could not be parsed");}
 };
 if(ext==="obj") reader.readAsText(file); else reader.readAsArrayBuffer(file);
}
function setStatus(s:string){document.querySelector("#statusText")!.textContent=s;}

document.querySelector("#openBtn")!.addEventListener("click",()=>document.querySelector<HTMLInputElement>("#fileInput")!.click());
document.querySelector("#emptyImport")!.addEventListener("click",()=>document.querySelector<HTMLInputElement>("#fileInput")!.click());
document.querySelector<HTMLInputElement>("#fileInput")!.addEventListener("change",e=>{const file=(e.target as HTMLInputElement).files?.[0];if(file)importFile(file);});
wrap.addEventListener("dragover",e=>{e.preventDefault();wrap.classList.add("dragover");});
wrap.addEventListener("dragleave",()=>wrap.classList.remove("dragover"));
wrap.addEventListener("drop",e=>{e.preventDefault();wrap.classList.remove("dragover");const file=e.dataTransfer?.files[0];if(file)importFile(file);});
renderer.domElement.addEventListener("pointerdown",e=>{
 if(transform.axis)return;
 const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);
 raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(objects,true);
 if(hits.length){let o:THREE.Object3D=hits[0].object;while(o.parent&&!objects.includes(o))o=o.parent;select(o);}
});
document.querySelectorAll<HTMLButtonElement>(".tool").forEach(btn=>btn.onclick=()=>{document.querySelector(".tool.active")?.classList.remove("active");btn.classList.add("active");transform.setMode(btn.dataset.mode as "translate"|"rotate"|"scale");});
document.querySelectorAll<HTMLButtonElement>(".view-btn[data-view]").forEach(btn=>btn.onclick=()=>{
 document.querySelector(".view-btn.active")?.classList.remove("active");btn.classList.add("active");
 const t=orbit.target.clone(), d=Math.max(100,camera.position.distanceTo(t));
 if(btn.dataset.view==="top")camera.position.set(t.x,t.y+d,t.z+.001);
 else if(btn.dataset.view==="front")camera.position.set(t.x,t.y,t.z+d);
 else camera.position.set(t.x+d*.7,t.y+d*.62,t.z+d*.75);
 camera.lookAt(t);orbit.update();
});
document.querySelector("#gridBtn")!.addEventListener("click",e=>{gridVisible=!gridVisible;grid.visible=gridVisible;plate.visible=gridVisible;(e.currentTarget as HTMLElement).classList.toggle("active",gridVisible);});
document.querySelector("#fitBtn")!.addEventListener("click",fitView);
document.querySelector("#homeView")!.addEventListener("click",()=>{camera.position.set(65,56,72);orbit.target.set(0,12,0);orbit.update();});
document.querySelector("#zoomIn")!.addEventListener("click",()=>{camera.position.sub(orbit.target).multiplyScalar(.82).add(orbit.target);});
document.querySelector("#zoomOut")!.addEventListener("click",()=>{camera.position.sub(orbit.target).multiplyScalar(1.22).add(orbit.target);});
document.querySelector("#lockScale")!.addEventListener("click",e=>{scaleLocked=!scaleLocked;(e.currentTarget as HTMLElement).classList.toggle("active",scaleLocked);});
document.querySelectorAll<HTMLInputElement>(".axis-fields input").forEach(input=>input.addEventListener("change",()=>{
 if(!selected)return; const type=input.dataset.axis as "position"|"rotation"|"scale", i=Number(input.dataset.index) as 0|1|2;
 let value=Number(input.value);if(!Number.isFinite(value))return;if(type==="rotation")value=THREE.MathUtils.degToRad(value);
 if(type==="scale"&&scaleLocked){const old=axisValue(selected.scale,i);if(old!==0)selected.scale.multiplyScalar(value/old);}else setAxis(selected[type],i,value);
 syncFields();updateMetrics();
}));
document.querySelectorAll<HTMLButtonElement>("[data-reset]").forEach(btn=>btn.onclick=()=>{
 if(!selected)return;const key=btn.dataset.reset as "position"|"rotation"|"scale";const v=selected.userData.original?.[key];
 if(v)selected[key].copy(v);else if(key==="scale")selected.scale.setScalar(1);else selected[key].set(0,0,0);syncFields();updateMetrics();
});
document.querySelector("#layFlat")!.addEventListener("click",()=>{if(!selected)return;const b=new THREE.Box3().setFromObject(selected);selected.position.y-=b.min.y;syncFields();updateMetrics();setStatus("Placed on build plate");});
document.querySelector("#centerBtn")!.addEventListener("click",()=>{if(!selected)return;const b=new THREE.Box3().setFromObject(selected),c=b.getCenter(new THREE.Vector3());selected.position.x-=c.x;selected.position.z-=c.z;syncFields();});
document.querySelector("#addShape")!.addEventListener("click",()=>{const g=new THREE.BoxGeometry(16,16,16),m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xb9aa83,roughness:.6}));m.name="New block";m.position.set(objects.length*4,8,0);m.userData.original={position:m.position.clone(),rotation:m.rotation.clone(),scale:m.scale.clone()};addObject(m);setStatus("Block added");});
document.querySelector("#deleteBtn")!.addEventListener("click",()=>{if(!selected)return;scene.remove(selected);objects.splice(objects.indexOf(selected),1);selected=null;transform.detach();select(objects[0]||null);setStatus("Object removed");});
document.querySelector("#newBtn")!.addEventListener("click",()=>{objects.slice().forEach(o=>scene.remove(o));objects.length=0;select(null);setStatus("New workspace ready");});
document.querySelectorAll<HTMLButtonElement>(".tab").forEach(tab=>tab.onclick=()=>{document.querySelector(".tab.active")?.classList.remove("active");tab.classList.add("active");const inspect=tab.dataset.tab==="inspect";document.querySelector("#transformPanel")!.classList.toggle("hidden",inspect);document.querySelector("#inspectPanel")!.classList.toggle("hidden",!inspect);});
document.querySelector("#exportBtn")!.addEventListener("click",async()=>{
 if(!selected){setStatus("Select a model to export");return;}
 const clone=selected.clone(true);clone.updateMatrixWorld(true);
 const data=new STLExporter().parse(clone,{binary:true}) as DataView;
 const bytes=Array.from(new Uint8Array(data.buffer,data.byteOffset,data.byteLength));
 const result=await window.satellite.saveStl(bytes);
 if(!result.canceled)setStatus("STL exported");
});
window.addEventListener("keydown",e=>{
 if((e.target as HTMLElement).tagName==="INPUT")return;
 if(e.key==="g"||e.key==="r"||e.key==="s")transform.setMode(({g:"translate",r:"rotate",s:"scale"} as const)[e.key]);
 if(e.key==="f")fitView();
 if(e.key==="Delete")document.querySelector<HTMLButtonElement>("#deleteBtn")!.click();
});
function animate(){requestAnimationFrame(animate);orbit.update();renderer.render(scene,camera);}
addSample();fitView();animate();
