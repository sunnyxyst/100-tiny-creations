// 카드 중심에서는 influence가 크므로 앞으로 나온다.
// 카드 가장자리에서는 localPoint 값이 커지므로 많이 기울어진다.
// 중심에서는 localPoint가 0에 가까워 회전이 거의 없다.

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
  mouse.y = -(event.clientY / window.innerHeight)* 2 + 1;
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
  let targetRotationX = 0;
  let targetRotationY = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);
    const normalizedX = Math.abs(localPoint.x) / 1;
    const normalizedY = Math.abs(localPoint.y) / 1.25;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    targetZ = influence * 0.25;
    targetRotationX = localPoint.y * 0.03
    targetRotationY = localPoint.x * 0.3;

    console.log({
      localX: localPoint.x,
      localY: localPoint.y,
      distanceFromCenter,
      influence,
      targetZ
    })
  }
  card.position.z += (targetZ - card.position.z) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;
  renderer.render(scene, camera);
}

animate();
