export const AISLE_CONFIG = {
  length: 96,
  bayDepth: 7.5,
  bayCount: 10,
  baySpacing: 9.6,
  entranceBayZ: -2,
  shelfLevels: [0.72, 1.78, 2.84, 3.9],
  shelfFront: 4.55,
  shelfCentre: 5.78
};

export const STORE_LENGTH = AISLE_CONFIG.length;

export const AISLE_CATALOG = [
  {
    id: 'living-water',
    category: 'Living water',
    products: [
      { id: 'still-spring-750', name: 'Still Spring Water', price: 'R32', description: 'Naturally filtered spring water with a soft mineral finish.', palette: '#a9d9e8', capPalette: '#4f96ad', format: 'bottle', placement: { side: -1, level: 2 } },
      { id: 'sparkling-mineral-500', name: 'Sparkling Mineral Water', price: 'R34', description: 'Fine, lively bubbles sourced from a pristine mineral spring.', palette: '#87c8dc', capPalette: '#2d788e', format: 'bottle', placement: { side: 1, level: 2 } },
      { id: 'coconut-hydration-330', name: 'Coconut Hydration Water', price: 'R42', description: 'Pure young coconut water for clean, gentle replenishment.', palette: '#b8ded2', capPalette: '#5f9d83', format: 'bottle', placement: { side: -1, level: 1 } },
      { id: 'alpine-mineral-750', name: 'Alpine Mineral Water', price: 'R39', description: 'Crisp mountain water with naturally occurring electrolytes.', palette: '#7eb8d4', capPalette: '#3b739e', format: 'bottle', placement: { side: 1, level: 3 } },
      { id: 'cucumber-mint-500', name: 'Cucumber Mint Water', price: 'R36', description: 'A cool botanical infusion of cucumber and fresh mint.', palette: '#a9d5bd', capPalette: '#4b8d6b', format: 'bottle', placement: { side: -1, level: 2 } },
      { id: 'lemon-ginger-500', name: 'Lemon Ginger Water', price: 'R36', description: 'Bright lemon and warm ginger in lightly mineralised water.', palette: '#e2d489', capPalette: '#aa9440', format: 'bottle', placement: { side: 1, level: 1 } },
      { id: 'berry-electrolyte-500', name: 'Berry Electrolyte Water', price: 'R44', description: 'A delicate berry electrolyte blend with no artificial colour.', palette: '#bdabc9', capPalette: '#735c89', format: 'bottle', placement: { side: -1, level: 3 } },
      { id: 'watermelon-hydration-330', name: 'Watermelon Hydration Water', price: 'R42', description: 'Refreshing watermelon water with a whisper of sea salt.', palette: '#e3acac', capPalette: '#aa6267', format: 'bottle', placement: { side: 1, level: 2 } },
      { id: 'botanical-spring-750', name: 'Botanical Spring Water', price: 'R38', description: 'Still spring water finished with subtle wild botanicals.', palette: '#93c9bd', capPalette: '#397d72', format: 'bottle', placement: { side: -1, level: 1 } },
      { id: 'pure-mineral-1l', name: 'Pure Mineral Water', price: 'R46', description: 'A generous bottle of clean mineral water for the day ahead.', palette: '#79b8d5', capPalette: '#316b91', format: 'bottle', placement: { side: 1, level: 3 } }
    ]
  }
];

export const PRODUCTS = AISLE_CATALOG.flatMap(({ category, products }) => products.map((product) => ({ ...product, category })));
