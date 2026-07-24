import { PRODUCTS } from './data.js';

export function createUI() {
  const fill = document.querySelector('#progress-fill');
  const track = document.querySelector('.progress-track');
  const label = document.querySelector('#progress-label');
  const count = document.querySelector('#progress-count');
  return {
    setProgress(progress) {
      const index = Math.min(PRODUCTS.length - 1, Math.floor(progress * PRODUCTS.length));
      const percentage = Math.round(progress * 100);
      fill.style.width = `${percentage}%`;
      track.setAttribute('aria-valuenow', String(percentage));
      label.textContent = progress < .025 ? 'Entrance' : PRODUCTS[index];
      count.textContent = `${Math.min(PRODUCTS.length, Math.ceil(progress * PRODUCTS.length))} of ${PRODUCTS.length}`;
    }
  };
}
