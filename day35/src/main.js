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
	roughness: 0.5,
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.z = 1;
scene.add(ambientLight);
card.add(pointLight);

let isHovered = false;
let time = 0;

function animate() {
	requestAnimationFrame(animate);
	raycaster.setFromCamera(mouse, camera);
	time += 0.03;
	const intersects = raycaster.intersectObject(card);

	isHovered = intersects.length > 0;
	const floatY = Math.sin(time) * 0.02;
	let targetX = 0;
	let targetY = floatY;
	let targetRotationX = 0;
	let targetRotationY = 0;
	let targetScale = 1;
	let targetLightX = 0;
	let targetLightY = 0;
	let targetLightIntensity= 0;

	if(isHovered) {
		localPoint.copy(intersects[0].point);
		card.worldToLocal(localPoint);
		// Math.abs(숫자) -> 음수를 양수로 변경, 방향을 없애고 거리만 남기는 함수.  좌표를 이동하는 값이 아니고 숫자를 반환하는 함수.
		// Math.abs(0.5) -> 0.5 Math.abs(-0.5) -> 0.5
		// normalizedX와 normalizedY는 왜 필요한가.
		// 카드 사이즈가 가로 2, 세로 2.5이므로. x는 카드 중심을 0이라고 치면 -1 ~ 1  y는 -1.25 ~ 1.25 

		const normalizedX = Math.abs(localPoint.x) / 1; // 1
		const normalizedY = Math.abs(localPoint.y) / 1.25;
		const distanceFromCenter = Math.max(normalizedX, normalizedY);
		const influence = Math.max(0, 1 - distanceFromCenter);

		targetX = localPoint.x * influence;
		targetY = floatY + localPoint.y * influence;
		targetScale = 1 + 0.04 * influence;
		targetLightIntensity = 3 * influence;
		targetRotationX = localPoint.y * 0.4;
		targetRotationY = localPoint.x * 0.4;
		targetLightX = localPoint.x;
		targetLightY = localPoint.y;
	}

	card.position.x += (targetX - card.position.x) * 0.04;
	card.position.y += (targetY - card.position.y) * 0.04;
	card.rotation.x += (targetRotationX - card.rotation.x) * 0.06;
	card.rotation.y += (targetRotationY - card.rotation.y) * 0.06;
	card.scale.x += (targetScale - card.scale.x) * 0.05;
	card.scale.y += (targetScale - card.scale.y) * 0.05;
	
	pointLight.position.x += (targetLightX - pointLight.position.x) * 0.05;
	pointLight.position.y += (targetLightY - pointLight.position.y) * 0.05;
	pointLight.intensity += (targetLightIntensity - pointLight.intensity) * 0.05;

	renderer.render(scene, camera);
}

animate();
