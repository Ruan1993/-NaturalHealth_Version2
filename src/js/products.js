import * as THREE from 'three';
import { AISLE_CONFIG, PRODUCTS, SHELF_STOCK } from './data.js';
import { clamp, lerp } from './helpers.js';

const featuredGeometry = new THREE.CylinderGeometry(0.18, 0.21, 0.74, 12);
const featuredLabelGeometry = new THREE.BoxGeometry(0.014, 0.18, 0.32);
const capGeometry = new THREE.CylinderGeometry(0.11, 0.11, 0.095, 12);
const stockGeometry = {
  'glass-bottle': { geometry: new THREE.CylinderGeometry(0.125, 0.15, 0.54, 10), height: 0.54, cap: true },
  'supplement-tub': { geometry: new THREE.CylinderGeometry(0.2, 0.22, 0.38, 12), height: 0.38, cap: true },
  'tea-box': { geometry: new THREE.BoxGeometry(0.28, 0.43, 0.31), height: 0.43, cap: false },
  'honey-jar': { geometry: new THREE.CylinderGeometry(0.17, 0.2, 0.33, 12), height: 0.33, cap: true },
  'essential-oil': { geometry: new THREE.CylinderGeometry(0.075, 0.09, 0.32, 10), height: 0.32, cap: true },
  'organic-pouch': { geometry: new THREE.BoxGeometry(0.23, 0.46, 0.12), height: 0.46, cap: false }
};
const stockLabelGeometry = new THREE.BoxGeometry(0.012, 0.11, 0.22);
const smoothstep = (start, end, value) => {
  const normalized = clamp((value - start) / (end - start), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

function createBottleMaterial(color) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.12, metalness: 0, transmission: 0.23, thickness: 0.13, transparent: true, opacity: 0.7, clearcoat: 0.7, clearcoatRoughness: 0.1, emissive: new THREE.Color(color), emissiveIntensity: 0 });
}

function createFeaturedProduct(product, side, level, z, offset = 0) {
  const group = new THREE.Group();
  const material = createBottleMaterial(product.palette);
  const body = new THREE.Mesh(featuredGeometry, material);
  body.position.y = featuredGeometry.parameters.height / 2;
  group.add(body);
  const label = new THREE.Mesh(featuredLabelGeometry, new THREE.MeshStandardMaterial({ color: '#fffdf5', roughness: 0.58 }));
  label.position.set(-side * 0.19, body.position.y, 0);
  group.add(label);
  const cap = new THREE.Mesh(capGeometry, new THREE.MeshStandardMaterial({ color: product.capPalette, roughness: 0.23, metalness: 0.2 }));
  cap.position.y = body.position.y + featuredGeometry.parameters.height / 2 + 0.047;
  group.add(cap);
  group.position.set(side * (AISLE_CONFIG.shelfFront + 0.29 + Math.abs(offset) * 0.035), AISLE_CONFIG.shelfLevels[level] + 0.09, z + offset);
  group.rotation.y = side * 0.045;
  group.userData = { material, baseY: group.position.y, baseScale: 1.14 };
  group.scale.setScalar(group.userData.baseScale);
  return group;
}

