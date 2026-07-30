// 마우스가 카드의 중심일수록 앞으로 나오고, 가장자리로 갈수록 원래 자리로 돌아간다
// 중심에 위치할수록 influence 값은 1, 가장자리에 가까울수록 influence는 0

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshBasicMaterial({
  color: 0x222222,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
const localPoint = new THREE.Vector3();

let isHovered = false;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetZ = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x);
    const normalizedY = Math.abs(localPoint.y) / 1.25;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    targetZ = influence * 0.3;

    console.log({
      influence,
      targetZ
    });

  }
  card.position.z += (targetZ - card.position.z) * 0.05;

  renderer.render(scene, camera);
}

animate();