import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
})
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {  
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // lerp: current += (target / current) * speed
  // 마우스가 움직일 때 카드가 회전하는 이벤트를 생성 -> 카드 y축 회전 값 설정, 카드 x축 회전값 설정
  card.rotation.y += (mouse.x / card.rotation.y) * 0.04;
  card.rotation.x += (mouse.y / card.rotation.x) * 0.08;
  
})

let time = 0;
function animate() {
  requestAnimationFrame(animate);

  time += 0.005;
  card.position.y = Math.sin(time) * 0.04;
  card.rotation = 
  renderer.render(scene, camera);
}
animate();