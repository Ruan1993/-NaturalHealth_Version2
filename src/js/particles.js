import * as THREE from 'three';

export function createParticles(scene) {
  const count = 150;
  const positions = new Float32Array(count * 3);
  const drift = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 8;
    positions[index * 3 + 1] = 0.5 + Math.random() * 5.3;
    positions[index * 3 + 2] = 8 - Math.random() * 110;
    drift[index] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#fff8df', size: 0.026, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(points);
  return {
    update(time) {
      const elapsed = time * 0.00016;
      for (let index = 0; index < count; index += 1) positions[index * 3] += Math.sin(elapsed + drift[index]) * 0.00042;
      geometry.attributes.position.needsUpdate = true;
    }
  };
}
