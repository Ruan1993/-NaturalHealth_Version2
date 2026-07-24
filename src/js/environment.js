import * as THREE from 'three';

const material = (color, roughness = .7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

export function createEnvironment(scene) {
  const world = new THREE.Group(); scene.add(world);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 150), material('#45473e', .38, .15)); floor.rotation.x = -Math.PI / 2; floor.position.z = -43; world.add(floor);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(36, 150), material('#15271e', .9)); ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, 6.4, -43); world.add(ceiling);
  const wallMaterial = material('#1c3328', .88);
  [-1, 1].forEach(side => { const wall = new THREE.Mesh(new THREE.PlaneGeometry(150, 6.4), wallMaterial); wall.rotation.y = side * Math.PI / 2; wall.position.set(side * 8.5, 3.2, -43); world.add(wall); });
  const wood = material('#624b30', .68); const darkWood = material('#2b251c', .73);
  for (let z = 4; z > -100; z -= 8) {
    [-1, 1].forEach(side => {
      const shelf = new THREE.Group(); shelf.position.set(side * 5.9, 0, z);
      const upright = new THREE.Mesh(new THREE.BoxGeometry(.16, 4.6, 6.8), darkWood); upright.position.set(side * 1.15, 2.3, 0); shelf.add(upright);
      for (let y = .65; y < 4.4; y += 1.15) { const plank = new THREE.Mesh(new THREE.BoxGeometry(2.6, .13, 6.7), wood); plank.position.set(0, y, 0); shelf.add(plank); }
      world.add(shelf);
    });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(11.6, .18, .18), material('#bf9e65', .35, .45)); frame.position.set(0, 6.0, z); world.add(frame);
    const luminaire = new THREE.Mesh(new THREE.BoxGeometry(1.45, .05, .38), new THREE.MeshBasicMaterial({ color: '#ffe5b3' })); luminaire.position.set(0, 5.85, z - 2); world.add(luminaire);
    const light = new THREE.PointLight('#ffe0ae', 7, 11, 2); light.position.set(0, 5.4, z - 2); world.add(light);
  }
  const entrance = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ color: '#b28952', transparent: true, opacity: .07 })); entrance.position.set(0, 3, -105); world.add(entrance);
  return world;
}
