let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();

let video, videoTexture;

let underpass_1, underpass_2;
let forest_1;
let lane_1, lane_2;
let bin_1, bin_2;

let degreeX = 0;
let degreeY = 0;
let degreeZ = 0;

let manager;

const white = new THREE.Color(0xffffff);
white.convertSRGBToLinear();
const lightGrey = new THREE.Color(0xD3D3D3);
lightGrey.convertSRGBToLinear();
const midGrey = new THREE.Color(0x63666A);
midGrey.convertSRGBToLinear();
const lightBlue = new THREE.Color(0xADD8E6);
lightBlue.convertSRGBToLinear();
const black = new THREE.Color(0x000000);
black.convertSRGBToLinear();

//

init();
animate();

//

function init() {
    cameraSetup();
    sceneSetup();
    controlsSetup();

    loadingManager();

    loadModels();
    // videoScreen();
    rendererSetup();
}

function cameraSetup() {
    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000 
    );
    camera.position.y = 10;
}

function sceneSetup() {
    scene = new THREE.Scene();
    scene.background = black;
    scene.fog = new THREE.Fog(midGrey, 0, 1800);

    const ambLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambLight);

    const light = new THREE.HemisphereLight(midGrey, black, 0.5);
    light.position.set(0, 10, 0);
    scene.add(light);
}

function controlsSetup() {
    controls = new THREE.PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const title = document.getElementById( 'title');

    title.addEventListener('click', function () {
        controls.lock();
    } );

    controls.addEventListener( 'lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    } );

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

    
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
}

function loadingManager() {
    manager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    });

}

function rotateObject(object, degreeX, degreeY, degreeZ) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function loadModels() {
    const loader = new THREE.GLTFLoader(manager);
    //entrance_lane
    loader.load(

        './entrance_lane.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            lane_2 = gltf2.scene;
            lane_2.position.set(-32, -2, -740);
            lane_2.scale.set(0.5, 0.5, 0.5);

            scene.add(lane_2);
        }
    )

    //underpass_1
    loader.load(

        './underpass_1.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            underpass_1 = gltf2.scene;
            underpass_1.position.set(1000, -2.5, -2000);
            underpass_1.scale.set(1, 1, 1);
            rotateObject(underpass_1, 0, 45, 2);

            scene.add(underpass_1);
        }
    )
    //underpass_2
    loader.load(

        './underpass_2.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            underpass_2 = gltf2.scene;
            underpass_2.position.set(-500, -2.5, -2000);
            underpass_2.scale.set(1.5, 1.5, 1.5);
            rotateObject(underpass_2, 0, 45, 0);

            scene.add(underpass_2);
        }
    )
    //forest_1
    loader.load(

        './forest_1.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            forest_1 = gltf2.scene;
            forest_1.position.set(0, -2, -2500);
            forest_1.scale.set(0.5, 0.5, 0.5);

            scene.add(forest_1);
        }
    )
    //lane_1
    loader.load(

        './lane_1.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            lane_1 = gltf2.scene;
            lane_1.position.set(-100, -2, -2500);
            lane_1.scale.set(0.5, 0.5, 0.5);

            scene.add(lane_1);
        }
    )
    //bin_1
    loader.load(

        './bin_1.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            bin_1 = gltf2.scene;
            bin_1.position.set(250, -2, -2500);
            bin_1.scale.set(0.2, 0.2, 0.2);

            scene.add(bin_1);
        }
    )
    //forest_structure
    loader.load(

        './bin_2.glb',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;

                    node.material.emissive = white;
                    node.material.emissiveMap = node.material;
                    node.material.emissiveIntensity = 2;
                    node.material.opacity = 1;
                    node.material.transparent = false;
                }
            })

            bin_2 = gltf2.scene;
            bin_2.position.set(0, -2, -2300);
            bin_2.scale.set(0.2, 0.2, 0.2);

            scene.add(bin_2);
        }
    )
}

// function videoScreen() {
//     video = document.getElementById("video");
//     videoTexture = new THREE.VideoTexture(video);
//     videoTexture.encoding = THREE.sRGBEncoding;
//     videoTexture.minFilter = THREE.LinearFilter;
//     videoTexture.magFilter = THREE.LinearFilter;
//     let videoGeometry = new THREE.BoxGeometry(50, 50, 1);
//     const videoMaterials = [
//         new THREE.MeshBasicMaterial({
//             color: lightGrey, 
//             side: THREE.DoubleSide //RIGHT
//         }),
//         new THREE.MeshBasicMaterial({
//             color: lightGrey, 
//             side: THREE.DoubleSide //LEFT
//         }),
//         new THREE.MeshBasicMaterial({
//             color: lightGrey, 
//             side: THREE.DoubleSide //TOP
//         }),
//         new THREE.MeshBasicMaterial({
//             color: lightGrey, 
//             side: THREE.DoubleSide //BOTTOM
//         }),
//         new THREE.MeshPhongMaterial({
//             map: videoTexture, 
//             side: THREE.FrontSide, //FRONT
//             emissive: white,
//             emissiveMap: videoTexture,
//             emissiveIntensity: 1,
//             transparent: false,
//             opacity: 0.5
//         }),
//         new THREE.MeshBasicMaterial({
//             color: lightGrey, 
//             side: THREE.DoubleSide //BACK
//         })
//     ]
//     let videoMaterial = new THREE.MeshFaceMaterial(videoMaterials);
//     let videoPlaneScreen= new THREE.Mesh(videoGeometry, videoMaterial);
//     videoPlaneScreen.position.set(0, 30, -50);
//     videoPlaneScreen.receiveShadow = false;
//     videoPlaneScreen.castShadow = false;
//     //scene.add(videoPlaneScreen);
//     //video.play();
// }

function rendererSetup() {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    // if (cloudModel) {
    //     cloudModel.rotation.y += 0.002;
    // }
    // if (cloudModel2) {
    //     cloudModel2.rotation.y += 0.002;
    // }
    // if (cloudModel3) {
    //     cloudModel3.rotation.y += 0.002;
    // }
    // if (cloudModel4) {
    //     cloudModel4.rotation.y += 0.002;
    // }
}

function animate() {
    requestAnimationFrame(animate);
    update()

    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects, false);

        const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 600.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 600.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;
        }

    }

    // videoTexture.needsUpdate = true;

    prevTime = time;

    renderer.render(scene, camera);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}