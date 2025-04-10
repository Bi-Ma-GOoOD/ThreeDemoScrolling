import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// สร้างกล้องในการเคลื่อนที่ในแกน Z เหมือนตอนทีเรียน ICG
camera.position.setZ(30);
// วาดภาพ
renderer.render(scene, camera);
// Geometry: the {x, y, z} points that makeup a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({color: 0xFF6347});

const torus = new THREE.Mesh(geometry, material);

const pointLight = new THREE.PointLight(0xffffff, 500, 100);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff);

// const lightHelper = new THREE.PointLightHelper(pointLight);

const gridHelper = new THREE.GridHelper(200, 50);

scene.add(torus);
scene.add(pointLight, ambientLight);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  //กำหนดตำแหน่งของดาว แบบสุ่ม โดยเราจะใช้ค่า x, y และ z ในการกำหนด
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
// กำหนดว่าอยากให้ดาวมีทั้งหมดกี่ดวง ส่วนตำแหน่งจะเป็นการสุ่มนะว่าจะอยู่ตรงไหน
Array(200).fill().forEach(addStar);
// สร้างพืนหลัง จาก รูปภาพ หรือเป็นการใส่ Texture นั่นเอง
const spaceTexture = new THREE.TextureLoader().load('./20204.jpg');
scene.background = spaceTexture;

// Avatar
const deftTexture = new THREE.TextureLoader().load('./Personal-chill.jpg');

const deft = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({map: deftTexture})
);

// Moon
const moonTexture = new THREE.TextureLoader().load('./moon.jpg');
const normalMapMoonTexture = new THREE.TextureLoader().load('./normalMapMoon.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalMapMoonTexture,
  })
);

scene.add(deft);
scene.add(moon);

moon.position.set(-10, 0, 30); 

function moveCamera(){
  // อย่างแรกเราต้องรู้ก่อนว่า user scroll ไปที่ไหน
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  deft.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();