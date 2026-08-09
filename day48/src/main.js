// 마우스를 좌우로 움직이면 카드가 좌우로 이동하고 조명이 더 강해진다
// 마우스를 위아래로 움직이면 카드가 위아래로 이동하고 카드가 더 크게 회전한다.
// normalizedX는 좌우로 얼마나 가장자리에 가까운지 나타낸다.
// normalizedY는 위아래로 얼마나 가장자리에 가까운지 나타낸다.
// normalizedX가 커질수록 좌우 이동과 라이트가 강해진다.
// normalizedY가 커질수록 위아래 이동과 회전이 강해진다.

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 3);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.3,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (event) =>{
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

  let targetX = 0;
  let targetY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetLightX = 0;
  let targetLightY = 0;
  let targetLightIntensity = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 1;
    const normalizedY = Math.abs(localPoint.y) / 1.5;


    targetX = localPoint.x * normalizedX * 0.3;
    targetY = localPoint.y * normalizedY * 0.3;
    targetLightX = localPoint.x;
    targetLightY = localPoint.y;
    targetRotationX = localPoint.y * normalizedY * 0.3;
    targetRotationY = -localPoint.x * 0.1;
    targetLightIntensity = normalizedX * 3;
  }

  card.position.x += (targetX - card.position.x) * 0.05;
  card.position.y += (targetY - card.position.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;

  pointLight.position.x += (targetLightX - pointLight.position.x) * 0.05;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;
  renderer.render(scene, camera);
}
animate();