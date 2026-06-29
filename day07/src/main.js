// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
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
window.addEventListener('mousemove', (e)=> {
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
})

const raycaster = new THREE.Raycaster();
let isHovered;

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetY = 0;
  let targetScale = 1;

  if(isHovered) {
    targetY = 0.4;
    targetScale = 1.5;
    material.color.set(0xffff00);
  } else {
    material.color.set(0xff0000);
  }

    card.position.y += (targetY - card.position.y) * 0.08;
    card.scale.x += (targetScale - card.scale.x) * 0.08;
    card.scale.y += (targetScale - card.scale.y) * 0.08;

  renderer.render(scene, camera);
}
animate();
