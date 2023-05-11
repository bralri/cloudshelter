import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {Water2} from 'three/Water2.js';
import {assets} from '../js/_config.min.js';
import {throwBoxes} from '../js/_shootBoxes.min.js';

let camera, scene, renderer, controls, object, videoScreen, videoTexture, sound;
let groundPlaneMesh, groundPlaneBody, groundPhysicsMaterial;
let sceneReady = false, cannonReady = false;
const manager = new THREE.LoadingManager();
const world = new CANNON.World();
const worldSize = 2000; // x2

let moveForward = false, moveBackward = false
let moveLeft = false, moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let objID = [], objInfo = [];
let boxes = [], boxMeshes = [];
let playVideos = [], playSounds = [], playing = false;

const urlParams = new URLSearchParams(window.location.search);
let roomNumb =  parseInt(urlParams.get('room')) > assets.length ? '0' : 
                parseInt(urlParams.get('room')) <= assets.length ? parseInt(urlParams.get('room')) : 
                0;
const currentRoom = assets[roomNumb];
let door;

let isCubeHeld = false;
let heldCube = null;
let angle;
let cubeMeshTest;
let amountOfBoxes;
let cubes = [], cubeID = [];

const loading = document.getElementById('loading');
const title = document.getElementById('title');
const overlay = document.getElementById('overlay');

function cannonInit() {

    world.gravity.set(0, -9.82 * 2, 0);

    groundPhysicsMaterial = new CANNON.Material("groundPhysicsMaterial");
    groundPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(worldSize, worldSize, 0.01)),
        position: new CANNON.Vec3(0, -31, 0),
        material: groundPhysicsMaterial
    })
    groundPlaneBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundPlaneBody);

    cannonReady = true;
}

