import * as THREE from 'three';

export function addLighting(scene) {
  scene.add(new THREE.HemisphereLight('#d7e2ca', '#0b160f', 1.25));
  const key = new THREE.DirectionalLight('#f7e8bd', 2.5); key.position.set(0, 8, 4); key.castShadow = false; scene.add(key);
  const warm = new THREE.PointLight('#e0b779', 22, 32, 2); warm.position.set(0, 3.8, 2); scene.add(warm);
  return { warm };
}
