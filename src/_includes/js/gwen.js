import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {Water2} from 'three/Water2.js';
import {world, cannonBodies, cannonReady, cannonInit} from '../js/_cannonConfig.min.js'
import {assets} from '../js/_config.min.js';

let camera, scene, renderer, controls, object, videoScreen, videoTexture, sound;

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let objID = [], objInfo = [], meshes = [];
let playVideos = [], playSounds = []; let playing = false;

const urlParams = new URLSearchParams(window.location.search);
export let roomNumb = parseInt(urlParams.get('room')) > assets.length ? '0' : parseInt(urlParams.get('room')) <= assets.length ? parseInt(urlParams.get('room')) : 0;
const currentRoom = assets[roomNumb];
let door;

const manager = new THREE.LoadingManager();
manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
manager.onLoad = function() {
    console.log('Loading complete!');
};
manager.onError = function(url) {
    console.error('There was an error loading ' + url)
};

const loading = document.getElementById('loading');
const title = document.getElementById('title');
const overlay = document.getElementById('overlay');

let sceneReady = false;

function init() {

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);

    const backgroundTxt = new THREE.TextureLoader(manager).load("../assets/images/gwen/background.png");
    backgroundTxt.wrapS = THREE.RepeatWrapping; backgroundTxt.wrapT = THREE.RepeatWrapping;

    scene.background = new THREE.Color(0xf7dff7).convertSRGBToLinear();
    scene.fog = new THREE.FogExp2(scene.background, 0.0025);

    for (let i = 0; i < currentRoom.length; i++) {

        const obj = currentRoom[i];

        if (obj.cannonObject) {
            const geometry = obj.geometry;
            const material = new THREE.MeshBasicMaterial({
                color: obj.c,
                wireframe: obj.w,
                side: THREE.DoubleSide
            });
    
            const mesh = new THREE.Mesh(geometry, material);
    
            scene.add(mesh);
            meshes.push(mesh);
        }
    }

    // Controls
    controls = new PointerLockControls(camera, document.body);
    controls.getObject().position.y = 15;
    controls.addEventListener('lock', function () {
        overlay.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        overlay.style.display = 'block';
    });
    title.addEventListener('click', function () {
        if (sceneReady && cannonReady) {
            controls.lock();
            playSoundsVideos();
        }
    }, false);
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
    renderer = new THREE.WebGLRenderer({
        antialias: true, 
        alpha: true
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // Lighting
    const ambLight = new THREE.AmbientLight(scene.background);
    scene.add(ambLight);

    const hemLight = new THREE.HemisphereLight(0xffffff, scene.background);
    scene.add(hemLight);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(5000, 5000);
    const waterCol2 = new THREE.Color(0xA0C090).convertSRGBToLinear();
    const water2 = new Water2(
        waterGeometry, 
        {
            color: waterCol2,
            scale: 10,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 1024,
            textureHeight: 1024
        } 
    );
    water2.renderOrder = 1;
    water2.rotation.x = - Math.PI / 2;
    water2.position.y = -30;
    scene.add(water2);

    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "door") {
            document.getElementById('room-name').innerHTML = currentRoom[i].currentRoom;
        }
    }

    overlay.classList.remove('loading');

    sceneReady = true;
}

