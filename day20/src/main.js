// input -> state -> target -> lerp -> render
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide  
});
const card = new THREE.Mesh(geometry, Material);
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
  if(isHovered)  {
    isPressed = true;
  }
});
window.addEventListener('mouseup', () => {
  isPressed = false;
})
let time = 0;
let normalColor = new THREE.Color(0xffffff);
let hoveredColor = new THREE.Color(0x3366ff);
let pressedColor = new THREE.Color(0xff0000);

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  time += 0.03
  let floatY = Math.sin(time) * 0.04;
  let targetY = floatY;
  let targetScale = 1;
  let targetZ = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetColor = normalColor;
  
  if(isPressed) {
    targetColor = pressedColor;
    targetY = floatY + 0.3;
    targetZ = -0.1;
    targetRotationX = mouse.y * 0.4;
    targetRotationY = -mouse.x * 0.4;
    targetScale = 1;
  } else if(isHovered) {
    targetColor = hoveredColor;
    targetY = floatY + 0.3;
    targetRotationX = mouse.y * 0.4;
    targetRotationY = -mouse.x * 0.4;
    targetScale = 1.02;
  } else {
    targetColor = normalColor;
  }
  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  card.position.z += (targetZ - card.position.z) * 0.08;
  card.scale.x += (targetScale - card.scale.x) * 0.08;
  card.scale.y += (targetScale - card.scale.y) * 0.08;
  Material.color.lerp(targetColor, 0.08);
  renderer.render(scene, camera);
}
animate();