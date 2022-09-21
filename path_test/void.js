let camera, scene, renderer, controls;

const objects = [];

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

//

let position = 0;
let path_1, path_2;
let point_1, point_2;
let cubeMesh_1, cubeMesh_2;
//

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

    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        flatShading: true,
    });
    const cubeGeometry = new THREE.BoxBufferGeometry(10, 30, 10);
    cubeMesh_1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh_2 = cubeMesh_1.clone();
    scene.add(cubeMesh_1, cubeMesh_2);

    path_1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-18, 0, -365),
        new THREE.Vector3(-41, 0, -985),
        new THREE.Vector3(12, 0, -1173),
        new THREE.Vector3(290, 0, -1359),
        new THREE.Vector3(393, 0, 187),
        new THREE.Vector3(100, 0, 218),
    ], true, "centripetal");

    path_2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-494, 5, -2001),
        new THREE.Vector3(-536, 5, -2041),
        new THREE.Vector3(-573, 5, -2058),
        new THREE.Vector3(-633, 5, -2043),
        new THREE.Vector3(-780, 5, -1970),
        new THREE.Vector3(-898, 5, -2217),
        new THREE.Vector3(-628, 20, -2397),
        new THREE.Vector3(-578, 15, -2142),
        new THREE.Vector3(-563, 5, -2074),
        new THREE.Vector3(-537, 5, -2036),
        new THREE.Vector3(-445, 5, -1943),
        new THREE.Vector3(-371, 5, -1887),
        new THREE.Vector3(-222, 5, -1977),
        new THREE.Vector3(-66, 5, -1758),
        new THREE.Vector3(-306, 5, -1551),
        new THREE.Vector3(-357, 5, -1815),
        new THREE.Vector3(-416, 5, -1919)
    ], true, "centripetal");

    drawPath();
}

function drawPath() {
    const vertices_1 = path_1.getSpacedPoints(100);

    for (let i = 0; i < vertices_1.length; i++) {
        point_1 = vertices_1[i]
        vertices_1[i] = new THREE.Vector3(point_1.x, point_1.y, point_1.z);
    };

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices_1);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        visible: true,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    //

    const vertices_2 = path_2.getSpacedPoints(100);

    for (let i = 0; i < vertices_2.length; i++) {
        point_2 = vertices_2[i]
        vertices_2[i] = new THREE.Vector3(point_2.x, point_2.y, point_2.z);
    };

    const lineGeometry_2 = new THREE.BufferGeometry().setFromPoints(vertices_2);
    const lineMaterial_2 = new THREE.LineBasicMaterial({
        color: 0xffffff,
        visible: true,
    });
    const line_2 = new THREE.Line(lineGeometry_2, lineMaterial_2);
    scene.add(line_2);
}

function rect_Move() {
    const amount = 1;
    position += 0.0001;

    for (let i = 0; i < amount; i++) {
        point_1 = path_1.getPoint(position + 0.01 * i);
        cubeMesh_1.position.x = point_1.x;
        cubeMesh_1.position.y = point_1.y;
        cubeMesh_1.position.z = point_1.z;

        point_2 = path_2.getPoint(position + 0.01 * i);
        cubeMesh_2.position.x = point_2.x;
        cubeMesh_2.position.y = point_2.y;
        cubeMesh_2.position.z = point_2.z;
    }
}

function cameraSetup() {
    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000 
    );

    camera.position.y = 10;

    // const vector = new THREE.Vector3(1, 10, -1);

    // vector.applyQuaternion(camera.quaternion);

    // camera.lookAt(vector);
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

    const camera_location_array = [ //[x, z]
        // [0, 0],
        // [932, -1893],
        // [-354, -1793],
        // [-68, -2203],
        // [-25, -370],
        // [-36, -717],
        // [-61, -981],
        [-534, -2011]
    ]

    let camera_location_picker = Math.floor(Math.random() * camera_location_array.length);

    controls.getObject().position.x = camera_location_array[camera_location_picker][0];
    controls.getObject().position.z = camera_location_array[camera_location_picker][1];

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
            lane_1.position.set(-200, -2, -2500);
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
            bin_1.position.set(100, -2, -2500);
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
            bin_2.position.set(0, -14, -2300);
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

function render() {
    renderer.render(scene, camera);
}

function animate() {
    rect_Move();
    requestAnimationFrame(animate);
    render();

    const time = performance.now();

    if (controls.isLocked === true) {

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 600.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 600.0 * delta;

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);
    }

    // videoTexture.needsUpdate = true;
    prevTime = time;

    // console.log(camera.position);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}