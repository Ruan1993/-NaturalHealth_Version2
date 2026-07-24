import Lenis from 'lenis';
import { clamp } from './helpers.js';

export function createScroll(onProgress) {
  const lenis = new Lenis({ lerp: .085, smoothWheel: true, syncTouch: true, touchMultiplier: 1.35, wheelMultiplier: .82 });
  let lastScroll = 0;
  lenis.on('scroll', ({ scroll, velocity }) => {
    const start = window.innerHeight * .72;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    onProgress(clamp((scroll - start) / Math.max(end - start, 1), 0, 1), velocity);
    lastScroll = scroll;
  });
  window.addEventListener('keydown', event => {
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); lenis.scrollTo(lastScroll + window.innerHeight * .55); }
    if (['ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); lenis.scrollTo(lastScroll - window.innerHeight * .55); }
  });
  return { raf(time) { lenis.raf(time); }, scrollTo(target) { lenis.scrollTo(target); } };
}
