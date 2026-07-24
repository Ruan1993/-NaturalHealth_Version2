import * as THREE from 'three';

export function addLighting(scene) {
  scene.add(new THREE.HemisphereLight('#edf8ff', '#c7d6c8', 2.05));

  const sunlight = new THREE.DirectionalLight('#fff4d7', 2.7);
  sunlight.position.set(-4, 10, 7);
  scene.add(sunlight);

  const skylight = new THREE.DirectionalLight('#d9f0fa', 1.15);
  skylight.position.set(2, 8, -35);
  scene.add(skylight);

  const entryGlow = new THREE.PointLight('#fff3d8', 18, 23, 2);
  entryGlow.position.set(0, 4.7, 5);
  scene.add(entryGlow);
  return { sunlight, skylight, entryGlow };
}
