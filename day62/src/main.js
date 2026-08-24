import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2,3);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
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


function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetX = 0;
  let targetY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  
  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 1;
    const normalizedY = Math.abs(localPoint.y) / 1.5;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const threshold = 0.4;
    const edgeStrength = Math.max(0, (distanceFromCenter - threshold)/(1 - threshold));
    const strongStrength = edgeStrength * edgeStrength;
    const softStrength = Math.sqrt(edgeStrength);

    targetX = localPoint.x * softStrength * 0.2;
    targetY = localPoint.y * softStrength * 0.2;
    targetRotationX = localPoint.y * strongStrength * 0.2;
    targetRotationY = -localPoint.x * strongStrength * 0.2;
  }

  card.position.x += (targetX - card.position.x) * 0.05;
  card.position.y += (targetY - card.position.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.04;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.04;
  renderer.render(scene, camera);
}
animate();