// 카드 중심에 가까울수록 카드가 앞으로 나오고 조금 커지고 빛이 강해진다.
// 가장자리로 갈수록 카드는 원래자리로 돌아가고 원래 크기에 가까워지고 빛이 약해진다.
// distanceFromCenter 1 -> 가장자리에 가까움(중심에서 멀어짐) 원래자리, 원래크기, 약해지는 빛
// influence 1 -> 중심에 가까움 카드 위치, 크기, 빛

import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(3, 3);
const material = new THREE.MeshStandardMaterial({
  color: 0x999999,
  roughness: 0.4,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

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
  let targetScale = 1;
  let targetLightX = 0;
  let targetLightY = 0;
  let targetLightIntensity = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 1.5;
    const normalizedY = Math.abs(localPoint.y) / 1.5;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    targetZ = influence * 0.3;
    targetScale = 1 + influence * 0.08;
    targetLightX = localPoint.x;
    targetLightY = localPoint.y;
    targetLightIntensity = 3 * influence;
    targetRotationX = localPoint.y * 0.5;
    targetRotationY = -localPoint.x * 0.5;
  }

  card.position.z += (targetZ - card.position.z) * 0.05;
  card.scale.x += (targetScale - card.scale.x) * 0.05;
  card.scale.y += (targetScale - card.scale.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;
  pointLight.position.x += (targetLightX - pointLight.position.x) * 0.05;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;

  renderer.render(scene, camera);

}
animate();