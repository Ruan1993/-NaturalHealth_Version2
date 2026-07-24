import { PRODUCTS } from './data.js';

export function createUI({ onAddToCart }) {
  const fill = document.querySelector('#progress-fill');
  const track = document.querySelector('.progress-track');
  const label = document.querySelector('#progress-label');
  const count = document.querySelector('#progress-count');
  const heroCopy = document.querySelector('.hero-copy');
  const heroNote = document.querySelector('.hero-note');
  const spotlight = document.querySelector('#product-spotlight');
  const category = document.querySelector('#spotlight-category');
  const name = document.querySelector('#spotlight-name');
  const description = document.querySelector('#spotlight-description');
  const price = document.querySelector('#spotlight-price');
  const addButton = document.querySelector('#spotlight-add');
  let activeProductId = null;
  let activeProduct = null;
  addButton.addEventListener('click', () => { if (activeProduct) onAddToCart(activeProduct); });
  return {
    setProgress(progress) {
      const index = Math.min(PRODUCTS.length - 1, Math.floor(progress * PRODUCTS.length));
      const percentage = Math.round(progress * 100);
      const heroExit = Math.min(progress / 0.05, 1);
      const heroOpacity = 1 - heroExit * heroExit * (3 - 2 * heroExit);
      fill.style.width = `${percentage}%`;
      track.setAttribute('aria-valuenow', String(percentage));
      label.textContent = progress < 0.025 ? 'Entrance' : PRODUCTS[index].name;
      count.textContent = `${Math.min(PRODUCTS.length, Math.ceil(progress * PRODUCTS.length))} of ${PRODUCTS.length}`;
      heroCopy.style.opacity = heroOpacity.toFixed(3);
      heroCopy.style.transform = `translate3d(0, ${-heroExit * 42}px, 0)`;
      heroCopy.style.pointerEvents = heroExit > 0.92 ? 'none' : 'auto';
      heroNote.style.opacity = heroOpacity.toFixed(3);
      heroNote.style.transform = `translate3d(0, ${-heroExit * 18}px, 0)`;
    },
    setProductFocus(focus) {
      const visible = focus.intensity > 0.04 && focus.product;
      if (visible && focus.product.id !== activeProductId) {
        activeProductId = focus.product.id;
        activeProduct = focus.product;
        category.textContent = focus.product.category;
        name.textContent = focus.product.name;
        description.textContent = focus.product.description;
        price.textContent = focus.product.price;
      }
      if (!visible) activeProductId = null;
      spotlight.style.setProperty('--spotlight-opacity', visible ? focus.intensity.toFixed(3) : '0');
      spotlight.classList.toggle('is-visible', visible);
      spotlight.classList.toggle('is-left', visible && focus.side > 0);
    }
  };
}
