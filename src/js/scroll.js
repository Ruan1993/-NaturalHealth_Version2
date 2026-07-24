import Lenis from 'lenis';
import { clamp } from './helpers.js';
import { AISLE_CONFIG, PRODUCTS, STORE_LENGTH } from './data.js';

export function createScroll(onProgress) {
  const lenis = new Lenis({ lerp: .065, smoothWheel: true, syncTouch: true, touchMultiplier: .72, wheelMultiplier: .54 });
  let lastScroll = 0;
  let lastProgress = 0;
  let enabled = false;
  let keyboardTargetIndex = -1;
  let stepping = false;
  lenis.on('scroll', ({ scroll, velocity }) => {
    const start = window.innerHeight * .72;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    onProgress(clamp((scroll - start) / Math.max(end - start, 1), 0, 1), velocity);
    lastProgress = clamp((scroll - start) / Math.max(end - start, 1), 0, 1);
    if (!stepping) keyboardTargetIndex = nearestProductIndex();
    lastScroll = scroll;
  });
  const nearestProductIndex = () => clamp(Math.floor((lastProgress * STORE_LENGTH - (8 - AISLE_CONFIG.entranceBayZ)) / AISLE_CONFIG.baySpacing), -1, PRODUCTS.length - 1);
  window.addEventListener('keydown', event => {
    if (!enabled || event.repeat) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); keyboardTargetIndex = clamp(keyboardTargetIndex + 1, 0, PRODUCTS.length - 1); stepping = true; scrollToProduct(keyboardTargetIndex, () => { stepping = false; }); }
    if (event.key === 'ArrowUp') { event.preventDefault(); keyboardTargetIndex = clamp(keyboardTargetIndex - 1, 0, PRODUCTS.length - 1); stepping = true; scrollToProduct(keyboardTargetIndex, () => { stepping = false; }); }
    if (['PageDown', ' '].includes(event.key)) { event.preventDefault(); lenis.scrollTo(lastScroll + window.innerHeight * .55); }
    if (event.key === 'PageUp') { event.preventDefault(); lenis.scrollTo(lastScroll - window.innerHeight * .55); }
  });
  const scrollToProduct = (index, onComplete) => {
    const start = window.innerHeight * .72;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    const productIndex = clamp(index, 0, PRODUCTS.length - 1);
    const productZ = AISLE_CONFIG.entranceBayZ - productIndex * AISLE_CONFIG.baySpacing;
    const progress = clamp((8 - productZ) / STORE_LENGTH, 0, 1);
    lenis.scrollTo(start + progress * Math.max(end - start, 1), { onComplete });
  };
  return { raf(time) { lenis.raf(time); }, scrollTo(target) { lenis.scrollTo(target); }, scrollToProduct, setEnabled(nextEnabled) { enabled = nextEnabled; if (enabled) keyboardTargetIndex = nearestProductIndex(); } };
}
