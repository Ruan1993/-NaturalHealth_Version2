import { PRODUCTS } from './data.js';

export function createUI({ onAddToCart }) {
  const fill = document.querySelector('#progress-fill');
  const track = document.querySelector('.progress-track');
  const label = document.querySelector('#progress-label');
  const count = document.querySelector('#progress-count');
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
      fill.style.width = `${percentage}%`;
      track.setAttribute('aria-valuenow', String(percentage));
      label.textContent = progress < 0.025 ? 'Entrance' : PRODUCTS[index].name;
      count.textContent = `${Math.min(PRODUCTS.length, Math.ceil(progress * PRODUCTS.length))} of ${PRODUCTS.length}`;
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
    }
  };
}
