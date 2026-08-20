import * as THREE from 'three';
import { int } from 'three/src/nodes/tsl/TSLCore.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(4, 4);
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
  mouse.x = (event.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight)  * 2 + 1;
});

const raycaster = new THREE.Raycaster();
const localPoint = new THREE.Vector3();

let isHovered = false;
// 중앙근처 거의 움직이지 않음  거의 회전하지 않음
// 가장자리 이동은 천천히 커짐, 회전은 더 강하게 커짐
function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetX = 0;
  let targetY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 2;
    const normalizedY = Math.abs(localPoint.y) / 2;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const threshold = 0.4;
    const edgeStrength = Math.max(0, (distanceFromCenter - threshold)/(1 - threshold));
    const strongStrength = edgeStrength * edgeStrength;
    const centerStrength = 1 - edgeStrength;

    targetX = localPoint.x * edgeStrength * 0.4;
    targetY = localPoint.y * edgeStrength * 0.4;
    targetRotationX = localPoint.y * strongStrength * 0.4;
    targetRotationY = -localPoint.x * strongStrength * 0.4;
  }

  card.position.x += (targetX - card.position.x) * 0.04;
  card.position.y += (targetY - card.position.y) * 0.04;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.04;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.04;

  renderer.render(scene, camera);
}
animate();