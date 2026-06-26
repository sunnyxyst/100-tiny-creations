import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({anitalias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

let isPressed = false;
renderer.domElement.addEventListener('mousedown', () => {
  isPressed = true;
})
renderer.domElement.addEventListener('mouseup', () => {
  isPressed = false;
})

function animate() {
  requestAnimationFrame(animate);

  let targetZ = 0;
  let targetRotation = 0;
  let targetScale = 1;

  if(isPressed) {
    targetZ = -0.2
    targetRotation = 0.5;
    targetScale = 1.5;
    card.position.z += (targetZ - card.position.z) * 0.08;
    card.rotation.x += (targetRotation - card.rotation.x)*0.08;
    card.scale.x += (targetScale - card.scale.x)*0.08;
    card.scale.y += (targetScale - card.scale.y)*0.08;
  }
  renderer.render(scene, camera);
}

animate();