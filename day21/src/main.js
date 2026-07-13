// input -> state -> target -> lerp -> render
// 기억나는 구문만 써보기 -> emissive, emissiveintensity, MeshStandardMaterial, embient, THREE.Color...

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
  emissive: 0xffffff,
  emissiveIntensity: 0,
  side: THREE.DoubleSide,
})
const card = new THREE.Mesh(geometry, material);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2,3,4);

scene.add(card);
scene.add(ambientLight);
scene.add(directionalLight);

const mouse = {
  x: 999,
  y: 999
}
const raycaster = new THREE.Raycaster();

let isHovered = false;
let isPressed = false;
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
renderer.domElement.addEventListener('mousedown', () => {
  if(isHovered) {
    isPressed = true;
  }
})
window.addEventListener('mouseup', () => {
  isPressed = false;
})
const normalColor = new THREE.Color(0xffffff);
const hoveredColor = new THREE.Color(0x3366ff);
const pressedColor = new THREE.Color(0xff0000);

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  time += 0.02;
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let floatY = Math.sin(time) * 0.3;
  let targetY = floatY;
  let targetColor = normalColor;
  let targetEmissiveIntensity = 0;

  if(isPressed) { 
    targetColor = pressedColor;
    targetEmissiveIntensity = 0.4;
  } else if(isHovered) {
    targetColor = hoveredColor;
    targetEmissiveIntensity = 0.8;
  }

  card.position.y += (targetY - card.position.y) * 0.08;
  material.emissive.lerp(targetColor, 0.08);
  material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * 0.08;
  renderer.render(scene, camera);
}
animate();