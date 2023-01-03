import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {ImprovedNoise} from 'three/ImprovedNoise.js';
import {Water} from 'three/Water.js';
import {models} from './shelter-config.js';

let camera, scene, renderer, controls, water, object, sound;

// Terrain
const worldWidth = 256, worldDepth = 256;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const standingHeight = 10;
const sittingHeight = 7.5;

let speed = 5.0;
let _speed = 100.0; 

let objID = [];
let objInfo = [];
let seatID = [];

let sitting = false;
let audioPlaying = true;

const darkGrey = new THREE.Color(0x1A1A1A);
darkGrey.convertSRGBToLinear();
const medGrey = new THREE.Color(0x404040);
medGrey.convertSRGBToLinear();
const white = new THREE.Color(0xFAF9F6);
white.convertSRGBToLinear();

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = white;
    // scene.fog = new THREE.FogExp2(scene.background, 0.01);

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
        if (sitting === true) {
            document.removeEventListener('click', STAND__UP);
        }
    });

    controls.addEventListener('lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
        document.addEventListener('click', STAND__UP);
        sound.play();
        console.log('audio playing');
        audioPlaying = true;
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
        sound.pause();
        console.log('audio paused');
        audioPlaying = false;
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

    // Terrain
    const data = generateHeight(worldWidth, worldDepth);
    const terrainGeometry = new THREE.PlaneGeometry(750, 750, worldWidth - 1, worldDepth -1);
    terrainGeometry.rotateX(- Math.PI / 2);
    const terrainVertices = terrainGeometry.attributes.position.array;

    for (let i = 0, j = 0, l = terrainVertices.length; i < l; i ++, j += 3) {
        terrainVertices[j + 1] = data[i] * 10;
    }

    const terrainTexture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    terrainTexture.wrapS = THREE.ClampToEdgeWrapping;
    terrainTexture.wrapT = THREE.ClampToEdgeWrapping;

    const terrainMesh = new THREE.Mesh(terrainGeometry, new THREE.MeshBasicMaterial({map: terrainTexture}));
    terrainMesh.position.y = -900;
    scene.add(terrainMesh);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(750, 750, 4, 4);
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader(manager).load( 

                '../assets/images/waternormals.jpg', 
                
                function (texture) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0xADD8E6,
            distortionScale: 2.7,
            fog: scene.fog !== undefined
        }
    )
    water.rotation.x = - Math.PI / 2;
    scene.add(water);

    // Audio Loader
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    sound = new THREE.PositionalAudio(audioListener);
    audioLoader.load(
        
        '../assets/sounds/bus/Bus-stop.m4a', 
        
        function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setRefDistance(1);
            sound.setVolume(1);
            sound.setDirectionalCone(360, 360, 0);
    });
    scene.add(sound)

    // Load Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(
            
            obj.URL, 
            
            function (glb) {

                object = glb.scene;
                object.traverse(function(node) {
                    if (node.isMesh) {
                        node.material = new THREE.MeshStandardMaterial({
                            color: white
                        })
                        node.material.opacity = 0.5;
                        node.material.transparent = true;
                    }
                })
                object.position.set(obj.x, obj.y, obj.z);
                scene.add(object);
                
                for (var i in object.children) {
                    objID.push(object.children[i].id);
                    objInfo.push([

                        object.children[i].id,
                        `<span class="info">${obj.caption}</span><br>`

                    ])
                }

                if (obj.id === "seat") {
                    for (var i in object.children) {
                        seatID.push(object.children[i].id);
                    }

                    object.add(sound);
                }
        })
    }

    document.addEventListener('keydown', onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        if (audioPlaying === true) {
            if (event.which == 77) {
                sound.pause();
                console.log('audio paused')
                audioPlaying = false
            }
        } else if (audioPlaying === false) {
            if (event.which == 77) {
                sound.play();
                console.log('audio playing')
                audioPlaying = true
            }
        }
    }
}

function generateHeight(width, height) {

    let seed = Math.PI / 4;
    window.Math.random = function () {

        const x = Math.sin(seed ++) * 10000;
        return x - Math.floor(x);

    };

    const size = width * height, data = new Uint8Array(size);
    const perlin = new ImprovedNoise(), z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j ++) {

        for (let i = 0; i < size; i ++) {

            const x = i % width, y = ~ ~ (i / width);
            data[i] += Math.abs(perlin.noise( x / quality, y / quality, z ) * quality * 1.75);

        }

        quality *= 5;

    }

    return data;

}

function generateTexture(data, width, height) {

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {

        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();

        shade = vector3.dot(sun);

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);

    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {

        const v = ~ ~ (Math.random() * 5);

        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;

    }

    context.putImageData(image, 0, 0);

    return canvasScaled;

}

function SIT__DOWN() {
    sitting = true;

    if (sitting === true) {
        // move camera
        controls.getObject().position.set(0, sittingHeight, -3);
        camera.lookAt(0, 7.5, 100)

        // lock walking
        speed = 0;
        _speed = 0;

        // display instructions
        document.getElementById('instructions').style.display = 'block'
        document.getElementById('instructions').innerHTML = `<span class="info">'Click' to stand up</span><br><span class="info">'M' to pause audio</span>`;

        document.addEventListener('click', STAND__UP);

        console.log('user sitting')
    }
}

function STAND__UP() {
    sitting = false;

    if (sitting === false) {
        // reset camera
        controls.getObject().position.set(0, standingHeight, 0);

        // unlock walking
        speed = 5.0;
        _speed = 100.0;

        document.getElementById('instructions').style.display = 'none'
        document.removeEventListener('click', STAND__UP);

        console.log('user standing')
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
}

function animate() {
    requestAnimationFrame(animate);
    render();

    if (controls.isLocked === true) {
        let objIntersections = (new THREE.Raycaster(
            camera.position, // origin
            camera.getWorldDirection(new THREE.Vector3()), // direction
            0, // near
            100)).intersectObjects(scene.children, true); //far

        if (objIntersections[0] && objID.indexOf(objIntersections[0].object.id) !== -1) {
            for (let i = 0; i < objInfo.length; i++) {
                if (objIntersections[0].object.id === objInfo[i][0]) {
                    document.querySelector('#artwork-caption p').innerHTML = objInfo[i][1];
                }
            }
            document.getElementById('artwork-caption').style.display = 'block';

            if (sitting === true) {
                document.getElementById('artwork-caption').style.display = 'none';
            }
        } else {
            document.getElementById('artwork-caption').style.display = 'none';
        }

        if (objIntersections[0] && seatID.indexOf(objIntersections[0].object.id) !== -1) {
            document.addEventListener('click', SIT__DOWN);

            if (sitting === true) {
                document.removeEventListener('click', SIT__DOWN)
            } else {
                document.addEventListener('click', SIT__DOWN);
            }
        } else {
            document.removeEventListener('click', SIT__DOWN);
        }

        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        if (moveForward || moveBackward) 
            velocity.z -= direction.z * _speed * delta;
        if (moveLeft || moveRight) 
            velocity.x -= direction.x * _speed * delta;
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        prevTime = time;
    }

    document.querySelector('.co-ord').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);
}