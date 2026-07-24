export const AISLE_CONFIG = {
  length: 96,
  bayDepth: 7.5,
  bayCount: 10,
  baySpacing: 9.6,
  entranceBayZ: -3,
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

export const SHELF_STOCK = [
  { id: 'spring-water-stock', category: 'Water', name: 'Spring Water', price: 'R28', description: 'Pure still spring water.', palette: '#9dcee1', capPalette: '#3e819d', format: 'glass-bottle' },
  { id: 'botanical-water-stock', category: 'Water', name: 'Botanical Water', price: 'R35', description: 'A softly infused botanical water.', palette: '#a8d8c4', capPalette: '#4c8a71', format: 'glass-bottle' },
  { id: 'daily-minerals-stock', category: 'Supplements', name: 'Daily Minerals', price: 'R189', description: 'A clean daily mineral blend.', palette: '#d4c7a3', capPalette: '#587860', format: 'supplement-tub' },
  { id: 'garden-tea-stock', category: 'Tea', name: 'Garden Tea', price: 'R96', description: 'Organic garden herb tea.', palette: '#8ead80', capPalette: '#5e7d51', format: 'tea-box' },
  { id: 'wildflower-honey-stock', category: 'Pantry', name: 'Wildflower Honey', price: 'R154', description: 'Small-batch wildflower honey.', palette: '#d6aa4f', capPalette: '#9e7631', format: 'honey-jar' },
  { id: 'lavender-oil-stock', category: 'Essential oils', name: 'Lavender Oil', price: 'R112', description: 'Pure lavender essential oil.', palette: '#8a94ae', capPalette: '#584f69', format: 'essential-oil' },
  { id: 'organic-greens-stock', category: 'Organic foods', name: 'Organic Greens', price: 'R118', description: 'A nourishing organic greens blend.', palette: '#86a675', capPalette: '#547449', format: 'organic-pouch' }
];
