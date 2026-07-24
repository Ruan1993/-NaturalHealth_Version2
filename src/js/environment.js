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

export function createEnvironment(scene, renderer) {
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


  for (let index = 0; index < bayCount; index += 1) {
    const z = AISLE_CONFIG.entranceBayZ - index * AISLE_CONFIG.baySpacing;
    const category = AISLE_CATALOG[index % AISLE_CATALOG.length];
    [-1, 1].forEach((side) => world.add(createShelfBay(side, z, category)));
  }

  const doors = new THREE.Group();
  const doorPanels = [];
  const oak = material('#bd9060', .38, .08);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#dcefea', roughness: .12, metalness: .04, transmission: .24, transparent: true, opacity: .48, clearcoat: .35 });
  [-1, 1].forEach((side) => {
    const panel = new THREE.Group();
    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(3.05, 4.5, .08), glass);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.2, .12, .16), oak);
    panel.add(glassPanel); rail.position.y = 2.2; panel.add(rail);
    [-1, 1].forEach((edge) => { const stile = new THREE.Mesh(new THREE.BoxGeometry(.1, 4.58, .15), oak); stile.position.x = edge * 1.55; panel.add(stile); });
    const handle = new THREE.Mesh(new THREE.BoxGeometry(.1, .7, .12), new THREE.MeshStandardMaterial({ color: '#bd9764', roughness: .24, metalness: .45 }));
    handle.position.set(side < 0 ? 1.38 : -1.38, 0, -.1);
    handle.userData.isEntranceHandle = true;
    panel.add(handle);
    const hitArea = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.05, .42), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hitArea.position.copy(handle.position); hitArea.userData.isEntranceHandle = true; panel.add(hitArea);
    panel.position.set(side * 1.55, 2.25, 10.2); doors.add(panel);
    doorPanels.push(panel);
  });
  const logoTexture = new THREE.TextureLoader().load('/images/NATURAL HEALTH LOGO DECAL.png');
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
  logoTexture.magFilter = THREE.LinearFilter;
  logoTexture.generateMipmaps = true;
  logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const logoWidth = 1.55;
  const logoHeight = logoWidth / (3385 / 2174);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(logoWidth, logoHeight), new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, opacity: 1, depthWrite: false, toneMapped: false }));
  logo.position.set(-.3, .18, .11);
  doorPanels[0].add(logo);
  const rightLogo = new THREE.Mesh(new THREE.PlaneGeometry(logoWidth, logoHeight), new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, opacity: 1, depthWrite: false, toneMapped: false }));
  rightLogo.scale.setScalar(.88); rightLogo.position.set(.3, .18, .11); doorPanels[1].add(rightLogo);
  const header = new THREE.Mesh(new THREE.BoxGeometry(7.1, .24, .25), oak); header.position.set(0, 4.7, 10.2); doors.add(header);
  const insideLight = new THREE.PointLight('#fff4d8', 1.8, 16, 2); insideLight.position.set(0, 3.8, 7.5); doors.add(insideLight);
  world.add(doors);
  const facadeMaterial = material('#ddd4c2', .78);
  [-1, 1].forEach((side) => {
    const facade = new THREE.Mesh(new THREE.BoxGeometry(3.5, 5.85, .28), facadeMaterial); facade.position.set(side * 5.35, 2.92, 10.32); world.add(facade);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(3.56, .1, .34), oak); trim.position.set(side * 5.35, 5.52, 10.49); world.add(trim);
  });
  const sign = new THREE.Group(); sign.position.set(0, 5.25, 10.48);
  const signBacking = new THREE.Mesh(new THREE.BoxGeometry(6.1, .78, .18), material('#e4d2b4', .48)); signBacking.position.set(0, 0, 0); sign.add(signBacking);
  const signCanvas = document.createElement('canvas'); signCanvas.width = 2560; signCanvas.height = 400;
  const signContext = signCanvas.getContext('2d'); signContext.fillStyle = '#f4e7d4'; signContext.fillRect(0, 0, 2560, 400); signContext.fillStyle = '#d2ae78'; signContext.fillRect(22, 22, 2516, 5); signContext.fillStyle = '#123d2d'; signContext.textAlign = 'center'; signContext.font = '138px Georgia'; signContext.fillText('@Natural Health', 1280, 164); signContext.fillStyle = '#405b4e'; signContext.font = '38px Arial'; signContext.fillText('Fresh living, from the heart of the Overberg.', 1280, 278);
  const signTexture = new THREE.CanvasTexture(signCanvas); signTexture.colorSpace = THREE.SRGBColorSpace; signTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(5.82, .6), new THREE.MeshBasicMaterial({ map: signTexture, toneMapped: false })); signFace.position.set(0, 0, .125); sign.add(signFace); world.add(sign);
  const landscaping = new THREE.Group();
  const stoneMaterial = material('#d8d0be', .72); const bedMaterial = material('#b6a889', .92); const ceramicMaterial = material('#e8e2d5', .55); const greens = [material('#4e7d5e', .66), material('#73966b', .72), material('#9aab72', .7)]; greens.forEach((plantMaterial) => { plantMaterial.side = THREE.DoubleSide; });
  const pathMaterial = material('#ded2bc', .64); const path = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 10), pathMaterial); path.rotation.x = -Math.PI / 2; path.position.set(0, .025, 14); landscaping.add(path);
  for (let z = 9.8; z < 18.5; z += 1.35) { const slab = new THREE.Mesh(new THREE.BoxGeometry(5.15, .035, 1.16), pathMaterial); slab.position.set(0, .045, z); landscaping.add(slab); }
  [[-4.2, 13.8, 2.4, 7.6], [4.2, 13.7, 2.35, 7.2]].forEach(([x, z, w, d]) => { const bed = new THREE.Mesh(new THREE.BoxGeometry(w, .18, d), bedMaterial); bed.position.set(x, .08, z); landscaping.add(bed); });
  const leafShape = new THREE.Shape(); leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(-.23, .35, -.13, .88); leafShape.quadraticCurveTo(-.06, 1.18, 0, 1.42); leafShape.quadraticCurveTo(.08, 1.14, .18, .76); leafShape.quadraticCurveTo(.24, .34, 0, 0);
  const grassShape = new THREE.Shape(); grassShape.moveTo(0, 0); grassShape.quadraticCurveTo(-.045, .32, -.02, .78); grassShape.quadraticCurveTo(.025, .46, 0, 0);
  const leafGeometry = new THREE.ShapeGeometry(leafShape, 5); const grassGeometry = new THREE.ShapeGeometry(grassShape, 3); const stemGeometry = new THREE.CylinderGeometry(.018, .028, 1, 5); const shrubGeometry = new THREE.IcosahedronGeometry(.22, 1);
  const addStem = (group, height, angle, radius = .018) => { const stem = new THREE.Mesh(stemGeometry, greens[0]); stem.scale.set(radius / .018, height, radius / .018); stem.position.y = height * .5; stem.rotation.z = angle; group.add(stem); };
  const addLeaf = (group, index, height, spread, leafScale = 1, materialIndex = 0) => { const leaf = new THREE.Mesh(leafGeometry, greens[materialIndex % greens.length]); const direction = index * 2.399 + .35; leaf.position.set(Math.sin(direction) * spread, height * .22, Math.cos(direction) * spread); leaf.rotation.y = -direction; leaf.rotation.z = .5 + (index % 3) * .1; leaf.scale.set(leafScale, height / 1.42, leafScale); group.add(leaf); };
  const addBroadLeaf = (x, z, scale, hideOnPortrait = false, leafCount = 7) => { const group = new THREE.Group(); group.position.set(x, .18, z); group.scale.setScalar(scale); group.userData.hideOnPortrait = hideOnPortrait; for (let i = 0; i < leafCount; i += 1) { const height = .9 + (i % 3) * .18; addStem(group, height * .56, Math.sin(i * 1.8) * .16); addLeaf(group, i, height, .06 + (i % 2) * .035, .8 + (i % 2) * .12, i + 1); } landscaping.add(group); };
  const addGrassTuft = (x, z, scale, hideOnPortrait = false) => { const group = new THREE.Group(); group.position.set(x, .18, z); group.scale.setScalar(scale); group.userData.hideOnPortrait = hideOnPortrait; for (let i = 0; i < 13; i += 1) { const blade = new THREE.Mesh(grassGeometry, greens[(i + 1) % greens.length]); const direction = i * 2.17; blade.position.set(Math.sin(direction) * .18, 0, Math.cos(direction) * .18); blade.rotation.y = -direction; blade.rotation.z = .24 + (i % 4) * .08; blade.scale.set(.72, .7 + (i % 3) * .13, 1); group.add(blade); } landscaping.add(group); };
  const addShrub = (x, z, scale, hideOnPortrait = false) => { const group = new THREE.Group(); group.position.set(x, .18, z); group.scale.setScalar(scale); group.userData.hideOnPortrait = hideOnPortrait; for (let i = 0; i < 10; i += 1) { const bush = new THREE.Mesh(shrubGeometry, greens[i % greens.length]); bush.position.set(Math.sin(i * 2.17) * (.17 + (i % 2) * .08), .18 + (i % 3) * .12, Math.cos(i * 2.17) * (.17 + (i % 2) * .08)); bush.scale.set(1 + (i % 2) * .22, .8 + (i % 3) * .14, 1); group.add(bush); } landscaping.add(group); };
  const addPalm = (x, z, scale, hideOnPortrait = false) => { const group = new THREE.Group(); group.position.set(x, .18, z); group.scale.setScalar(scale); group.userData.hideOnPortrait = hideOnPortrait; const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.045, .065, 1.18, 7), material('#92785a', .82)); trunk.position.y = .59; trunk.rotation.z = -.08; group.add(trunk); for (let i = 0; i < 8; i += 1) { const frond = new THREE.Mesh(leafGeometry, greens[(i + 1) % greens.length]); const direction = i * Math.PI / 4 + .18; frond.position.set(Math.sin(direction) * .05, 1.08, Math.cos(direction) * .05); frond.rotation.y = -direction; frond.rotation.z = 1.04 + (i % 2) * .1; frond.scale.set(.62, .92, 1); group.add(frond); } landscaping.add(group); };
  addBroadLeaf(-4.65, 12.2, 1.18, true, 8); addShrub(-4.1, 15.85, 1.02, true); addGrassTuft(-3.42, 14.42, .92, true); addBroadLeaf(-4.72, 13.15, .72, true, 5);
  addPalm(4.32, 12.75, .96, true); addBroadLeaf(3.68, 14.6, .92, true, 6); addShrub(4.55, 16.15, .86, true); addGrassTuft(3.62, 15.7, .78, true);
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(.34, .42, .58, 12), ceramicMaterial); planter.position.set(-3.2, .29, 10.9); landscaping.add(planter); addBroadLeaf(-3.2, 10.9, .56, false, 5);
  addBroadLeaf(-4.78, 12.9, .66, false, 5); addPalm(4.8, 13.05, .58, false);
  const fountain = new THREE.Group(); fountain.position.set(4.55, .18, 11.15); fountain.userData.hideOnPortrait = true; const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.76, .88, .28, 16), stoneMaterial); bowl.position.y = .14; fountain.add(bowl); const water = new THREE.Mesh(new THREE.CylinderGeometry(.65, .65, .025, 16), new THREE.MeshPhysicalMaterial({ color: '#79b8c1', roughness: .18, transmission: .2, clearcoat: .45 })); water.position.y = .3; fountain.add(water); const bubble = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), new THREE.MeshBasicMaterial({ color: '#b7e4e1', transparent: true, opacity: .72 })); bubble.position.y = .48; fountain.add(bubble); landscaping.add(fountain);
  world.add(landscaping);
  return {
    world,
    entrance: {
      setOpen(progress) {
        doorPanels[0].position.x = -1.55 - progress * 1.7;
        doorPanels[1].position.x = 1.55 + progress * 1.7;
        insideLight.intensity = 1.8 + progress * 2.2;
      },
      setResponsive(aspect) {
        const portrait = aspect < .8;
        logo.scale.setScalar(portrait ? .72 : 1);
        logo.position.x = portrait ? .12 : -.3;
        rightLogo.scale.setScalar(portrait ? .63 : .88);
        rightLogo.position.x = portrait ? -.02 : .3;
        sign.scale.setScalar(portrait ? .9 : 1);
        landscaping.children.forEach((item) => { item.visible = !portrait || !item.userData.hideOnPortrait; });
      }
    }
  };
}
