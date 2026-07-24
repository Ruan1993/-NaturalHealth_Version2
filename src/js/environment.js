import * as THREE from 'three';
import { AISLE_CONFIG, AISLE_CATALOG } from './data.js';

const material = (color, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const addMesh = (parent, geometry, meshMaterial, position) => {
  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.position.copy(position);
  parent.add(mesh);
  return mesh;
};

function createShelfBay(side, z, category) {
  const shelf = new THREE.Group();
  shelf.position.set(side * AISLE_CONFIG.shelfCentre, 0, z);
  const oak = material('#c99c66', 0.57);
  const oakEdge = material('#9c714a', 0.48);
  const sageBack = material('#b9cbb9', 0.86);
  const brass = material('#b69562', 0.38, 0.55);
  const shelfWidth = 2.55;

  addMesh(shelf, new THREE.BoxGeometry(0.08, 4.95, AISLE_CONFIG.bayDepth), sageBack, new THREE.Vector3(side * 1.15, 2.45, 0));
  [-1, 1].forEach((end) => addMesh(shelf, new THREE.BoxGeometry(0.17, 5.08, 0.17), oakEdge, new THREE.Vector3(side * 1.08, 2.54, end * 3.66)));
  AISLE_CONFIG.shelfLevels.forEach((level) => {
    addMesh(shelf, new THREE.BoxGeometry(shelfWidth, 0.14, 7.32), oak, new THREE.Vector3(0, level, 0));
    addMesh(shelf, new THREE.BoxGeometry(shelfWidth, 0.07, 0.1), oakEdge, new THREE.Vector3(-side * 0.01, level - 0.055, -0.01));
  });
  addMesh(shelf, new THREE.BoxGeometry(shelfWidth, 0.14, 7.32), oak, new THREE.Vector3(0, 4.95, 0));
  addMesh(shelf, new THREE.BoxGeometry(0.12, 0.46, 1.92), brass, new THREE.Vector3(-side * 1.22, 4.52, 0));
  shelf.userData.category = category.category;
  return shelf;
}

export function createEnvironment(scene) {
  const world = new THREE.Group();
  scene.add(world);
  const { length, bayCount } = AISLE_CONFIG;
  const stone = material('#ddd8cc', 0.38, 0.04);
  const ceiling = material('#f8f4ea', 0.92);
  const wallMaterial = material('#e6eee7', 0.9);

  const floor = addMesh(world, new THREE.PlaneGeometry(22, length + 26), stone, new THREE.Vector3(0, 0, -length / 2 + 5));
  floor.rotation.x = -Math.PI / 2;
  const ceilingMesh = addMesh(world, new THREE.PlaneGeometry(22, length + 26), ceiling, new THREE.Vector3(0, 6.6, -length / 2 + 5));
  ceilingMesh.rotation.x = Math.PI / 2;
  [-1, 1].forEach((side) => {
    const wall = addMesh(world, new THREE.PlaneGeometry(length + 26, 6.6), wallMaterial, new THREE.Vector3(side * 7.15, 3.3, -length / 2 + 5));
    wall.rotation.y = side * Math.PI / 2;
  });

  const seamMaterial = material('#c8c1b3', 0.5);
  for (let z = 9; z > -length - 6; z -= 4) addMesh(world, new THREE.BoxGeometry(12.6, 0.012, 0.025), seamMaterial, new THREE.Vector3(0, 0.012, z));

  const skyMaterial = new THREE.MeshBasicMaterial({ color: '#effaff' });
  for (let z = 2; z > -length; z -= 8) {
    addMesh(world, new THREE.BoxGeometry(3.1, 0.05, 2.3), skyMaterial, new THREE.Vector3(0, 6.52, z));
    const frame = addMesh(world, new THREE.BoxGeometry(3.28, 0.1, 2.48), material('#e5d6bd', 0.55), new THREE.Vector3(0, 6.47, z));
    frame.scale.y = 0.55;
  }

  const sunbeamMaterial = new THREE.MeshBasicMaterial({ color: '#fff6d8', transparent: true, opacity: 0.055, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  [-6, -30, -54].forEach((z, index) => {
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 6.1), sunbeamMaterial);
    beam.position.set(-1.8 + index * 1.1, 3.2, z);
    beam.rotation.y = -0.32;
    world.add(beam);
  });

  for (let index = 0; index < bayCount; index += 1) {
    const z = AISLE_CONFIG.entranceBayZ - index * AISLE_CONFIG.baySpacing;
    const category = AISLE_CATALOG[index % AISLE_CATALOG.length];
    [-1, 1].forEach((side) => world.add(createShelfBay(side, z, category)));
  }

  const endGlow = new THREE.Mesh(new THREE.PlaneGeometry(12, 6.2), new THREE.MeshBasicMaterial({ color: '#cce9f2', transparent: true, opacity: 0.23, depthWrite: false }));
  endGlow.position.set(0, 3.15, -length - 4);
  world.add(endGlow);
  return world;
}
