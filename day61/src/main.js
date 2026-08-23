import * as THREE from 'three';

// 마우스를 좌우로 움직일때 카드가 부드럽게 일찍 반응하고, 위아래로 움직일때는 카드가 가장자리에서 늦게 강하게 반응하게.
// 부드럽게 일찍 반응 -> softStrength, 가장자리에서 늦게 강하게 반응 -> edgeStrength
// x축 -> softStrength, y축 -> strongStrength

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 3);
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
  // 레이캐스터 인스턴스의 setFromCamera() 메서드를 사용하여 마우스 좌표를 기반으로 레이캐스터를 설정합니다. 이때, 마우스 좌표는 -1에서 1 사이의 정규화된 장치 좌표(NDC)로 변환되어야 합니다. 이를 통해 레이캐스터가 카메라의 시야에서 마우스 위치를 기준으로 광선을 쏘게 됩니다.
  const intersects = raycaster.intersectObject(card);
  // 레이캐스터 인스턴스의 intersectObject() 메서드를 사용해 카드 객체와의 교차여부를 확인. 교체하는 객체를 배열 형태로 반환. 
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
    const threshold = 0.3;
    const edgeStrength = Math.max(0, (distanceFromCenter - threshold) / (1 - threshold));
    // edgeStrength는 카드의 가장자리에서 얼마나 강하게 반응할지를 결정하는 값. distanceFromCenter가 threshold보다 작으면 edgeStrength는 0이 되고, distanceFromCenter가 threshold보다 크면 edgeStrength는 0과 1 사이의 값이 된다.
    const strongStrength = edgeStrength * edgeStrength;
    const softStrength = Math.sqrt(edgeStrength);
    // softStrength는 카드의 가장자리에서 얼마나 부드럽게 반응할지를 결정하는 값. edgeStrength의 제곱근을 취하여, edgeStrength가 작을 때는 softStrength가 더 크게 나오도록 한다.
    targetX = localPoint.x * softStrength * 0.4;
    targetY = localPoint.y * strongStrength * 0.4;
    targetRotationX = localPoint.y * strongStrength * 0.1;
    targetRotationY = -localPoint.x * softStrength * 0.1;
  }

  card.position.x += (targetX - card.position.x) * 0.05;
  card.position.y += (targetY - card.position.y) * 0.05;
  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;

  renderer.render(scene, camera);

}

animate();