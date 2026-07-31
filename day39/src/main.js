import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(5, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0x222222,
  side: THREE.DoubleSide, 
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

  let targetZ = 0;
  let targetScale = 1;

  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);

    const normalizedX = Math.abs(localPoint.x) / 2.5;
    const normalizedY = Math.abs(localPoint.y) / 1;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    targetZ = influence * 0.2;
    targetScale = 1 + influence * 0.04;
  }

  card.position.z += (targetZ - card.position.z) * 0.04;
  card.scale.x += (targetScale - card.scale.x) * 0.2;
  card.scale.y += (targetScale - card.scale.y) * 0.2;

  renderer.render(scene, camera);
}

animate();

// 오늘 배운 것

// scale의 기본값은 1이라
// 1 + influence * 변화량
// 형태로 만든다.

// 카드 크기가 바뀌면
// normalized 계산도
// 반 크기에 맞게 바뀌어야 한다.