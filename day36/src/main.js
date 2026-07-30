// 
// 효과 -> 카드 중심에 가까울수록 빛이 밝아지고(강하고) 크기가 커진다
//     -> 카드 가장자리에 가까울수록 빛이 어두워지고(약해지고) 크기가 작아진다
// localPoint -> 중심 좌표값은 0. card 사이즈가 가로 2이므로 왼쪽 -1, 중심 0, 오른쪽 1 
// = distanceFromCenter 중심이면 0, 가장자리면 1 
// influence는 영향도라고 생각하면? = 위의 효과에서는 중심으로 갈수록 효과가 강해지므로 중심이 1이 곱해져야 하고, 가장자리가 0
// 카드 사이즈가 4, 6이라고 한다면.
// const normalizedX = Math.abs(localPoint.x) / 2; const normalizedY = Math.abs(localPoint.y) / 3; 
// const distanceFromCenter = Math.max(normalizedX, normalizedY); // 
// const influence = 1 - distanceFromCenter; 


import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.4,
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

let isHovered = false;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;

  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetLightX = 0;
  let targetLightY = 0;
  let targetLightIntensity = 0;
  if(isHovered) {
    localPoint.copy(intersects[0].point);
    card.worldToLocal(localPoint);
    const normalizedX = Math.abs(localPoint.x);
    const normalizedY = Math.abs(localPoint.y) / 1.25;
    const distanceFromCenter = Math.max(normalizedX, normalizedY);
    const influence = Math.max(0, 1 - distanceFromCenter);

    
    targetRotationX = localPoint.y * 0.5;
    targetRotationY = -localPoint.x * 0.5;
    targetLightX = localPoint.x;
    targetLightY = localPoint.y;
    targetLightIntensity = 3 * influence;

    console.log({
      influence,
      intensity: targetLightIntensity
    })
  }

  card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;

  pointLight.position.x += (targetLightX - pointLight.position.x) * 0.03;
  pointLight.position.y += (targetLightY - pointLight.position.y) * 0.03;
  pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.03;
  renderer.render(scene, camera);
}
animate();