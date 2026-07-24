import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshBasicMaterial({
  color: 0x222222,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
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
const localPoint = new THREE.Vector3();

let isHovered = false;
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.03;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);

  const floatY = Math.sin(time) * 0.02;
  let targetY = floatY;
  let targetX = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  isHovered = intersects.length > 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    targetX = localPoint.x * 0.4;
    targetY = floatY + localPoint.y * 0.4;
    targetRotationX = localPoint.y * 0.7;
    targetRotationY = -localPoint.x * 0.7;
  }

  card.position.x += (targetX - card.position.x) * 0.03;
  card.position.y += (targetY - card.position.y)  * 0.03;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  renderer.render(scene, camera);
}

animate();