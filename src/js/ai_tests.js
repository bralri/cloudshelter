import * as THREE from 'three';
import { GLTFLoader } from 'three/GLTFLoader.js';
import { FlyControls } from 'three/FlyControls.js';

const MAX_MODELS = 30;
const MODELS_SCALE = 50;
// const MODEL_DISTANCE_FROM_EACH_OTHER = 400;
// const MODEL_DISTANCE_FROM_CAMERA = 100;
const MODEL_DISTANCE = 200;
const SPHERE_RADIUS = 2000;
const SPHERE_SEGMENTS = 16;
const SPHERE_COLOR = 0xffffff;
const SPHERE_POSITION = new THREE.Vector3(0, 0, -100);

const MODELS_URLS = [
  '../assets/models/clouds/1.glb',
  '../assets/models/clouds/2.glb',
  '../assets/models/clouds/3.glb',
  '../assets/models/clouds/4.glb',
  '../assets/models/clouds/5.glb',
  '../assets/models/clouds/6.glb',
  '../assets/models/clouds/7.glb',
  '../assets/models/clouds/8.glb',
  '../assets/models/clouds/9.glb',
];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  50,
  1e7
);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// scene.fog = new THREE.FogExp2(0xffffff, 0.002 );

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 5;
controls.domElement = renderer.domElement;
controls.rollSpeed = 0.005;
controls.autoForward = false;
controls.dragToLook = false;

const sphereGeometry = new THREE.SphereGeometry(
  SPHERE_RADIUS,
  SPHERE_SEGMENTS,
  SPHERE_SEGMENTS
);

const sphereMaterial = new THREE.MeshBasicMaterial({
  color: SPHERE_COLOR,
//   transparent: true,
//   opacity: 0
    wireframe: true
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.copy(SPHERE_POSITION);
sphere.boundingSphere = new THREE.Sphere(SPHERE_POSITION, SPHERE_RADIUS);
scene.add(sphere);

const models = [];

// const position = new THREE.Vector3();

const loader = new GLTFLoader();

const GRID_SIZE = 10;
const GRID_CELL_SIZE = SPHERE_RADIUS * 2 / GRID_SIZE;

function getGridPosition() {
  const position = new THREE.Vector3();

  do {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const z = Math.floor(Math.random() * GRID_SIZE);

    position.set(
      x * GRID_CELL_SIZE - SPHERE_RADIUS + GRID_CELL_SIZE / 2,
      y * GRID_CELL_SIZE - SPHERE_RADIUS + GRID_CELL_SIZE / 2,
      z * GRID_CELL_SIZE - SPHERE_RADIUS + GRID_CELL_SIZE / 2
    );
  } while (
    !sphere.boundingSphere.containsPoint(position) ||
    position.distanceTo(camera.position) < MODEL_DISTANCE ||
    models.some((otherModel) => otherModel.position.distanceTo(position) < MODEL_DISTANCE)
  );

  return position;
}

function loadModel() {
  if (models.length >= MAX_MODELS) {
    return;
  }

  loader.load(
    MODELS_URLS[Math.floor(Math.random() * MODELS_URLS.length)],
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(MODELS_SCALE, MODELS_SCALE, MODELS_SCALE);

      const position = getGridPosition();
      const rotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      model.position.copy(position);
      model.rotation.copy(rotation);
      scene.add(model);
      models.push(model);
      loadModel();
    },
    undefined,
    (error) => console.error(error)
  );
}

// function loadModel() {
//     if (models.length >= MAX_MODELS) {
//       return;
//     }
  
//     loader.load(
//       MODELS_URLS[Math.floor(Math.random() * MODELS_URLS.length)],
//       (gltf) => {
//         const model = gltf.scene;
//         model.scale.set(MODELS_SCALE, MODELS_SCALE, MODELS_SCALE);
  
//         // Randomize rotation
//         model.rotation.x = Math.random() * Math.PI * 2;
//         model.rotation.y = Math.random() * Math.PI * 2;
//         model.rotation.z = Math.random() * Math.PI * 2;
  
//         do {
//           position.set(
//             Math.random() * (SPHERE_RADIUS * 2) - SPHERE_RADIUS,
//             Math.random() * (SPHERE_RADIUS * 2) - SPHERE_RADIUS,
//             Math.random() * (SPHERE_RADIUS * 2) - SPHERE_RADIUS
//           );
//         } while (
//           !sphere.boundingSphere.containsPoint(position) ||
//           position.distanceTo(camera.position) < MODEL_DISTANCE_FROM_CAMERA ||
//           models.some((otherModel) => otherModel.position.distanceTo(position) < MODEL_DISTANCE_FROM_EACH_OTHER)
//         );
  
//         model.position.copy(position);
//         scene.add(model);
//         models.push(model);
//         loadModel();
//       },
//         undefined,
//         (error) => console.error(error)
//     );
// }

loadModel();

function animate() {
  requestAnimationFrame(animate);

  controls.update(1);
  renderer.render(scene, camera);
}

animate();