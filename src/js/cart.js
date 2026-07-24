export function createCart() { let count = 0; return { add() { count += 1; document.querySelector('#cart-count').textContent = count; }, get count() { return count; } }; }