function loadAssets() {

    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "door") {

            const obj = currentRoom[i];

            const doorGeometry = new THREE.BoxGeometry(50, 75, 25);
            const doorMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide
            });
            door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(obj.x, 10, obj.y);
            scene.add(door);

            objID.push(door.id);
            objInfo.push(
                [door.id, 
                    `
                    <span class="artist">Journey to <i>${obj.nextRoom}</i> ?</span>
                    <br>
                    <br>
                    <br>
                    `
                ]
            );
        }
    }

    // Audio Loader
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // GLB Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "glb") {

            const obj = currentRoom[i];
            loader.load(
                
                obj.src, 
                
                function (glb) {

                    object = glb.scene;
                    object.traverse(function(node) {
                        if (node.isMesh) {
                            node.material.opacity = obj.o;
                            node.material.transparent = obj.t;
                            node.renderOrder = 2;
                            node.side = THREE.DoubleSide;
                        }
                    })
                    object.position.set(obj.x, obj.y, obj.z);
                    object.scale.set(obj.scale, obj.scale, obj.scale);
                    scene.add(object);

                    for (var i in object.children) {
                        objID.push(object.children[i].id);
                        objInfo.push(
                            [object.children[i].id,
                                `
                                <span class="artist">${obj.id}</span><br>
                                <i>${obj.title}</i><br>
                                <span class="info">${obj.info}</span>
                                `
                            ]
                        )
                    }
            })
        }
    };
    

    // Load Videos
    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "video") {

            const obj = currentRoom[i];

            const video = document.createElement('video');
            video.addEventListener('loadedmetadata', onMediaLoad, false);
            video.src = obj.src; video.id = obj.id;
            video.width = obj.width; video.height = obj.height;
            video.style.display = "none"; video.loop = true;
            video.playsInline = true; video.muted = true; video.preload = "auto";
            manager.itemStart(obj.src);
            videoTexture = new THREE.VideoTexture(video);
            videoTexture.encoding = THREE.sRGBEncoding
            videoScreen = new THREE.Mesh(
                new THREE.PlaneGeometry(video.width / 10, video.height / 10), 
                new THREE.MeshStandardMaterial({
                    map: videoTexture,
                    side: THREE.DoubleSide,
                    transparent: obj.transparency,
                    opacity: 1
                })
            );
            videoScreen.position.set(obj.x, obj.y, obj.z);
            videoScreen.renderOrder = 2;
    
            // videoScreenClone = videoScreen.clone()
            // videoScreenClone.position.set(obj.x, obj.y, obj.z);
            // videoScreenClone.rotation.y = Math.PI / 1;

            if (obj.audio) {
                    sound = new THREE.PositionalAudio(audioListener);
                    sound.addEventListener('loadedmetadata', onMediaLoad, false);
                    manager.itemStart(obj.audio);
                    audioLoader.load(obj.audio, function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(true);
                    sound.setRefDistance(obj.ref);
                    sound.setVolume(obj.volume);
                    sound.setDirectionalCone(360, 360, 0);
                });

                playSounds.push(sound);
                videoScreen.add(sound);
            }

            scene.add(videoScreen);
            playVideos.push(video);
    
            objID.push(videoScreen.id);
            objInfo.push(
                [videoScreen.id, 
                    `
                    <span class="artist">${obj.id}</span><br>
                    <i>${obj.title}</i><br>
                    <span class="info">${obj.info}</span>
                    `
                ]);

            document.getElementById('videos').appendChild(video);

            function onMediaLoad() {
                video.removeEventListener('loadedmetadata', onMediaLoad, false);
                sound.removeEventListener('loadedmetadata', onMediaLoad, false);
                manager.itemEnd(obj.src)
                manager.itemEnd(obj.audio);
            }
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

        // Start CANNON World Physics
        world.step(1 / 60);

        // Raycaster Events
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

        // Transport to the next room
        if (camera.position.z >= door.position.z - 20 && camera.position.z <= door.position.z + 20 
            && camera.position.x >= door.position.x - 45 && camera.position.x <= door.position.x + 45) {
            controls.unlock();
            title.classList.add('fade');
            loading.classList.remove('fade');
            if ((roomNumb + 1) === assets.length) {
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
        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 5.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        if (moveForward || moveBackward) velocity.z -= direction.z * 300.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 300.0 * delta;
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        prevTime = time;
    }

    // Update video textures
    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }

    // CANNON Bodys
    for (let i = 0; i < meshes.length; i++) {
        meshes[i].position.copy(cannonBodies[i].position);
        meshes[i].quaternion.copy(cannonBodies[i].quaternion);
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
    cannonInit();
    init();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(function() {
        loading.classList.add('fade');
        if (roomNumb !== 0) {
            controls.lock()
        }
    }, 1000);
}