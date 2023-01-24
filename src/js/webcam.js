import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';

let camera, scene, renderer, controls, object;
let video, morphTexture, morphScreen;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const standingHeight = 10;

let speed = 5.0;
let _speed = 100.0; 

const darkGrey = new THREE.Color(0x1A1A1A);
darkGrey.convertSRGBToLinear();
const medGrey = new THREE.Color(0x63666A);
medGrey.convertSRGBToLinear();
const white = new THREE.Color(0xFAF9F6);
white.convertSRGBToLinear();

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = darkGrey;
    scene.fog = new THREE.FogExp2(scene.background, 0.01);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // Controls
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const title = document.getElementById('title');

    title.addEventListener('click', function () {
        controls.lock();
        morphVideo.play();
    });

    controls.addEventListener('lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    });

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    controls.getObject().position.set(0, standingHeight, 50);

    // Lights
    const ambLight = new THREE.AmbientLight(darkGrey);
    scene.add(ambLight);

    const hemLight = new THREE.HemisphereLight(medGrey, darkGrey);
    scene.add(hemLight);

    const manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
    }

    // Webcam test
    video = document.getElementById('video');
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(160, 90);
    geometry.scale(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 10, 0);
    scene.add(mesh);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            video: {
                width: 1280,
                height: 720,
                facingMode: 'user'
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            // apply stream to video texture
            video.srcObject = stream;
            video.play();
        }).catch(function(error) {
            console.error('Unable to access the camera/webcam', error);
        });
    } else {
        console.error('MediaDevices interface not available');
    }

    // Video
    const morphVideo = document.getElementById('morph');
    morphTexture = new THREE.VideoTexture(morphVideo);
    const morphGeometry = new THREE.PlaneGeometry(80, 45);
    morphGeometry.scale(0.5, 0.5, 0.5);
    const morphMaterial = new THREE.MeshBasicMaterial({
        map: morphTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    morphScreen = new THREE.Mesh(morphGeometry, morphMaterial);
    morphScreen.position.set(0, 10, 0.1);
    scene.add(morphScreen);

    // Load Models
    // models config
    const models = [
        {
            id: 'shelter',
            URL: '../assets/models/shelter.glb',
            x: 0, y: 0, z: 0,
            caption: ''
        },
        {
            id: 'seat',
            URL: '../assets/models/seat.glb',
            x: 0, y: 0, z: 0,
            caption: `'Click' to sit down`
        }
    ]

    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(
            
            obj.URL, 
            
            function (glb) {

                object = glb.scene;
                object.traverse(function(node) {
                    if (node.isMesh) {
                        node.material = new THREE.MeshPhongMaterial({
                            color: white
                        })
                    }
                })
                object.position.set(obj.x, obj.y, obj.z);
                // scene.add(object);
            })
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);

    if (morphTexture) {
        morphTexture.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();

    if (controls.isLocked === true) {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * _speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * _speed * delta;
        
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        prevTime = time;
    }

    document.querySelector('.co-ord').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);
}