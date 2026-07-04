// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 3;
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 3);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
const card = new THREE.Mesh(geometry, material);
scene.add(card);
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e)=> {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
})
const raycaster = new THREE.Raycaster();
let isHovered = false;
let isSelected = false;
// renderer.domElement.addEventListener('mouseenter', () => {
//   isHovered = true;
// })
// renderer.domElement.addEventListener('mouseleave', () => {
//   isHovered = false;
// })
renderer.domElement.addEventListener('click', () => {
  if(isHovered)  {
    isSelected = ! isSelected;
  }
})

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetX = 0;
  if(isSelected) {
    targetX = 0;
  } else if(isHovered) {
    targetX = mouse.x * 1.5;
  } else {
    targetX = 0
  }

  card.position.x += (targetX - card.position.x) * 0.04;
  renderer.render(scene, camera);
}

animate();