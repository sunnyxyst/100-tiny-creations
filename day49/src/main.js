// influence 1 -> 가운데로 갈수록 효과
// distanceFromCenter 중앙에서의 거리. 1 -> 가장자리로 갈수록 효과

import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z =3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(4, 4);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3,
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

const raycaster = new THREE.Raycaster();
const localPoint = new THREE.Vector3();

let isHovered  = false;

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

    const normalizedX = Math.abs(localPoint.x) / 2;
    const normalizedY = Math.abs(localPoint.y) / 2;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    targetX = localPoint.x * distanceFromCenter * 0.3;
    targetY = localPoint.y * distanceFromCenter * 0.3;
    targetLightX = localPoint.x;  
    targetLightY = localPoint.y;
    targetRotationX = localPoint.y * distanceFromCenter * 0.15;
    targetRotationY = -localPoint.x * distanceFromCenter * 0.15;
    targetLightIntensity = influence * 3;
  }

  card.position.x += (targetX - card.position.x ) * 0.05;
  card.position.y += (targetY - card.position.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;
  
  pointLight.position.x += (targetLightX -pointLight.position.x) * 0.05;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;
  renderer.render(scene, camera);
}

animate();