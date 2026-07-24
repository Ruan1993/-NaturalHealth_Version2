export function createEffects(renderer) { return { resize() { renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65)); } }; }
