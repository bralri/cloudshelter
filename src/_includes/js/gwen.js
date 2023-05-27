import * as THREE from 'three';
import { PointerLockControls } from 'three/PointerLockControls.js';
import { Water } from 'three/Water.js';
import { Water2 } from 'three/Water2.js';
import { createAssetInstance, roomAssets, colour, texture, audioListener, animationActions } from './_config.min.js';
import { shootAssets } from '../js/_shootBOXES.min.js';

let scene, world, camera, controls, renderer, water;
const worldSize = 5000;

let prevTime = performance.now();
let moveLeft = false, moveRight = false;
let moveForward = false, moveBackward = false;
const moveVelocity = new THREE.Vector3();
const moveDirection = new THREE.Vector3();

const playVideos = [];
const playAudio = [];
const animationMixers = [];
const animationClocks = [];

const assetBodies = [], assetMeshes = []; // rename these and figure out a better?? way to do this
const assetsToThrow = []; // better naming convention?

const urlParams = new URLSearchParams(window.location.search);
let roomNumb =  parseInt(urlParams.get('room')) > roomAssets.length ? '0' : parseInt(urlParams.get('room')) <= roomAssets.length ? parseInt(urlParams.get('room')) : 0;
const currentRoom = roomAssets[roomNumb]; 
const portals = [];

const loading = document.getElementById('loading');
const title = document.getElementById('title');
const overlay = document.getElementById('overlay');

let playing = false;
let heldAsset = null;
let assetsReady = false;
let sceneReady = false;

