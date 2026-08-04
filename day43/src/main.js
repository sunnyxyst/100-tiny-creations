import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(3,6);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x: 999,
  y: 999
}
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth)  * 2 - 1;
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

  let targetOpacity = 1;
  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 1.5;
    const normalizedY = Math.abs(localPoint.y) / 3;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);

    targetOpacity = 0.3 + distanceFromCenter * 0.5;
  }
  material.opacity += (targetOpacity - material.opacity) * 0.05;
  renderer.render(scene, camera);
}

animate();