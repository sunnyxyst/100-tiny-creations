// input -> state -> target -> lerp -> render

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);
camera.position.z = 3;

const mouse = {
  x: 0,
  y: 0
}

// state 
let isPressed = false;
let isHovered = false;

// move input
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX - window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY - window.innerHeight) * 2 + 1;

  card.rotation.y += (targetRotation - card.rotation.y) * 0.08;
})

// hover input
renderer.domElement.addEventListener('mouseenter', () => {
  isHovered = true;
})
renderer.domElement.addEventListener('mouseout', () => {
  isHovered = false;
})

// press input
renderer.domElement.addEventListener('mousedown', () => {
  isPressed = true;
})
renderer.domElement.addEventListener('mouseup', () => {
  isPress = false;
});


function animate() {
  requestAnimationFrame(animate);

  //lerp 
  let targetZ = 0;
  let targetScale = 1;

  if(isHovered) {
    targetScale = 1.3;
  }
  card.scale.x += (targetScale - card.scale.x) * 0.08;

  if(isPressed) {
    targetZ = -0.2;
  }
  card.position.z += (targetZ - card.position.z) * 0.08;
  renderer.render(scene, camera);
}
animate();