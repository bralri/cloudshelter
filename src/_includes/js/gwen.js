import * as THREE from 'three';
import { PointerLockControls } from 'three/PointerLockControls.js';
import { Water } from 'three/Water.js';
import { Water2 } from 'three/Water2.js';
import { createAssetInstance, colour, texture, audioListener, animationActions } from './_config.min.js';
import { room } from './_room.min.js';

let scene, world, camera, controls, renderer, water;
const worldSize = 5000;

let prevTime = performance.now();
let moveLeft = false, moveRight = false;
let moveForward = false, moveBackward = false;
const moveVelocity = new THREE.Vector3();
const moveDirection = new THREE.Vector3();

const assetId = [];
const assetCaption = [];

const interactiveAssetId = [];
const interactiveAsset = [];

const playVideos = [];
const playAudio = [];
const animations = [];

const assetBodies = [], assetMeshes = []; // rename these and figure out a better?? way to do this
const assetsToThrow = []; // better naming convention? exact same as assetMeshes??????
let canShoot = true;

const urlParams = new URLSearchParams(window.location.search);
let roomIndex =  parseInt(urlParams.get('room')) > room.length ? '0' : parseInt(urlParams.get('room')) <= room.length ? parseInt(urlParams.get('room')) : 0;
const currentRoom = room[roomIndex]; 
const portals = [];

const loading = document.getElementById('loading');
const title = document.getElementById('title');
const overlay = document.getElementById('overlay');

let heldAsset = null;

let playing = false;
let sceneReady = false;
let assetReady = false;

