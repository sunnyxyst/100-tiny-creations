import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometery = new THREE.PlaneGeometry(3, 2);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughtness: 0.3,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometery, material);
scene.add(card);

const mouse = {
  x: 999,
  y: 999
};
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

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
  let targetLightX = 0;
  let targetLightY = 0;
  let targetLightIntensity = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);
    
    const normalizedX = Math.abs(localPoint.x) / 1.5;
    const normalizedY = Math.abs(localPoint.y) / 1;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const threshold = 0.2;
    const edgeStrength = Math.max(0, (distanceFromCenter - threshold) / (1 - threshold));
    const strongStrength = edgeStrength * edgeStrength;
    
    // 제곱근을 사용하면 작은 값도 더 크게 보정되어, 가장자리 효과가 부드럽게 퍼집니다.
    const softStrength = Math.sqrt(edgeStrength);

    targetX = localPoint.x * edgeStrength * 0.3;
    targetY = localPoint.y * edgeStrength * 0.3;
    targetLightX = localPoint.x; 
    targetLightY = localPoint.y;
    targetLightIntensity = softStrength * 3;
    targetRotationX = -localPoint.y * strongStrength * 0.5;
    targetRotationY = localPoint.x * strongStrength * 0.5;
    
    console.log({strongStrength, softStrength, edgeStrength})

  }

  card.position.x += (targetX - card.position.x) * 0.08;
  card.position.y += (targetY - card.position.y) * 0.08;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;
  pointLight.position.x += (targetLightX - pointLight.position.x) * 0.08;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.08;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.08;

  renderer.render(scene, camera);
}

animate();