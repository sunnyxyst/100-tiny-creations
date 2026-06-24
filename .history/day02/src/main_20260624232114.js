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

let time = 0;
function animate() {
  requestAnimationFrame(animate);

  time += 0.01;
  card.position.y += Math.sign(time) * 0.05;
  card.rotation.x += 0.005;
  renderer.render(scene, camera);

}

animate();