// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 3;

const geometry = new THREE.PlaneGeometry(2, 1.5);
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
  mouse.x = (e.clientX / window.innerWidth) * 2 -1 ;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
})

const raycaster = new THREE.Raycaster();
let isHovered = false;
let isSelected = false;

renderer.domElement.addEventListener('click', () => {
  if(isHovered) {
    isSelected = !isSelected;
  }
})

let time = 0;

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  time += 0.02;
  let floatY = Math.sin(time) * 0.3;
  let targetY = floatY;
  let targetX = mouse.x * 0.3;
  let targetScale = 1;
  let targetRotationY = mouse.x * 0.5;

  isHovered = intersects.length > 0;

  if(isSelected) {
    targetX = 0;
    targetY = floatY + 1.3;
    targetScale = 1.5;
    targetRotationY = 0;
    material.color.set(0xff0000);
  } else if(isHovered) {
    targetX = mouse.x * 2.6;
    targetY = floatY + 0.7;
    targetScale = 1.2;
    targetRotationY = mouse.x * 1.2;
    material.color.set(0x3366ff);
  } else {
    material.color.set(0xffffff);
  }
  
  card.position.x += (targetX - card.position.x) * 0.05;
  card.position.y += (targetY - card.position.y) * 0.03;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.03;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.04;

  renderer.render(scene, camera);
}
animate();