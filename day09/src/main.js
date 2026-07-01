// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
camera.position.z = 3;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
});

let isHovered = false;
let isSelected = false;
renderer.domElement.addEventListener('click', () => {
  if(isHovered) {
    isSelected = !isSelected;
  }
});
const raycaster = new THREE.Raycaster();
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);

  isHovered = intersects.length > 0;
  time += 0.02

  let floatY = Math.sin(time) * 0.05;
  let targetY = floatY;
  let targetRotationY = mouse.x * 0.3;

  if(isSelected) {
    targetY = floatY + 0.4;
    targetRotationY = 0;
    material.color.set(0x3366ff);
  } else if(isHovered) {
    targetY = floatY + 0.2;
    targetRotationY = mouse.x * 0.6;
    material.color.set(0xffffff);
  } else {
    material.color.set(0xff0000);
  }
  
  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  renderer.render(scene, camera);
}
animate();