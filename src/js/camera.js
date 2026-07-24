import * as THREE from 'three';
import { lerp, mapRange } from './helpers.js';
import { STORE_LENGTH } from './data.js';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, .1, 140);
  camera.position.set(0, 1.68, 8);
  return camera;
}

export function createCameraWalker(camera) {
  const target = new THREE.Vector3(0, 1.68, 8);
  let progress = 0;
  let velocity = 0;
  let elapsed = 0;
  return {
    setProgress(nextProgress, scrollVelocity = 0) { progress = nextProgress; velocity = scrollVelocity; },
    update(delta) {
      elapsed += delta;
      target.z = 8 - progress * STORE_LENGTH;
      const walking = Math.min(Math.abs(velocity) * .015, 1);
      const bob = Math.sin(elapsed * (2.2 + walking * 6)) * .018 * walking;
      const sway = Math.sin(elapsed * (1.1 + walking * 2)) * .014 * walking;
      camera.position.x = lerp(camera.position.x, sway, .075);
      camera.position.y = lerp(camera.position.y, 1.68 + bob, .075);
      camera.position.z = lerp(camera.position.z, target.z, .055);
      camera.rotation.z = lerp(camera.rotation.z, -sway * .7, .06);
      camera.rotation.y = lerp(camera.rotation.y, mapRange(velocity, -80, 80, -.012, .012), .04);
    }
  };
}