function createStockBatch(scene, stock, placements) {
  const definition = stockGeometry[stock.format];
  const bodyMaterial = stock.format === 'glass-bottle'
    ? new THREE.MeshPhysicalMaterial({ color: stock.palette, roughness: 0.17, transmission: 0.14, thickness: 0.08, transparent: true, opacity: 0.68, clearcoat: 0.45 })
    : new THREE.MeshStandardMaterial({ color: stock.palette, roughness: 0.42, metalness: 0.04 });
  const labelMaterial = new THREE.MeshStandardMaterial({ color: '#f8f3e7', roughness: 0.75 });
  const body = new THREE.InstancedMesh(definition.geometry, bodyMaterial, placements.length);
  const labels = new THREE.InstancedMesh(stockLabelGeometry, labelMaterial, placements.length);
  const caps = definition.cap ? new THREE.InstancedMesh(capGeometry, new THREE.MeshStandardMaterial({ color: stock.capPalette, roughness: 0.3, metalness: 0.1 }), placements.length) : null;
  const matrix = new THREE.Matrix4();
  placements.forEach((placement, index) => {
    const x = placement.side * (AISLE_CONFIG.shelfFront + 0.34 + placement.depth);
    const y = AISLE_CONFIG.shelfLevels[placement.level] + 0.09;
    matrix.makeTranslation(x, y + definition.height / 2, placement.z);
    body.setMatrixAt(index, matrix);
    matrix.makeTranslation(x - placement.side * (definition.height > 0.4 ? 0.15 : 0.12), y + definition.height / 2, placement.z);
    labels.setMatrixAt(index, matrix);
    if (caps) {
      matrix.makeTranslation(x, y + definition.height + 0.045, placement.z);
      caps.setMatrixAt(index, matrix);
    }
  });
  body.instanceMatrix.needsUpdate = true;
  labels.instanceMatrix.needsUpdate = true;
  if (caps) caps.instanceMatrix.needsUpdate = true;
  scene.add(body, labels);
  if (caps) scene.add(caps);
}

function createStock(scene) {
  const placements = SHELF_STOCK.map(() => []);
  const shelfSlots = [-2.55, -1.15, 1.15, 2.55];
  for (let bay = 0; bay < AISLE_CONFIG.bayCount; bay += 1) {
    const bayZ = AISLE_CONFIG.entranceBayZ - bay * AISLE_CONFIG.baySpacing;
    [-1, 1].forEach((side) => {
      AISLE_CONFIG.shelfLevels.forEach((_, level) => {
        shelfSlots.forEach((offset, slot) => {
          const stockIndex = (bay * 3 + level * 2 + slot + (side > 0 ? 1 : 0)) % SHELF_STOCK.length;
          placements[stockIndex].push({ side, level, z: bayZ + offset, depth: ((bay + slot + level) % 3) * 0.025 });
        });
      });
    });
  }
  SHELF_STOCK.forEach((stock, index) => createStockBatch(scene, stock, placements[index]));
}

export function createProductSystem(scene) {
  const shelfProducts = new THREE.Group();
  const focusItems = [];
  scene.add(shelfProducts);
  createStock(scene);
  PRODUCTS.forEach((product, index) => {
    const z = AISLE_CONFIG.entranceBayZ - index * AISLE_CONFIG.baySpacing;
    const { side, level } = product.placement;
    [-0.42, 0, 0.42].forEach((offset) => {
      const item = createFeaturedProduct(product, side, level, z, offset);
      shelfProducts.add(item);
      if (offset === 0) {
        const shelfLight = new THREE.PointLight('#dff6ff', 0, 4.2, 2);
        shelfLight.position.set(side * 4.2, AISLE_CONFIG.shelfLevels[level] + 1.12, z);
        scene.add(shelfLight);
        focusItems.push({ product, item, shelfLight, side, z, intensity: 0 });
      }
    });
  });
  return {
    update(travelZ, delta) {
      let active = null;
      focusItems.forEach((entry) => {
        const distance = travelZ - entry.z;
        const approach = 1 - smoothstep(2.2, 7.4, distance);
        const departure = smoothstep(-3.2, -0.25, distance);
        const targetIntensity = approach * departure;
        entry.intensity = lerp(entry.intensity, targetIntensity, Math.min(delta * 7.5, 1));
        entry.item.position.y = lerp(entry.item.position.y, entry.item.userData.baseY + entry.intensity * 0.2, Math.min(delta * 8, 1));
        entry.item.scale.setScalar(entry.item.userData.baseScale * (1 + entry.intensity * 0.1));
        entry.item.userData.material.emissiveIntensity = entry.intensity * 0.4;
        entry.shelfLight.intensity = entry.intensity * 3.7;
        if (!active || entry.intensity > active.intensity) active = entry;
      });
      if (!active || active.intensity < 0.015) return { intensity: 0 };
      return { product: active.product, side: active.side, intensity: active.intensity };
    }
  };
}
