// input -> state -> target -> lerp -> render

import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
camera.position.z = 3;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  emissive: 0x000000,
  emissiveIntensity: 0,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
});
const raycaster = new THREE.Raycaster();

const defaultEmissive = new THREE.Color(0x222222);
const hoveredEmissive = new THREE.Color(0xff0000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 4);
scene.add(ambientLight);
scene.add(directionalLight);

let isHovered = false;
const localPoint = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetEmissive = defaultEmissive;
  let targetEmissiveIntensity = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    console.log(intersects[0].point);
    card.worldToLocal(localPoint);
    
    targetRotationX = localPoint.y * 0.3;
    targetRotationY = -localPoint.x * 0.4;
    targetEmissive = hoveredEmissive;
    targetEmissiveIntensity = 0.8;
  }

  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  // 발광 색상
  material.emissive.lerp(targetEmissive, 0.08);
  // 발광 강도
  material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * 0.08;
  renderer.render(scene, camera);
}
animate();