// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
})
const raycaster = new THREE.Raycaster();
let isHovered = false;
let isPressed = false;
renderer.domElement.addEventListener('mousedown', () => {
  if(isHovered) {
    isPressed = true;
  }
})
window.addEventListener('mouseup', () => {
  isPressed = false;
})

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  let targetY = 0;
  let targetScale = 1;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetZ = 0;

  if(isPressed) {
    targetZ = -0.14;
    targetScale = 1.07;
    targetRotationX = mouse.y * 0.8;
    targetRotationY = -mouse.x * 0.8;
    material.color.set(0xff0000);
  } else if(isHovered) {
    targetY = 0.2;  
    targetScale = 1.12;  
    targetRotationX = mouse.y * 0.8;
    targetRotationY = -mouse.x * 0.8;
    material.color.set(0xffcc00)
  } else {
    material.color.set(0xffffff);
  }

  card.position.y += (targetY - card.position.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.08;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;
  renderer.render(scene, camera);
}
animate();