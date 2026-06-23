import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({color: 0xff0000, side:THREE.DoubleSide});
const card = new THREE.Mesh(geometry, material);
scene.add(card);

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  card.position.y += Math.sin(time) * 0.05;
  card.rotation.y += 0.005 ;

  renderer.render(scene, camera);
}

animate();

// remember Math.sin(time) -> 시간이 지나면 자동으로 오르락 내리락하는 숫자를 만들어주는 함수.
// sin moves between -1 and 1
// -1, -0.5, 0, 0.5, 1 -> 움직임이 너무 크므로 0.1을 곱해서 -0.1, -0.05, 0, 0.05, 0.1 사이에서 움직이게 해 움직임의 크기(진폭)을 컨트롤.