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

const canvas = document.querySelector('#experience');
const { scene, renderer } = createScene(canvas);
const camera = createCamera();
const walker = createCameraWalker(camera);
const cart = createCart();
addLighting(scene);
createEnvironment(scene);
const particles = createParticles(scene);
const effects = createEffects(renderer);
const products = createProductSystem(scene);
const ui = createUI({ onAddToCart: () => cart.add() });
const scroll = createScroll((progress, velocity) => { walker.setProgress(progress, velocity); ui.setProgress(progress); });

gsap.from('.site-header, .walk-progress', { opacity: 0, y: -12, duration: 1, delay: 0.15, ease: 'power2.out' });
gsap.from('.hero-copy > *', { opacity: 0, y: 22, duration: 0.85, stagger: 0.1, delay: 0.3, ease: 'power3.out' });

function resize() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight, false); effects.resize(); }
window.addEventListener('resize', resize, { passive: true });
function render(time) {
  const delta = Math.min(0.05, (time - (render.last || time)) / 1000);
  render.last = time;
  scroll.raf(time);
  const focus = products.update(walker.getTravelZ(), delta);
  walker.setFocus(focus);
  walker.update(delta);
  ui.setProductFocus(focus);
  particles.update(time);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
