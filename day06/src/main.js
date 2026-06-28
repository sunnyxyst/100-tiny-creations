// input -> state -> target -> lerp -> render

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 3;

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
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
});

let isHovered = false;

renderer.domElement.addEventListener('mouseenter', () => {
  isHovered = true
})
renderer.domElement.addEventListener('mouseleave', ()=> {
  isHovered = false
})

function animate() {
  requestAnimationFrame(animate);

  // animate 기본값 설정
  let targetX = 0;
  let targetY = 0;
  let targetRotationY = 0;

  if(isHovered) {
    targetX = mouse.x * 0.3;
    targetY = mouse.y * 0.2;
    targetRotationY = mouse.x * 0.6;
  }

  card.position.x += (targetX - card.position.x) * 0.08;
  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  renderer.render(scene, camera);
}

animate();
