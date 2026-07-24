import * as THREE from 'three';

export function createEntranceUI({ onEnter, scene, camera, canvas }) {
  const button = document.querySelector('#door-open-accessible');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let state = 'entrance';
  let touchStartY = 0;
  const requestEnter = () => { if (state === 'entrance') onEnter(); };
  button.addEventListener('click', requestEnter);
  canvas.addEventListener('pointerup', (event) => {
    if (state === 'entrance') requestEnter();
  });
  window.addEventListener('wheel', (event) => { if (state !== 'shopping' && event.deltaY > 12) { event.preventDefault(); requestEnter(); } }, { passive: false });
  window.addEventListener('touchstart', (event) => { touchStartY = event.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (event) => { if (state !== 'shopping' && touchStartY - event.changedTouches[0].clientY > 28) requestEnter(); }, { passive: true });
  return { setState(nextState) { state = nextState; } };
}
