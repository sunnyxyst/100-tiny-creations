// input -> state -> target -> lerp -> render
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
camera.position.z = 3;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// card
const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  emissive: 0x000000,
  emissiveIntensity: 0,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 4);
scene.add(ambientLight);
scene.add(directionalLight);

const defaultEmissive = new THREE.Color(0x000000);
const hoverEmissive = new THREE.Color(0xff0000);

// raycaster
const mouse = {
  x: 999,
  y: 999
}
const raycaster = new THREE.Raycaster();
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
let isHovered = false;
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  time += 0.03;
  isHovered = intersects.length > 0;
  let floatY = Math.sin(time) * 0.04;
  let targetY = floatY;
  let targetScale = 1;
  let targetEmissive = defaultEmissive;
  let targetEmissiveIntensity = 0;
  let targetRotationY = 0;
  if(isHovered) {
    targetY = floatY + 0.2;
    targetScale = 1.02;
    targetEmissive = hoverEmissive;
    targetEmissiveIntensity = 0.8;
    targetRotationY = -mouse.x * 0.6;
  }

  // lerp
  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;

  material.emissive.lerp(targetEmissive, 0.08);
  material.emissiveIntensity += (targetEmissiveIntensity - material.emissiveIntensity) * 0.08;;
  renderer.render(scene, camera);
}
animate();