function init() {

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);

    const backgroundTxt = new THREE.TextureLoader(manager).load("../assets/images/gwen/background.png");
    backgroundTxt.wrapS = THREE.RepeatWrapping; backgroundTxt.wrapT = THREE.RepeatWrapping;

    scene.background = new THREE.Color(0xf7dff7).convertSRGBToLinear();
    scene.fog = new THREE.FogExp2(scene.background, 0.0025);

    // Global CANNON ground plane
    const geometryFromBody = groundPlaneBody.shapes[0].halfExtents;
    const groundGeometry = new THREE.PlaneGeometry(geometryFromBody.x * 2, geometryFromBody.y * 2);
    groundPlaneMesh = new THREE.Mesh(
        groundGeometry,
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        })
    )
    groundPlaneMesh.position.copy(groundPlaneBody.position);
    groundPlaneMesh.quaternion.copy(groundPlaneBody.quaternion);
    scene.add(groundPlaneMesh);

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
    const waterCol2 = new THREE.Color(0xA0C090).convertSRGBToLinear();
    const water2 = new Water2(
        groundGeometry, 
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

    createCube();

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
    const hologramVideos = currentRoom.filter(obj => obj.type === "video" && obj.hologram);
    const numHologramVideos = hologramVideos.length;
    const hologramHeight = 100;
    const hologramRadius = Math.sin(Math.PI / numHologramVideos) * 250;

    for (let i = 0; i < currentRoom.length; i++) {
        if (currentRoom[i].type === "video") {

            const obj = currentRoom[i];

            const video = document.createElement('video');
            video.src = obj.src;
            video.id = obj.id;
            video.width = obj.width;
            video.height = obj.height;
            video.style.display = "none";
            video.loop = true;
            video.playsInline = true;
            video.muted = true;
            video.preload = "auto";
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

            if (obj.hologram) {
                const angle = (i / numHologramVideos) * Math.PI * 2;
                videoScreen.position.set(
                    hologramRadius * Math.cos(angle),
                    hologramHeight,
                    hologramRadius * Math.sin(angle)
                );
                videoScreen.lookAt(new THREE.Vector3(0, hologramHeight, 0));
                videoScreen.rotation.y += Math.PI;
            } else {
                videoScreen.position.set(obj.x, obj.y, obj.z);
            }

            videoScreen.renderOrder = 2;

            if (obj.audio) {
                sound = new THREE.PositionalAudio(audioListener);
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

function createCube() {
    const cubeSize = 20;
    for (let i = 0; i < 5; i++) {
        amountOfBoxes = i + 1;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
        cubeMesh.position.set((i * 50) - 100, -25, -100);

        let hasBeenThrown = false
    
        scene.add(cubeMesh);
        cubeID.push(cubeMesh.id);
        cubes.push([
            cubeMesh.id,
            cubeMesh,
            cubeMesh.position,
            amountOfBoxes,
            hasBeenThrown
        ]);

        objID.push(cubeMesh.id);
        objInfo.push(
            [cubeMesh.id, 
                `
                <span class="artist">Pick me up!</span>
                `
            ]
        );
    }
}

function pickUpBox(cubeMesh) {
    if (heldCube || !cubeMesh) {
        return;
    };
  
    isCubeHeld = true;
    let amountOfBoxes = cubeMesh[3];
    scene.remove(cubeMesh[1]);
  
    scene.add(cubeMesh[1]);
    camera.add(cubeMesh[1]);
    cubeMesh[2].set(0, 0, -40);
  
    heldCube = cubeMesh;
    heldCube[5] = new THREE.Quaternion().copy(heldCube[1].quaternion);

    objInfo.push(
        [cubeMesh[0], `<span class="artist">Click to throw me!</span>`]
    );

    const dropBox = () => {
        if (!isCubeHeld && !heldCube) {
            return;
        };

        isCubeHeld = false;
        window.removeEventListener('click', dropBox);

        angle = 0;
        const shakeDuration = 300;
        const shakeIntensity = 0.05;
        const shakeAxis = new THREE.Vector3(1, 0, 0);
        const initialRotation = new THREE.Quaternion().copy(cubeMesh[1].quaternion);
        let elapsedTime = 0;
        let isShaking = true;
        const clock = new THREE.Clock();

        const shake = () => {
            if (!isShaking) {
                return;
            };

            elapsedTime += clock.getDelta() * 1000;
            const shakeAngle = Math.random() * Math.PI * 2;
            const shakeRotation = new THREE.Quaternion().setFromAxisAngle(shakeAxis, shakeAngle).normalize();
            const targetRotation = new THREE.Quaternion().copy(initialRotation).multiply(shakeRotation);
            const newRotation = new THREE.Quaternion().slerp(targetRotation, shakeIntensity).normalize();
            cubeMesh[1].quaternion.copy(newRotation);
            requestAnimationFrame(shake);

            if (!cubeMesh[4] && elapsedTime >= shakeDuration) {
                cubeMesh[4] = true;
                camera.remove(cubeMesh[1]);
                scene.remove(cubeMesh[1]);
                throwBoxes(world, scene, camera, controls, boxes, boxMeshes, amountOfBoxes);
                isShaking = false;
                heldCube = null;
            };
        };

        window.addEventListener('click', shake);
    };

    window.addEventListener('click', dropBox);
}

function animate() {
    requestAnimationFrame(animate);

    for(let i = 0; i < boxes.length; i++){
        boxMeshes[i].position.copy(boxes[i].position);
        boxMeshes[i].quaternion.copy(boxes[i].quaternion);
    };

    if (controls.isLocked === true) {

        world.step(1 / 60);

        // Display captions
        let objIntersections = (new THREE.Raycaster(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3()))).intersectObjects(scene.children, true);

        if (objIntersections[0] && objID.indexOf(objIntersections[0].object.id) !== -1) {
            for (let i = 0; i < objInfo.length; i++) {
                if (objIntersections[0].object.id === objInfo[i][0]) {
                    document.querySelector('#artwork-caption p').innerHTML = objInfo[i][1];
                };
            };
            document.getElementById('artwork-caption').style.display = 'block';
        } else {
            document.getElementById('artwork-caption').style.display = 'none';
        };

        if (objIntersections[0] && cubeID.indexOf(objIntersections[0].object.id) !== -1) {
            for (let i = 0; i < cubes.length; i++) {
                if (objIntersections[0].object.id === cubes[i][0]) {
                    cubeMeshTest = cubes[i];
                };
            };
            document.addEventListener('click', function() {
                if (cubeMeshTest) {
                    pickUpBox(cubeMeshTest)
                };
            });
        } else {
            document.removeEventListener('click', function() {pickUpBox});
            isCubeHeld = false;
        }
        if (heldCube) {
            angle = 0.003;
            const position = heldCube[2].clone();
            const axis = new THREE.Vector3(-1, 0, 0);
            const rotationAxis = position.clone().cross(axis).normalize();
            const rotation = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
            heldCube[1].quaternion.multiply(rotation);
        };
          

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
            };
            setTimeout(function () {
                window.location.href = `?room=${roomNumb}`;
            }, 1200);
        };

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
    };

    // Update video textures
    if (videoTexture) {
        videoTexture.needsUpdate = true;
    };
    
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
    if (sceneReady && cannonReady) {
        setTimeout(function() {
            loading.classList.add('fade');
            if (roomNumb !== 0) {
                controls.lock()
            }
        }, 1000);
    };
}