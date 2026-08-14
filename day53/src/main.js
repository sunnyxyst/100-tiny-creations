import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(4,2);
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
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
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

    const normalizedX = Math.abs(localPoint.x) / 2;
    const normalizedY = Math.abs(localPoint.y) / 1;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const threshold = 0.3; // 여기까지는 반응하지마
    // threshold를 지난 뒤 얼마나 강하게 반응할지 0~1
    const edgeStrength = (distanceFromCenter - threshold) / (1 - threshold);

    if(distanceFromCenter > threshold) {
      targetX = localPoint.x * edgeStrength * 0.3;
      targetY = localPoint.y * edgeStrength * 0.3;
      targetRotationX = localPoint.y * edgeStrength * 0.5;
      targetRotationY = -localPoint.x * edgeStrength * 0.5;
    }
  }

  card.position.x += (targetX - card.position.x) * 0.06;
  card.position.y += (targetY - card.position.y) * 0.06;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.06;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.06;
  renderer.render(scene, camera);
}

animate();