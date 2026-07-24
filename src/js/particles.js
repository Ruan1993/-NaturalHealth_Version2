import * as THREE from 'three';

export function createParticles(scene) {
  const count = 220; const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) { positions[i * 3] = (Math.random() - .5) * 13; positions[i * 3 + 1] = Math.random() * 5.6; positions[i * 3 + 2] = 9 - Math.random() * 112; }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#eed9a9', size: .022, transparent: true, opacity: .48, depthWrite: false })); scene.add(points);
  return { update(time) { points.rotation.y = Math.sin(time * .00008) * .02; } };
}
