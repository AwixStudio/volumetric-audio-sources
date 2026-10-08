// All interactions stay in the browser. No analytics, requests or form submissions.
'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }
});

// Every setup remains available if JavaScript is disabled.
const backendLinks = [...document.querySelectorAll('[data-backend]')];
const backendPanels = [...document.querySelectorAll('[data-panel]')];
function selectBackend(backend) {
  backendLinks.forEach(link => {
    const selected = link.dataset.backend === backend;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  backendPanels.forEach(panel => { panel.hidden = panel.dataset.panel !== backend; });
}
backendLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  selectBackend(link.dataset.backend);
}));
const initialBackend = backendLinks.find(link => link.hash === location.hash);
selectBackend(initialBackend ? initialBackend.dataset.backend : 'unity');
window.addEventListener('hashchange', () => {
  const link = backendLinks.find(item => item.hash === location.hash);
  if (link) selectBackend(link.dataset.backend);
});

document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('contact@awixstudio.com');
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Select the address above to copy it, or click it to email us.';
  }
});

// A 2D closest-point illustration, not an audio engine or a performance benchmark.
const diagram = document.querySelector('#audio-demo');
const polygon = [[55,277],[157,226],[237,234],[332,136],[426,143],[531,60],[556,99],[438,184],[350,178],[252,274],[167,268],[74,312]];
const volumeButton = document.querySelector('#volume-mode');
const pointButton = document.querySelector('#point-mode');
const demoStatus = document.querySelector('#demo-status');
let listener = {x:374, y:275};
let isVolume = true;
let pointerId = null;
function inPolygon(point) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi,yi] = polygon[i], [xj,yj] = polygon[j];
    if (((yi > point.y) !== (yj > point.y)) && (point.x < (xj-xi)*(point.y-yi)/(yj-yi)+xi)) inside = !inside;
  }
  return inside;
}
function closestPoint(point) {
  if (inPolygon(point)) return {...point};
  let best = null, distance = Infinity;
  polygon.forEach((a, i) => {
    const b = polygon[(i+1)%polygon.length];
    const dx=b[0]-a[0], dy=b[1]-a[1];
    const t=Math.max(0,Math.min(1,((point.x-a[0])*dx+(point.y-a[1])*dy)/(dx*dx+dy*dy)));
    const candidate={x:a[0]+t*dx,y:a[1]+t*dy};
    const squared=(point.x-candidate.x)**2+(point.y-candidate.y)**2;
    if (squared < distance) {best=candidate;distance=squared;}
  });
  return best;
}
function drawDemo() {
  const emitter = isVolume ? closestPoint(listener) : {x:305,y:190};
  document.querySelector('#listener-dot').setAttribute('transform', `translate(${listener.x} ${listener.y})`);
  document.querySelector('#emitter-dot').setAttribute('transform', `translate(${emitter.x} ${emitter.y})`);
  const range = document.querySelector('#range-circle');
  range.setAttribute('cx',emitter.x);range.setAttribute('cy',emitter.y);
  const line = document.querySelector('#distance-line');
  line.setAttribute('x1',emitter.x);line.setAttribute('y1',emitter.y);
  line.setAttribute('x2',listener.x);line.setAttribute('y2',listener.y);
  volumeButton.setAttribute('aria-pressed',String(isVolume));
  pointButton.setAttribute('aria-pressed',String(!isVolume));
  demoStatus.textContent = isVolume ? 'Volume mode: the emitter follows the closest point.' : 'Point mode: the emitter stays at one fixed position.';
}
function moveListener(event) {
  const matrix = diagram.getScreenCTM();
  if (!matrix) return;
  const point = new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
  listener={x:Math.max(22,Math.min(578,point.x)),y:Math.max(22,Math.min(338,point.y))};
  drawDemo();
}
diagram.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  pointerId=event.pointerId;
  diagram.setPointerCapture(pointerId);
  diagram.focus({preventScroll:true});
  moveListener(event);
});
diagram.addEventListener('pointermove', event => {if(event.pointerId===pointerId)moveListener(event);});
function stopDragging(event) {
  if (event.pointerId===pointerId) {
    if(diagram.hasPointerCapture(pointerId))diagram.releasePointerCapture(pointerId);
    pointerId=null;
  }
}
diagram.addEventListener('pointerup',stopDragging);
diagram.addEventListener('pointercancel',stopDragging);
diagram.addEventListener('keydown', event => {
  const offsets={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};
  const offset=offsets[event.key];
  if (!offset) return;
  event.preventDefault();
  listener.x=Math.max(22,Math.min(578,listener.x+offset[0]));
  listener.y=Math.max(22,Math.min(338,listener.y+offset[1]));
  drawDemo();
});
volumeButton.addEventListener('click',()=>{isVolume=true;drawDemo();});
pointButton.addEventListener('click',()=>{isVolume=false;drawDemo();});
document.querySelector('#reset-demo').addEventListener('click',()=>{listener={x:374,y:275};isVolume=true;drawDemo();});
drawDemo();
