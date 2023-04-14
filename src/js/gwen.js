import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {Water2} from 'three/Water2.js';

import {models, videos} from './_variables.js';

let camera, scene, renderer, controls, object;
let videoScreen, videoTexture;

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

let playVideos = [];
let playSounds = [];
let playing = false;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    const backgroundTxt = new THREE.TextureLoader().load("../assets/images/gwen/background.png");
    backgroundTxt.wrapS = THREE.RepeatWrapping;
    backgroundTxt.wrapT = THREE.RepeatWrapping;
    
    const backgroundCol = new THREE.Color(0xf7dff7);
    backgroundCol.convertSRGBToLinear();

    scene.background = backgroundCol;
    // scene.fog = new THREE.FogExp2(backgroundCol, 0.001);
    scene.fog = new THREE.Fog(backgroundCol, 1, 500);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2500);

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
        playSoundsVideos();
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
    var light = new THREE.AmbientLight(backgroundCol);
    scene.add(light);

    const hemLight = new THREE.HemisphereLight(0xffffff, backgroundCol);
    scene.add(hemLight);

    const manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
    }

    // Ground
    const groundG = new THREE.PlaneGeometry(10000, 10000);
    const groundM = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const ground = new THREE.Mesh(groundG, groundM);
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -15;
    // scene.add(ground);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
    const waterCol = new THREE.Color(0xA0C090);
    waterCol.convertSRGBToLinear();
    const water2 = new Water2( waterGeometry, {
        color: waterCol,
        scale: 5,
        flowDirection: new THREE.Vector2(-1, -1),
        textureWidth: 1024,
        textureHeight: 1024
    } );
    water2.rotation.x = - Math.PI / 2;
    water2.position.y = -30;
    scene.add(water2);

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
                        node.material.opacity = obj.o;
                        node.material.transparent = obj.t;
                    }
                })
                object.position.set(obj.x, obj.y, obj.z);
                object.scale.set(2, 2, 2);
                scene.add(object);

                for (var i in object.children) {
                    objID.push(object.children[i].id);
                    objInfo.push([
                        object.children[i].id,
                        `
                            <span class="artist">Gwen Senhui Chen</span><br>
                            <i>${obj.title}</i><br>
                            <span class="info">${obj.info}</span>
                        `
                    ])
                }
        })
    }

    // Audio Loader
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Load Videos
    for (let i = 0; i < videos.length; i++) {
        const obj = videos[i];
        const video = document.getElementById(obj.ID);
        videoTexture = new THREE.VideoTexture(video);
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        const videoMaterial = new THREE.MeshStandardMaterial({
            map: videoTexture,
            side: THREE.DoubleSide,
            // emissive: 0xffffff,
            // emissiveIntensity: 1,
            // emissiveMap: videoTexture,
            transparent: obj.transparency,
            opacity: 1
        });
        videoScreen = new THREE.Mesh(obj.geometry, videoMaterial);
        videoScreen.position.set(obj.x, obj.y, obj.z);

        const sound = new THREE.PositionalAudio(audioListener);
        audioLoader.load(obj.MP3, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setRefDistance(2);
            sound.setVolume(2);
            sound.setDirectionalCone(360, 360, 0);
        });

        playSounds.push(sound);
        videoScreen.add(sound);
        scene.add(videoScreen);
        playVideos.push(video);

        objID.push(videoScreen.id);
        objInfo.push(
            [videoScreen.id, 
                `
                <span class="artist">Gwen Senhui Chen</span><br>
                <i>${obj.title}</i><br>
                <span class="info">${obj.info}</span>
                `
            ]
        );
    };
}

function playSoundsVideos() {
    if (!playing) {
        for (let i = 0; i < playVideos.length; i++) {
            playVideos[i].play();
        }
        for (let i = 0; i < playSounds.length; i++) {
            playSounds[i].play();
        }
    }
    playing = true;
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);

    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }
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