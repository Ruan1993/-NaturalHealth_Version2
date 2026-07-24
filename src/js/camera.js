import * as THREE from 'three';
import { lerp, mapRange } from './helpers.js';
import { STORE_LENGTH } from './data.js';

const MAX_FOCUS_ROTATION = THREE.MathUtils.degToRad(15);
const EYE_HEIGHT = 1.56;
const ENTRANCE_POSITION = new THREE.Vector3(0, 1.76, 17);
const STORE_POSITION = new THREE.Vector3(0, EYE_HEIGHT, 8);

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.copy(ENTRANCE_POSITION);
  return camera;
}

export function createCameraWalker(camera) {
  const target = STORE_POSITION.clone();
  const status = { state: 'entrance', entranceProgress: 0 };
  let progress = 0;
  let velocity = 0;
  let elapsed = 0;
  let focus = { intensity: 0, side: 0 };
  let transitionElapsed = 0;
  let transitionDuration = 1.9;
  let entranceFov = 54;
  let entrancePitch = THREE.MathUtils.degToRad(6);
  return {
    setProgress(nextProgress, scrollVelocity = 0) { if (status.state === 'shopping') { progress = nextProgress; velocity = scrollVelocity; } },
    setFocus(nextFocus = {}) { focus = { intensity: Number.isFinite(nextFocus.intensity) ? nextFocus.intensity : 0, side: Number.isFinite(nextFocus.side) ? nextFocus.side : 0 }; },
    enter(duration = 1.9) { if (status.state !== 'entrance') return false; status.state = 'entering'; transitionDuration = duration; transitionElapsed = 0; return true; },
    updateViewport(aspect) { const portrait = aspect < .8; entranceFov = portrait ? 63 : 56; entrancePitch = THREE.MathUtils.degToRad(portrait ? 5.5 : 6); ENTRANCE_POSITION.set(0, portrait ? 1.7 : 1.76, portrait ? 21.4 : 17); if (status.state !== 'shopping') { camera.position.copy(ENTRANCE_POSITION); camera.rotation.x = entrancePitch; camera.fov = entranceFov; camera.updateProjectionMatrix(); } },
    getTravelZ() { return 8 - progress * STORE_LENGTH; },
    update(delta) {
      if (status.state === 'entering') {
        transitionElapsed += delta;
        const linear = Math.min(transitionElapsed / transitionDuration, 1);
        const eased = linear * linear * (3 - 2 * linear);
        camera.position.lerpVectors(ENTRANCE_POSITION, STORE_POSITION, eased);
        camera.rotation.set(entrancePitch * (1 - eased), 0, 0);
        status.entranceProgress = eased;
        if (linear === 1) { status.state = 'shopping'; camera.fov = 54; camera.updateProjectionMatrix(); }
        return status;
      }
      if (status.state === 'entrance') return status;
      elapsed += delta;
      target.z = this.getTravelZ();
      const walking = Math.min(Math.abs(velocity) * 0.012, 1);
      const stride = elapsed * (2.1 + walking * 4.2);
      const bob = Math.sin(stride * 2) * 0.012 * walking;
      const sway = Math.sin(stride) * 0.012 * walking;
      const focusRotation = focus.intensity * focus.side * -MAX_FOCUS_ROTATION;
      camera.position.x = lerp(camera.position.x, sway, Math.min(delta * 3.9, 1));
      camera.position.y = lerp(camera.position.y, EYE_HEIGHT + bob, Math.min(delta * 4.2, 1));
      camera.position.z = lerp(camera.position.z, target.z, Math.min(delta * 2.15, 1));
      camera.rotation.z = lerp(camera.rotation.z, -sway * 0.35, Math.min(delta * 3, 1));
      camera.rotation.y = lerp(camera.rotation.y, focusRotation + mapRange(velocity, -80, 80, -0.01, 0.01), Math.min(delta * 2.8, 1));
      return status;
    }
  };
}
