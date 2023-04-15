import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {Water2} from 'three/Water2.js';
import {artworks} from './_variables.js';

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

let exitRoom = false, sceneReady = false;

const urlParams = new URLSearchParams(window.location.search);
let roomNumb = parseInt(urlParams.get('room')) > artworks.length ? '0' : parseInt(urlParams.get('room')) <= artworks.length ? parseInt(urlParams.get('room')) : 0;

let objID = [];
let objInfo = [];
let door;

let playVideos = [];
let playSounds = [];
let playing = false;

const blocker = document.getElementById('blocker');
const title = document.getElementById('title');

function setup() {

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2500);

    const backgroundTxt = new THREE.TextureLoader().load("../assets/images/gwen/background.png");
    backgroundTxt.wrapS = THREE.RepeatWrapping;
    backgroundTxt.wrapT = THREE.RepeatWrapping;
    const backgroundCol = new THREE.Color(0xf7dff7);
    backgroundCol.convertSRGBToLinear();
    scene.background = backgroundCol;
    scene.fog = new THREE.FogExp2(backgroundCol, 0.003);
    // scene.fog = new THREE.Fog(backgroundCol, 1, 500);

    // Controls
    controls = new PointerLockControls(camera, document.body);
    controls.getObject().position.y = standingHeight;
    controls.addEventListener('lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    });
    title.addEventListener('click', function () {
        if (sceneReady) {
            controls.lock();
            playSoundsVideos();
        }
    });
    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp' : case 'KeyW' : moveForward = true; break;
            case 'ArrowLeft' : case 'KeyA' : moveLeft = true; break;
            case 'ArrowDown' : case 'KeyS' : moveBackward = true; break;
            case 'ArrowRight' : case 'KeyD' : moveRight = true; break;
        }
    };
   
    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp' : case 'KeyW' : moveForward = false; break;
            case 'ArrowLeft' : case 'KeyA' : moveLeft = false; break;
            case 'ArrowDown' : case 'KeyS' : moveBackward = false; break;
            case 'ArrowRight' : case 'KeyD' : moveRight = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener('resize', onWindowResize);

    // Lighting
    const ambLight = new THREE.AmbientLight(backgroundCol);
    scene.add(ambLight);

    const hemLight = new THREE.HemisphereLight(0xffffff, backgroundCol);
    scene.add(hemLight);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
    const waterCol = new THREE.Color(0xA0C090);
    waterCol.convertSRGBToLinear();
    const water2 = new Water2( waterGeometry, {
        color: waterCol,
        scale: 5,
        flowDirection: new THREE.Vector2(-1, -1),
        textureWidth: 1024,
        textureHeight: 1024
    } );
    water2.renderOrder = 1;
    water2.rotation.x = - Math.PI / 2;
    water2.position.y = -30;
    scene.add(water2);

    sceneReady = true;
    exitRoom = true;
}

const manager = new THREE.LoadingManager();

function loadArtworks() {
    const currentRoom = artworks[roomNumb];

    const doorGeometry = new THREE.BoxGeometry(50, 75, 25);
    const doorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 10, 200);
    scene.add(door);

    // GLB Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "glb") {

            const obj = artworks[roomNumb][i];
            loader.load(
                
                obj.src, 
                
                function (glb) {

                    object = glb.scene;
                    object.traverse(function(node) {
                        if (node.isMesh) {
                            node.material.opacity = obj.o;
                            node.material.transparent = obj.t;
                            node.renderOrder = 1;
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
    };

    // Audio Loader
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Load Videos
    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "video") {

            const obj = currentRoom[i];

            const video = document.getElementById(obj.id);
            videoTexture = new THREE.VideoTexture(video);
            videoTexture.encoding = THREE.sRGBEncoding;
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            const videoMaterial = new THREE.MeshStandardMaterial({
                map: videoTexture,
                side: THREE.DoubleSide,
                transparent: obj.transparency,
                opacity: 1
            });
            videoScreen = new THREE.Mesh(obj.geometry, videoMaterial);
            videoScreen.position.set(obj.x, obj.y, obj.z);
            videoScreen.renderOrder = 2;
    
            const sound = new THREE.PositionalAudio(audioListener);
            audioLoader.load(obj.audio, function (buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setRefDistance(1);
                sound.setVolume(obj.volume);
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
        }
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

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        // Display captions
        let objIntersections = (new THREE.Raycaster(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3()))).intersectObjects(scene.children, true);

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

        // Transport to next room
        if (camera.position.z >= door.position.z - 20 && camera.position.z <= door.position.z + 20 
            && camera.position.x >= door.position.x - 45 && camera.position.x <= door.position.x + 45) {
            controls.unlock();
            // overlay.classList.add('fade');
            // loading.classList.remove('fade');
            if ((roomNumb + 1) === artworks.length) {
                roomNumb = 0;
            } else {
                roomNumb++;
            }
            setTimeout(function () {
                window.location.href = `?room=${roomNumb}`;
            }, 1200)
        }

        // Controls
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

    // Update video textures
    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }

    // Display current co-ordinates
    document.querySelector('.co-ord').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = function() {
    setup();
    loadArtworks();
    document.body.appendChild(renderer.domElement);
    setTimeout(animate, 1000);
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
        if (roomNumb !== 0) {
            controls.lock()
        }
    }, 1000);

    let currentRoomName;
    if (roomNumb === 0) {
        currentRoomName = '"The Factory"'
    } else if (roomNumb === 1) {
        currentRoomName = '"Next Space etc"'
    }
    document.getElementById('room-name').innerHTML = currentRoomName;
}