// input -> state -> target -> lerp -> render

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.1, // 0~1 사이의 숫자 숫자가 작을수록 포인트 영역이 더 선명해지고 빛이 모여지고 1에 가까울수록 퍼져보인다.
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);

scene.add(card);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
const localPoint = new THREE.Vector3();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(ambientLight);
card.add(pointLight);
pointLight.position.z = 1;
// 카드와 포인트라이트 사이의 거리가 너무 멀면 빛 도달이 적어 어둡다.

let isHovered = false;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  let targetLightX = 0;
  let targetLightY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetLightIntensity = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    targetLightX = localPoint.x;
    targetLightY = localPoint.y;
    targetLightIntensity = 3;
    targetRotationX = localPoint.y * 0.3;
    targetRotationY = -localPoint.x * 0.3;
  }

  card.rotation.x += (targetRotationX - card.rotation.x) * 0.07;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.07;
  pointLight.position.x += (targetLightX - pointLight.position.x) * 0.05;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;
  renderer.render(scene, camera);
}

animate();