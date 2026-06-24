import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
const card = new THREE.Mesh(geometry, material);
scene.add(card);

const mouse = {
  x = 0,
  y = 0
}
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  card.rotation.x += (mouse.y - card.rotation.x) * 0.02;
  card.rotation.y += (mouse.x - card.rotation.y) * 0.07;
  // lerp 
  //current += (target - current) * speed
})

let time = 0;
function animate() {
  requestAnimationFrame(animate);

  time += 0.01;
  card.position.y += Math.sign(time) * 0.05;
  card.rotation.x += 0.005;
  renderer.render(scene, camera);

}

animate();