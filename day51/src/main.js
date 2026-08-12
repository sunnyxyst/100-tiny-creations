import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 3);
const material = new THREE.MeshStandardMaterial({
	color: 0x999999,
	roughness: 0.3,
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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

	let targetZ = 0;
	let targetScale = 1;
	let targetRotationX = 0;
	let targetRotationY = 0;
	let targetLightX = 0;
	let targetLightY = 0;
	let targetLightIntensity = 0;
	if(isHovered) {

		localPoint.copy(intersects[0].point);
		card.worldToLocal(localPoint);

		const normalizedX = Math.abs(localPoint.x) / 1;
		const normalizedY = Math.abs(localPoint.y) / 1.5;
		const distanceFromCenter = Math.max(normalizedX, normalizedY);
		const influence = Math.max(0, 1 - distanceFromCenter);

		targetZ = influence * 0.5;
		targetScale = 1 + influence * 0.3;
		targetLightX = localPoint.x;
		targetLightY = localPoint.y;
		targetLightIntensity = 3 * influence;
		targetRotationX = localPoint.y * distanceFromCenter * 0.3;
		targetRotationY = -localPoint.x * distanceFromCenter * 0.3;
	}

	card.position.z += (targetZ - card.position.z) * 0.04;
	card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
	card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;
	card.scale.x += (targetScale - card.scale.x) * 0.05;
	card.scale.y += (targetScale - card.scale.y) * 0.05;
	
	pointLight.position.x += (targetLightX - pointLight.position.x) * 0.05;
	pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
	pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;
	renderer.render(scene, camera);
}
animate();