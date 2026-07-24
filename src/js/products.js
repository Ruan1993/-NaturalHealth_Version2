import * as THREE from 'three';
import { AISLE_CONFIG, PRODUCTS } from './data.js';
import { clamp, lerp } from './helpers.js';

const bottleGeometry = new THREE.CylinderGeometry(0.16, 0.19, 0.67, 12);
const labelGeometry = new THREE.BoxGeometry(0.014, 0.14, 0.27);
const capGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.09, 12);
const smoothstep = (start, end, value) => {
  const normalized = clamp((value - start) / (end - start), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

function createBottleMaterial(color) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.16, metalness: 0, transmission: 0.18, thickness: 0.12, transparent: true, opacity: 0.66, emissive: new THREE.Color(color), emissiveIntensity: 0 });
}

function createProduct(product, side, level, z, offset = 0) {
  const group = new THREE.Group();
  const material = createBottleMaterial(product.palette);
  const body = new THREE.Mesh(bottleGeometry, material);
  body.position.y = bottleGeometry.parameters.height / 2;
  group.add(body);
  const label = new THREE.Mesh(labelGeometry, new THREE.MeshStandardMaterial({ color: '#f8f5ec', roughness: 0.72 }));
  label.position.set(-side * 0.17, body.position.y, 0);
  group.add(label);
  const cap = new THREE.Mesh(capGeometry, new THREE.MeshStandardMaterial({ color: product.capPalette, roughness: 0.3, metalness: 0.12 }));
  cap.position.y = body.position.y + bottleGeometry.parameters.height / 2 + 0.045;
  group.add(cap);
  group.position.set(side * (AISLE_CONFIG.shelfFront + 0.28 + Math.abs(offset) * 0.035), AISLE_CONFIG.shelfLevels[level] + 0.09, z + offset);
  group.rotation.y = side * 0.045;
  group.userData = { product, material, baseY: group.position.y };
  return group;
}

export function createProductSystem(scene) {
  const shelfProducts = new THREE.Group();
  const focusItems = [];
  scene.add(shelfProducts);
  PRODUCTS.forEach((product, index) => {
    const z = AISLE_CONFIG.entranceBayZ - index * AISLE_CONFIG.baySpacing;
    const { side, level } = product.placement;
    [-0.42, 0, 0.42].forEach((offset) => {
      const item = createProduct(product, side, level, z, offset);
      shelfProducts.add(item);
      if (offset === 0) {
        const shelfLight = new THREE.PointLight('#dff6ff', 0, 4.2, 2);
        shelfLight.position.set(side * 4.2, AISLE_CONFIG.shelfLevels[level] + 1.05, z);
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
        entry.item.position.y = lerp(entry.item.position.y, entry.item.userData.baseY + entry.intensity * 0.18, Math.min(delta * 8, 1));
        entry.item.scale.setScalar(1 + entry.intensity * 0.08);
        entry.item.userData.material.emissiveIntensity = entry.intensity * 0.32;
        entry.shelfLight.intensity = entry.intensity * 3.4;
        if (!active || entry.intensity > active.intensity) active = entry;
      });
      if (!active || active.intensity < 0.015) return { intensity: 0 };
      return { product: active.product, side: active.side, intensity: active.intensity };
    }
  };
}
