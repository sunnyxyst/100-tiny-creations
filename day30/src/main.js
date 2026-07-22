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
  color: 0x000000,
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
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
const defaultEmissive = new THREE.Color(0x000000);
const hoveredEmissive = new THREE.Color(0x999999);
const pressedEmissive = new THREE.Color(0xfcfcfc);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 4);
scene.add(ambientLight);
scene.add(directionalLight);

const localPoint = new THREE.Vector3();
let isHovered = false;
let isPressed = false;
let time = 0;

renderer.domElement.addEventListener('mousedown', () => {
  if(isHovered) {
    isPressed = true;
  }
})

window.addEventListener('mouseup', () => {
  isPressed = false;
});

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  time += 0.03;
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  const floatY = Math.sin(time) * 0.02;
  let targetY = floatY;
  let targetZ = 0;
  let targetScale = 1;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetEmissive = defaultEmissive;
  let targetEmissiveIntensity = 0;

  if(isPressed) {
    targetY = floatY;
    targetZ = -0.5;
    targetScale = 0.95;
    targetEmissive = pressedEmissive;
    targetEmissiveIntensity = 1.5;

  } else if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);
    targetY = floatY + 0.15;
    targetZ = 0.8;
    targetScale = 1.04;
    targetRotationX = localPoint.y * 0.4;
    targetRotationY = -localPoint.x * 0.6;
    targetEmissive = hoveredEmissive;
    targetEmissiveIntensity = 1;
  }

  card.position.y += (targetY - card.position.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.01;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.04;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.1;
  material.emissive.lerp(targetEmissive, 0.08);
  material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * 0.08;

  renderer.render(scene, camera);
}
animate();