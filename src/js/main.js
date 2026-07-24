import '../css/main.css';
import '../css/hero.css';
import '../css/environment.css';
import '../css/products.css';
import '../css/ui.css';
import '../css/animations.css';
import '../css/mobile.css';
import gsap from 'gsap';
import { createScene } from './scene.js';
import { createCamera, createCameraWalker } from './camera.js';
import { addLighting } from './lighting.js';
import { createEnvironment } from './environment.js';
import { createParticles } from './particles.js';
import { createEffects } from './effects.js';
import { createProductSystem } from './products.js';
import { createScroll } from './scroll.js';
import { createUI } from './ui.js';
import { createCart } from './cart.js';
import { createEntranceUI } from './entrance.js';

const canvas = document.querySelector('#experience');
const { scene, renderer } = createScene(canvas);
const camera = createCamera();
const walker = createCameraWalker(camera);
const cart = createCart();
addLighting(scene);
const environment = createEnvironment(scene, renderer);
const particles = createParticles(scene);
const effects = createEffects(renderer);
const products = createProductSystem(scene);
const ui = createUI({ onAddToCart: () => cart.add() });
const scroll = createScroll((progress, velocity) => { walker.setProgress(progress, velocity); ui.setProgress(progress); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const entranceUI = createEntranceUI({ scene, camera, canvas, onEnter: () => { if (walker.enter(reducedMotion ? 0.65 : 1.9)) { ui.setStoreState('entering'); entranceUI.setState('entering'); } } });
document.querySelector('#explore-store').addEventListener('click', () => scroll.scrollToProduct(0));

gsap.from('.site-header, .walk-progress', { opacity: 0, y: -12, duration: 1, delay: 0.15, ease: 'power2.out' });
gsap.from('.hero-copy > *', { opacity: 0, y: 22, duration: 0.85, stagger: 0.1, delay: 0.3, ease: 'power3.out' });

function resize() { camera.aspect = window.innerWidth / window.innerHeight; walker.updateViewport(camera.aspect); environment.entrance.setResponsive(camera.aspect); camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight, false); effects.resize(); }
window.addEventListener('resize', resize, { passive: true });
resize();
function render(time) {
  const delta = Math.min(0.05, (time - (render.last || time)) / 1000);
  render.last = time;
  scroll.raf(time);
  const focus = products.update(walker.getTravelZ(), delta);
  walker.setFocus(focus);
  const state = walker.update(delta);
  environment.entrance.setOpen(state.entranceProgress);
  if (state.state !== render.storeState) { render.storeState = state.state; ui.setStoreState(state.state); entranceUI.setState(state.state); scroll.setEnabled(state.state === 'shopping'); }
  if (state.state === 'shopping') ui.setProductFocus(focus);
  particles.update(time);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
