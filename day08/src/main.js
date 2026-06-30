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
})
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
})

const raycaster = new THREE.Raycaster();
let isHovered = false;
let isSelected = false;

renderer.domElement.addEventListener('click', () => {
  if(isHovered) {
    isSelected = !isSelected;
  } 
})

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  let targetY = 0;
  let targetZ = 0;
  let targetScale = 1;
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  if(isSelected) {
    material.color.set(0x3366ff)
  } else if(isHovered) {
    material.color.set(0xff8844)
  } else {
    material.color.set(0xff0000)
  }

  if(isHovered) {
    targetY = 0.2;
    targetZ = 0.4;
    targetScale = 1.2;
  }
  if(isSelected) {
    targetY = 0.5;
    targetZ = 1.5;
    targetScale = 1;
  }

  // lerp 
  card.position.y += (targetY - card.position.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;

  renderer.render(scene, camera);
}
animate();