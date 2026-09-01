import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2,4);
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

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) /1 ;
    const normalizedY = Math.abs(localPoint.y) / 2;
    const thresholdX = 0.2;
    const thresholdY = 0.6;
    const edgeX = Math.max(0, (normalizedX - thresholdX) / (1 - thresholdX));
    const edgeY = Math.max(0, (normalizedY - thresholdY) / (1 - thresholdY));
    const softX = Math.sqrt(edgeX);
    const strongY = edgeY * edgeY;
    const moveRangeX = 0.1 + softX * 0.8;
    const moveRangeY = 0.05 + strongY * 0.5;

    targetX = localPoint.x * softX * moveRangeX;
    targetY = localPoint.y * strongY * moveRangeY;
    
  }

  card.position.x += (targetX - card.position.x) * 0.04;
  card.position.y +=(targetY - card.position.y) * 0.04;
  renderer.render(scene, camera);
  
}

animate();