import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(3, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side:THREE.DoubleSide
})
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

    const normalizedX = Math.abs(localPoint.x)/1.5;
    const normalizedY = Math.abs(localPoint.y) / 1;
    const threshold = 0.3;
    const edgeX = Math.max(0, (normalizedX - threshold)/(1-threshold));
    const edgeY = Math.max(0, (normalizedY - threshold)/(1-threshold));

    targetX = localPoint.x * edgeX * 0.3;
    targetY = localPoint.y * edgeY * 0.3;
    targetRotationX = localPoint.y * edgeY * 0.2;
    targetRotationY = -localPoint.x * edgeX * 0.2;
  
  
  }

  card.position.x += (targetX - card.position.x) * 0.02;
  card.position.y += (targetY - card.position.y) * 0.02;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.02;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.02;
  renderer.render(scene, camera);
}
animate();