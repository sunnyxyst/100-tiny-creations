// input -> state -> target -> lerp -> render
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const card = new THREE.Mesh(geometry, material);
scene.add(card);
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
})
const raycaster = new THREE.Raycaster();
let isHovered = false;

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card);
  isHovered = intersects.length > 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  if(isHovered) {
    // 오른쪽 아래 모서리가 뒤로 들어가는 느낌
    targetRotationX = -mouse.y * 0.5;
    targetRotationY = mouse.x * 0.8;
    console.log(mouse.x, mouse.y)
    // mouse.x 마우스가 왼쪽이면 좌표값이 마이너스, mouse.y 마우스가 아래쪽이면 좌표값이 마이너스
    // 마우스가 왼쪽 아래 위치시 mouse.x/mouse.y 모두 마이너스, 오른쪽 위 위치시 mouse.x/mouse.y 모두 플러스
  }

  // 오른쪽을 뒤로 보내고 싶다 -> rotation.y
  // 위쪽/아래쪽을 뒤로 보내고 싶다 ->  rotation.x
  // 오른쪽 아래 모서리를 뒤로 보내고 싶다  ->  rotation.y +  rotation.x  

  card.rotation.x += (targetRotationX - card.rotation.x) * 0.08;
  card.rotation.y += (targetRotationY - card.rotation.y) * 0.08;

  renderer.render(scene, camera);
}
animate();