import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {models} from './_variables.js';

let camera, scene, renderer, controls, object;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const standingHeight = 15;

let speed = 5.0;
let _speed = 400.0; 

let objID = [];
let objInfo = [];

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
    scene.background = white;
    scene.fog = new THREE.FogExp2(scene.background, 0.001);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);

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

    controls.getObject().position.set(0, standingHeight, 0);

    // Lights
    var light = new THREE.AmbientLight(0xfafafa);
    scene.add(light);

    const hemLight = new THREE.HemisphereLight(white, white);
    scene.add(hemLight);

    const flashlight = new THREE.SpotLight(white, 1, 1000);
    camera.add(flashlight);
    flashlight.position.set(0,0,1);
    flashlight.target = camera;

    const manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
    }

    // Load Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(
            
            obj.URL, 
            
            function (glb) {

                object = glb.scene;
                object.position.set(obj.x, obj.y, obj.z);
                object.scale.set(2, 2, 2);
                scene.add(object);

                for (var i in object.children) {
                    objID.push(object.children[i].id);
                    objInfo.push([
                        object.children[i].id,
                        `
                            <span class="artist"></span><br>
                            <i>${obj.title}</i><br>
                            <span class="info">${obj.info}</span>
                        `
                    ])
                }
        })
    }

    const roomloader = new GLTFLoader(manager);
    roomloader.load(
        "../assets/models/gwen/room_test.glb",

        function(glb) {
            object = glb.scene;
            object.position.set(0, 0, 0);
            // scene.add(object);
        }
    )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();

    if (controls.isLocked === true) {
        let objIntersections = (new THREE.Raycaster(
            camera.position, // origin
            camera.getWorldDirection(new THREE.Vector3()))).intersectObjects(scene.children, true); //far

        if (objIntersections[0] && objID.indexOf(objIntersections[0].object.id) !== -1) {
            for (let i = 0; i < objInfo.length; i++) {
                if (objIntersections[0].object.id === objInfo[i][0]) {
                    document.querySelector('#artwork-caption p').innerHTML = objInfo[i][1];
                }
            }
            document.getElementById('artwork-caption').style.display = 'block';
        } else {
            document.getElementById('artwork-caption').style.display = 'none';
        }

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