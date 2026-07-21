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
window.addEventListener('mousemove', (e)=> {
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
const defaultEmissive = new THREE.Color(0x000000);
const hoveredEmissive = new THREE.Color(0xf3f3f3);
const pressedEmissive = new THREE.Color(0xf0f0f0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 4);
scene.add(ambientLight);
scene.add(directionalLight);

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  time += 0.03;
  let floatY = Math.sin(time) * 0.02;
  let targetY = floatY;
  let targetZ = 0;
  let targetScale = 1;
  let targetEmissive = defaultEmissive;
  let targetEmissiveIntensity = 0;

  if(isPressed) {
    targetY = floatY;
    targetZ = -0.2;
    targetScale = 0.97;
    targetEmissive = pressedEmissive;
    targetEmissiveIntensity = 0.8;

  } else if(isHovered) {
    targetY = floatY + 0.2;
    targetZ = 0.1;
    targetScale = 1.04;
    targetEmissive = hoveredEmissive;
    targetEmissiveIntensity = 0.4;
  }

  card.position.y += (targetY - card.position.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;

  material.emissive.lerp(targetEmissive, 0.08);
  material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * 0.08;
  renderer.render(scene, camera);
}
animate();