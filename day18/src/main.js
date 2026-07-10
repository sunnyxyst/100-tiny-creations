// input -> state -> target -> lerp -> render
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
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
let isHovered = false;
let isPressed = false;
renderer.domElement.addEventListener('mousedown', () => {
  if(isHovered) {
    isPressed = true;
  }
});

window.addEventListener('mouseup', () => {
  isPressed = false;
});

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  time += 0.02;
  let floatY = Math.sin(time) * 0.05;
  let targetY = floatY;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetScale = 1;
  let targetZ = 0;

  if(isPressed) {
    targetY = floatY + 0.2;
    targetZ = -0.2;
    targetScale = 1.01;
    targetRotationX = mouse.y * 0.4;
    targetRotationY = -mouse.x * 0.6;
  } else if(isHovered) {
    targetY = floatY + 0.3;
    targetRotationX = mouse.y * 0.4;
    targetRotationY = -mouse.x * 0.6;
    targetScale = 1.02;
  }

  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.08;
  renderer.render(scene, camera);
}
animate();