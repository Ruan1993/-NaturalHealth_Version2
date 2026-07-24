import * as THREE from 'three';
import { lerp, mapRange } from './helpers.js';
import { STORE_LENGTH } from './data.js';

const MAX_FOCUS_ROTATION = THREE.MathUtils.degToRad(15);

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.set(0, 1.66, 8);
  return camera;
}

export function createCameraWalker(camera) {
  const target = new THREE.Vector3(0, 1.66, 8);
  let progress = 0;
  let velocity = 0;
  let elapsed = 0;
  let focus = { intensity: 0, side: 0 };
  return {
    setProgress(nextProgress, scrollVelocity = 0) { progress = nextProgress; velocity = scrollVelocity; },
    setFocus(nextFocus = {}) {
      focus = {
        intensity: Number.isFinite(nextFocus.intensity) ? nextFocus.intensity : 0,
        side: Number.isFinite(nextFocus.side) ? nextFocus.side : 0
      };
    },
    getTravelZ() { return 8 - progress * STORE_LENGTH; },
    update(delta) {
      elapsed += delta;
      target.z = this.getTravelZ();
      const walking = Math.min(Math.abs(velocity) * 0.012, 1);
      const stride = elapsed * (2.1 + walking * 4.2);
      const bob = Math.sin(stride * 2) * 0.012 * walking;
      const sway = Math.sin(stride) * 0.012 * walking;
      const focusRotation = focus.intensity * focus.side * -MAX_FOCUS_ROTATION;
      const travelRotation = mapRange(velocity, -80, 80, -0.01, 0.01);
      camera.position.x = lerp(camera.position.x, sway, Math.min(delta * 3.9, 1));
      camera.position.y = lerp(camera.position.y, 1.66 + bob, Math.min(delta * 4.2, 1));
      camera.position.z = lerp(camera.position.z, target.z, Math.min(delta * 3.6, 1));
      camera.rotation.z = lerp(camera.rotation.z, -sway * 0.35, Math.min(delta * 3, 1));
      camera.rotation.y = lerp(camera.rotation.y, focusRotation + travelRotation, Math.min(delta * 2.8, 1));
    }
  };
}