const init = () => {
    // Scene
    scene = new THREE.Scene();
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
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
        if (sceneReady && assetReady) {
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
            scale: 3.7,
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
    if (currentRoom.length > 0) {
        currentRoom.forEach((asset) => {
            const assetInstance = createAssetInstance(asset.id, asset.x, asset.y, asset.z, asset.w);
            assetInstance.then((instance) => {
                if (instance.video && instance.videoTexture) {
                    playVideos.push({video: instance.video, texture: instance.videoTexture});
                }
                if (instance.audio) {
                    playAudio.push({audio: instance.audio});
                }
                if (instance.mesh.userData.id.startsWith('portal')) {
                    portals.push({mesh: instance.mesh, data: instance.mesh.userData});
                    // portals.forEach((portal) => {
                    //     scene.add(portal.data.debugPortalMesh);
                    // });
                }
                if (instance.getMixer) {
                    animations.push({mixer: instance.getMixer.mixer, clock: new THREE.Clock()});
                }
                if (asset.type === 'asset-to-throw') { // figure out a way to do this better
                    assetsToThrow.push({mesh: instance.mesh, body: instance.body});
                } else {
                    if (instance.mesh.userData.caption) {
                        assetId.push(instance.mesh.id);
                        assetCaption.push({id: instance.mesh.id, caption: instance.mesh.userData.caption});
                    }
                    if (instance.mesh.userData.method) {
                        interactiveAssetId.push(instance.mesh.id);
                        interactiveAsset.push({
                            id: instance.mesh.id,
                            mesh: instance.mesh,
                            origin: instance.mesh.position, 
                            offset: -50,
                            hasBeenThrown: instance.mesh.userData.hasBeenThrown,
                            method: instance.mesh.userData.method
                        });
                    }
                    scene.add(instance.mesh);
                }
            }).catch(error => {
                console.log(error);
            });
        });
    }
    assetReady = true;
}

const playAssets = () => {
    if (!playing) {
        playVideos.forEach((asset) => {
            if (asset.video.readyState >= asset.video.HAVE_ENOUGH_DATA) {
                asset.video.play();
            } else  {
                console.log(`Video ${asset.video.id} could not play`);
                asset.texture.dispose();
                console.log(`Video texture ${asset.texture.source.data.id} disposed`);
                scene.remove(asset.video, asset.texture);
                console.log(`Video ${asset.video.id} removed from scene`);
            }
        })
        playAudio.forEach((asset) => {
            asset.audio.play();
        })
        animationActions.forEach((animation) => {
            animation.play();
        })
    }
    playing = true;
}

const pickUpAsset = (asset) => {
    if (!controls.isLocked && !asset || asset.hasBeenThrown) {
        return;
    }
    heldAsset = asset;
    camera.add(asset);
    const cameraOffset_z = -50;
    const cameraOffset_y = cameraOffset_z / 2;
    asset.position.set(0, cameraOffset_y, cameraOffset_z);
    asset.quaternion.copy(asset.quaternion);
    canThrow(asset);
}

const canThrow = (asset) => {
    asset.userData.caption = `<span class="artist">LMB to throw</span>`;
    console.log(asset.userData.caption)
    const dropAsset = () => {
        if (asset.hasBeenThrown) {
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
            if (!isShaking || asset.hasBeenThrown) {
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
                shootAssets(asset.amountOfBoxes);
                setTimeout(() => {
                    canShoot = true;
                }, 1000);
            } else {
                requestAnimationFrame(shakeAsset);
            }
        }
        window.addEventListener('click', shakeAsset);
    }
    window.addEventListener('click', dropAsset);
}

const shootAssets = (amountOfBoxes) => {

    const shootVelocity = 20;

    const pickAssetsToThrow = (array, numItems) => {
        if (numItems >= array.length) {
            return array;
        } else {
            let shuffledArray = array.slice();
            shuffledArray.forEach((_, i) => {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            });
            return shuffledArray.slice(0, numItems);
        }
    };

    let amountToShoot = pickAssetsToThrow(assetsToThrow, amountOfBoxes);

    const getShootDir = (targetVec) => {
        const vector = targetVec;
        vector.set(0, 0, -1);
        vector.unproject(camera);
        const cameraPosition = camera.position;
        vector.sub(cameraPosition).normalize();
        const randomOffset = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().multiplyScalar(5);
        const assetPosition = cameraPosition.clone().add(vector.multiplyScalar(20)).add(randomOffset);

        return assetPosition;
    }

    if (!canShoot || !controls.isLocked) {
        return;
    }
    canShoot = false;
    const shootDirection = new THREE.Vector3();
    getShootDir(shootDirection);

    amountToShoot.forEach((asset, i) => {
        world.addBody(asset.body);
        scene.add(asset.mesh);

        const spreadFactor = Math.random() * 3;
        const randomSpread = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).multiplyScalar(spreadFactor);
        shootDirection.add(randomSpread).normalize().multiplyScalar(shootVelocity);
        asset.body.velocity.copy(shootDirection);
        const positionOffset = shootDirection.clone().normalize().multiplyScalar(asset.body.shapes[0].boundingSphereRadius * 1.02 + 2 + i * 2);
        const assetPosition = getShootDir(shootDirection).add(positionOffset);
        asset.body.position.copy(assetPosition);
        asset.mesh.position.copy(assetPosition);

        assetBodies.push(asset.body);
        assetMeshes.push(asset.mesh);

        if (assetBodies.length > 20) {
            world.removeBody(...assetBodies.splice(0, 1));
            scene.remove(...assetMeshes.splice(0, 1));
        }
    })
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
    assetBodies.forEach((asset, i) => {
        assetMeshes[i].position.copy(asset.position);
        assetMeshes[i].quaternion.copy(asset.quaternion);
    })

    if (controls.isLocked === true) {

        const raycaster = (
            new THREE.Raycaster(
                camera.position,
                camera.getWorldDirection(
                    new THREE.Vector3()
                ),
            )
        ).intersectObjects(scene.children, true);
        
        if (raycaster[0] && assetId.indexOf(raycaster[0].object.parent.id) !== -1) {
            assetCaption.forEach((asset, i) => {
                if (raycaster[0].object.parent.id === asset.id) {
                    document.querySelector('#caption p').innerHTML = asset.caption;
                }
            })
            document.getElementById('caption').style.display = 'block';
        } else {
            document.getElementById('caption').style.display = 'none';
        }


        if (raycaster[0] && interactiveAssetId.indexOf(raycaster[0].object.parent.id) !== -1) {
            for (let i = 0; i < interactiveAsset.length; i++) {
                if (raycaster[0].object.parent.id === interactiveAsset[i].id) {
                    document.addEventListener('click', () => {
                        pickUpAsset(interactiveAsset[i].mesh);
                    });
                }
            }
        } else {
            document.removeEventListener('click', () => {
                pickUpAsset()
            });
        }
        if (heldAsset) {
            heldAsset.rotation.y += 0.003;
        }

        portals.forEach((portal) => {
            if (camera.position.distanceTo(portal.data.portalPosition) <= portal.data.portalRadius) {
                controls.unlock();
                title.classList.add('fade');
                loading.classList.remove('fade');
                roomIndex = portal.data.roomNum;
                setTimeout(() => {
                    window.location.href = `?room=${roomIndex}`;
                }, 1200);
            }
        });

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

        world.step(1 / 30);

        if (playVideos) {
            playVideos.forEach((asset) => {
                setInterval(() => {
                    if (asset.video.readyState >= asset.video.HAVE_ENOUGH_DATA) {
                        asset.texture.needsUpdate = true;
                    }
                }, 1000 / 30);
            })
        }
        
        if (animations) {
            animations.forEach((animation) => {
                animation.mixer.update(animation.clock.getDelta());
            })
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
    if (sceneReady && assetReady) {
        setTimeout(() => {
            loading.classList.add('fade');
            if (roomIndex !== 0) {
                controls.lock();
            }
        }, 1000);
    }
}