const init = () => {
    // Scene
    scene = new THREE.Scene();
    world = new CANNON.World();
    world.gravity.set(0, -9.82 * 2, 0);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4000);
    camera.add(audioListener);

    const backgroundTexture = texture.background;
    // if (roomNumb > 0) {
    //     scene.background = colour.pink;
    // } else {
    //     scene.background = backgroundTexture;
    // }
    scene.background = colour.pink;
    scene.fog = new THREE.FogExp2(scene.background, 0.001);

    // Controls
    controls = new PointerLockControls(camera, document.body);
    controls.getObject().position.set(0, 10, -20);

    controls.addEventListener('lock', function () {
        overlay.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        overlay.style.display = 'block';
    });
    title.addEventListener('click', function () {
        if (sceneReady) {
            controls.lock();
            playAssets();
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
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // CANNON Plane
    const groundGeometry = new THREE.PlaneGeometry(worldSize, worldSize);
    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(worldSize / 2, worldSize / 2, 0.01)),
        position: new CANNON.Vec3(0, -30, 0)
    })
    groundBody.quaternion.setFromEuler(- Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Water
    water = new Water( // reflective
        groundGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: texture.waterNormal,
            sunDirection: new THREE.Vector3(),
            sunColor: colour.pink,
            waterColor: colour.green,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = - Math.PI / 2;
    water.position.y = -30;

    const water2 = new Water2( // transparent
        groundGeometry, 
        {
            color: colour.green,
            scale: 10,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 512,
            textureHeight: 512
        }
    );
    water2.renderOrder = 1;
    water2.rotation.x = - Math.PI / 2;
    water2.position.y = -28;
    scene.add(water, water2);

    // Lights
    const ambientLight = new THREE.AmbientLight(colour.pink);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(colour.green, colour.pink);
    scene.add(hemisphereLight);

    //

    overlay.classList.remove('loading');
    
    sceneReady = true;
}

const loadAssets = () => {
    for (let i = 0; i < currentRoom.length; i++) {
        const assetInstance = createAssetInstance(
            currentRoom[i].assetId, 
            currentRoom[i].x, 
            currentRoom[i].y, 
            currentRoom[i].z,
            currentRoom[i].w
        );
        assetInstance.then((asset) => {
        // Videos
            if (currentRoom[i].type === 'video') {
                playVideos.push([asset.video, asset.videoTexture]);
                if (asset.audio) {
                    playAudio.push(asset.audio);
                }
            }

        // Audio objects
            if (currentRoom[i].type === 'audioObject') {
                playAudio.push(asset.audio);
            }
            
        // Models
            if (currentRoom[i].type === 'glb') {
                asset.mesh.userData = asset.userData;
                // Portals
                if (asset.userData.id.startsWith('portal')) {
                    scene.add(asset.userData.debugPortalMesh);
                    portals.push(asset.mesh);
                };
                // Assets to throw
                if (currentRoom[i].method === 'asset-to-throw') {
                    assetsToThrow.push(asset.mesh);
                }
                // Models with animations
                if (asset.getMixer) {
                    animationMixers.push(asset.getMixer.mixer);
                    for (let i = 0; i < animationMixers.length; i++) {
                        const clock = new THREE.Clock();
                        animationClocks.push(clock);
                    }
                }
            }
            
        // Add assets to scene
            if (currentRoom[i].method !== 'asset-to-throw') {
                scene.add(asset.mesh);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    assetsReady = true;
}

const playAssets = () => {
    if (!playing) {
        for (let i = 0; i < playVideos.length; i++) {
            if (playVideos[i][0].readyState >= playVideos[i][0].HAVE_ENOUGH_DATA) {
                playVideos[i][0].play();
            }
        }
        for (let i = 0; i < playAudio.length; i++) {
            playAudio[i].play();
        }
        for (let i = 0; i < animationActions.length; i++) {
            animationActions[i].play();
        }
    }
    playing = true;
}

const pickUpAsset = (asset) => {
    if (!controls.isLocked && !asset || asset.userData.hasBeenThrown) {
        return;
    }
  
    heldAsset = asset;

    camera.add(asset);
    const cameraOffset_z = -90;
    const cameraOffset_y = cameraOffset_z / 2;
    asset.position.set(0, cameraOffset_y, cameraOffset_z);
    asset.quaternion.copy(asset.userData.quaternion);
    
    if (asset.userData.method.canThrow) {
        canThrow(asset);
    } else {
        putDown(asset);
    }
}

const canThrow = (asset) => {

    asset.userData.caption = `<span class="artist">LMB to throw</span>`;

    const dropAsset = () => {
        if (asset.userData.hasBeenThrown) {
            return;
        }

        window.removeEventListener('click', dropAsset);

        const shakeDuration = 300;
        const shakeIntensity = 0.05;
        const initialRotation = asset.quaternion.clone();
        let elapsedTime = 0;
        let isShaking = true;
        const clock = new THREE.Clock();

        const shakeAsset = () => {
            if (!isShaking || asset.userData.hasBeenThrown) {
                return;
            }

            window.removeEventListener('click', shakeAsset);

            elapsedTime += clock.getDelta() * 1000;

            const shakeAngle = THREE.MathUtils.randFloat(0, Math.PI * 2);
            const shakeRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), shakeAngle).normalize();
            const targetRotation = new THREE.Quaternion().copy(initialRotation).multiply(shakeRotation);
            const newRotation = new THREE.Quaternion().slerp(targetRotation, shakeIntensity).normalize();
            asset.quaternion.copy(newRotation);

            if (elapsedTime >= shakeDuration) {

                asset.userData.hasBeenThrown = true;
                isShaking = false;
                heldAsset = null;

                camera.remove(asset);
                scene.remove(asset);

                shootAssets(
                    world, 
                    scene, 
                    camera, 
                    controls, 
                    assetBodies,
                    assetMeshes,
                    asset,
                    assetsToThrow, // rename
                    asset.userData.amountOfBoxes
                );
            } else {
                requestAnimationFrame(shakeAsset);
            }
        }

        window.addEventListener('click', shakeAsset);
    }

    window.addEventListener('click', dropAsset);
}

const putDown = (asset) => {

    asset.userData.caption = `<span class="artist">LMB to put down</span>`;

    const dropAsset = () => {
        if (asset.userData.hasBeenThrown) {
            return;
        }

        window.removeEventListener('click', dropAsset);

        const PUTDOWNTHEFUCKINGASSET = () => {
            if (asset.userData.hasBeenThrown) {
                return;
            }

            window.removeEventListener('click', PUTDOWNTHEFUCKINGASSET);
            
            heldAsset = null;
            asset.userData.caption = null;

            asset.position.set(-100, -28, -200);
            camera.remove(asset);
            scene.add(asset);
        }

        window.addEventListener('click', PUTDOWNTHEFUCKINGASSET);
    }

    window.addEventListener('click', dropAsset);
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
    requestAnimationFrame(animate);

    // Update meshes and bodies used when 'throwing' assets
    for(let i = 0; i < assetBodies.length; i++){
        assetMeshes[i].position.copy(assetBodies[i].position);
        assetMeshes[i].quaternion.copy(assetBodies[i].quaternion);
    }

    if (controls.isLocked === true) {

        world.step(1 / 30);

        // Raycaster
        const raycaster = (
            new THREE.Raycaster(
                camera.position,
                camera.getWorldDirection(new THREE.Vector3()),
            )).intersectObjects(scene.children, true);

        if (raycaster.length > 0) {
            const asset = raycaster[0].object;
            // Captions
            if (asset.userData.caption) {
                document.querySelector('#caption p').innerHTML = asset.userData.caption;
                document.getElementById('caption').style.display = 'block';
            } else if (asset.parent.userData.caption) {
                document.querySelector('#caption p').innerHTML = asset.parent.userData.caption;
                document.getElementById('caption').style.display = 'block';
            } else {
                document.getElementById('caption').style.display = 'none';
            }

            // Check if asset has method function
            if (asset.userData.method) {
                if (asset.userData.method.pickUp) {
                    document.addEventListener('click', () => {
                        pickUpAsset(asset.userData.mesh);
                    })
                } else if (asset.userData.mesh && asset.userData.hasBeenThrown) {
                    document.removeEventListener('click', () => {
                        pickUpAsset();
                    });
                }
            } else if (asset.parent.userData.method) {
                if (asset.parent.userData.method.pickUp) {
                    document.addEventListener('click', () => {
                        pickUpAsset(asset.parent);
                    })
                } else if (asset.parent && asset.userData.hasBeenThrown) {
                    document.removeEventListener('click', () => {
                        pickUpAsset();
                    });
                }
            }
        }
        if (heldAsset) {
            heldAsset.rotation.y += 0.003;
        }

        // Room Portals
        for (let i = 0; i < portals.length; i++) {
            if (camera.position.distanceTo(portals[i].userData.portalPosition) <= portals[i].userData.portalRadius) {
                controls.unlock();
                title.classList.add('fade');
                loading.classList.remove('fade');
                roomNumb = portals[i].userData.roomNumb;
                setTimeout(() => {
                    window.location.href = `?room=${roomNumb}`;
                }, 1200);
            }
        }

        // Update Controls
        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        moveVelocity.x -= moveVelocity.x * 5.0 * delta;
        moveVelocity.z -= moveVelocity.z * 5.0 * delta;
        moveDirection.z = Number(moveForward) - Number(moveBackward);
        moveDirection.x = Number(moveRight) - Number(moveLeft);
        moveDirection.normalize();
        if (moveForward || moveBackward) moveVelocity.z -= moveDirection.z * 300.0 * delta;
        if (moveLeft || moveRight) moveVelocity.x -= moveDirection.x * 300.0 * delta;
        controls.moveRight(-moveVelocity.x * delta);
        controls.moveForward(-moveVelocity.z * delta);
        prevTime = time;
    }

    // Update Video Textures
    if (playVideos) {
        for (let i = 0; i < playVideos.length; i++) {
            setInterval(() => {
                if (playVideos[i][0].readyState >= playVideos[i][0].HAVE_ENOUGH_DATA) {
                    playVideos[i][1].needsUpdate = true;
                }
            }, 1000 / 30);
        }
    }
    
    // Model Animations
    if (animationMixers) {
        for (let i = 0; i < animationMixers.length; i++) {
            animationMixers[i].update(animationClocks[i].getDelta());
        }
    }

    document.querySelector('.co-ord').innerHTML =  Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);;
    water.material.uniforms['time'].value += 1 / 30;
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    loadAssets();
    setTimeout(animate, 1000);
    if (sceneReady && assetsReady) {
        setTimeout(() => {
            loading.classList.add('fade');
            if (roomNumb !== 0) {
                controls.lock();
            }
        }, 1000);
    }
}