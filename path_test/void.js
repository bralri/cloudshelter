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

let picnicVideo, picnicTexture, picnicPlaneScreen, picnicSound;
let elfVideo, elfTexture, elfPlaneScreen, elfSound;

let underpass_1, underpass_2;
let forest_1;
let lane_1, lane_2;
let bin_1, bin_2;

let degreeX = 0;
let degreeY = 0;
let degreeZ = 0;

let manager;

//

const up = new THREE.Vector3(1, 0, 0);
const axis = new THREE.Vector3();
let fraction = 0;
let path_1, path_2;
let point_1, point_2;

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

    drawPath();
    loadModels();
    loadVideos();


    rendererSetup();

    picnicVideo.play();
    elfVideo.play();
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
        picnicSound.setVolume(0.4);
        elfSound.setVolume(0.1);
    } );

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
        picnicSound.setVolume(0);
        elfSound.setVolume(0);
    } );

    const camera_location_array = [
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

function drawPath() {

    path_1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 8, 0),
        new THREE.Vector3(-18, 8, -365),
        new THREE.Vector3(-41, 8, -985),
        new THREE.Vector3(12, 8, -1173),
        new THREE.Vector3(290, 8, -1359),
        new THREE.Vector3(393, 8, 187),
        new THREE.Vector3(100, 8, 218),
    ], true, "centripetal");

    const vertices_1 = path_1.getSpacedPoints(100);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices_1);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        visible: false,
    });
    const line_1 = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line_1);

    //

    path_2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-494, 8, -2001),
        new THREE.Vector3(-536, 8, -2041),
        new THREE.Vector3(-573, 8, -2058),
        new THREE.Vector3(-633, 8, -2043),
        new THREE.Vector3(-780, 8, -1970),
        new THREE.Vector3(-898, 15, -2217),
        new THREE.Vector3(-628, 25, -2397),
        new THREE.Vector3(-578, 15, -2142),
        new THREE.Vector3(-563, 8, -2074),
        new THREE.Vector3(-537, 8, -2036),
        new THREE.Vector3(-445, 8, -1943),
        new THREE.Vector3(-371, 8, -1887),
        new THREE.Vector3(-222, 8, -1977),
        new THREE.Vector3(-66, 8, -1758),
        new THREE.Vector3(-306, 8, -1551),
        new THREE.Vector3(-357, 8, -1815),
        new THREE.Vector3(-416, 8, -1919)
    ], true, "centripetal");

    const vertices_2 = path_2.getSpacedPoints(100);

    const lineGeometry_2 = new THREE.BufferGeometry().setFromPoints(vertices_2);
    const lineMaterial_2 = new THREE.LineBasicMaterial({
        color: 0xffffff,
        visible: false,
    });
    const line_2 = new THREE.Line(lineGeometry_2, lineMaterial_2);
    scene.add(line_2);
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

function loadVideos() {
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    //Picnic.mov
    picnicVideo = document.getElementById("Picnic");
    picnicTexture = new THREE.VideoTexture(picnicVideo);
    picnicTexture.encoding = THREE.sRGBEncoding;
    picnicTexture.minFilter = THREE.LinearFilter;
    picnicTexture.magFilter = THREE.LinearFilter;
    picnicTexture.format = THREE.RGBAFormat;
    let picnicGeometry = new THREE.PlaneBufferGeometry(10, 20);
    picnicGeometry.rotateY(Math.PI / 2);
    const picnicMaterials = new THREE.MeshBasicMaterial({
        map: picnicTexture,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1
    });
    picnicPlaneScreen = new THREE.Mesh(picnicGeometry, picnicMaterials);
    picnicPlaneScreen.receiveShadow = false;
    picnicPlaneScreen.castShadow = false;
    scene.add(picnicPlaneScreen);
    //Picnic.mp3
    picnicSound = new THREE.PositionalAudio(audioListener);
    const picnicAudioLoader = new THREE.AudioLoader(manager);
    picnicAudioLoader.load('../sound/Alex/Picnic.mp3', function(buffer) {
        picnicSound.setBuffer(buffer);
        picnicSound.setLoop(true);
        picnicSound.setRefDistance(20);
        picnicSound.setVolume(0);
        picnicSound.setDirectionalCone(360, 360, 0.1);
        picnicSound.play();
    })
    picnicPlaneScreen.add(picnicSound);

    //Elf.mov
    elfVideo = document.getElementById("Elf");
    elfTexture = new THREE.VideoTexture(elfVideo);
    elfTexture.encoding = THREE.sRGBEncoding;
    elfTexture.minFilter = THREE.LinearFilter;
    elfTexture.magFilter = THREE.LinearFilter;
    elfTexture.format = THREE.RGBAFormat;
    let elfGeometry = new THREE.PlaneBufferGeometry(10, 20);
    elfGeometry.rotateY(Math.PI / 2);
    const elfMaterials = new THREE.MeshBasicMaterial({
        map: elfTexture,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1
    });
    elfPlaneScreen = new THREE.Mesh(elfGeometry, elfMaterials);
    elfPlaneScreen.receiveShadow = false;
    elfPlaneScreen.castShadow = false;
    scene.add(elfPlaneScreen);
    //Elf.mp3
    elfSound = new THREE.PositionalAudio(audioListener);
    const elfAudioLoader = new THREE.AudioLoader(manager);
    elfAudioLoader.load('../sound/Alex/Elf.mp3', function(buffer) {
        elfSound.setBuffer(buffer);
        elfSound.setLoop(true);
        elfSound.setRefDistance(20);
        elfSound.setVolume(0);
        elfSound.setDirectionalCone(360, 360, 0.1)
        elfSound.play();
    })
    elfPlaneScreen.add(elfSound);
}

function videoPlaneMove() {
    //picnicPlaneScreen
    const picnicPosition = path_2.getPoint(fraction);
    const picnicTangent = path_2.getTangent(fraction);
    picnicPlaneScreen.position.copy(picnicPosition);
    axis.crossVectors(up, picnicTangent).normalize();
    const picnicRadians = Math.acos(up.dot(picnicTangent));
    picnicPlaneScreen.quaternion.setFromAxisAngle(axis, picnicRadians);

    //elfPlaneScreen
    const elfPosition = path_1.getPoint(fraction);
    const elfTangent = path_1.getTangent(fraction);
    elfPlaneScreen.position.copy(elfPosition);
    axis.crossVectors(up, elfTangent).normalize();
    const elfRadians = Math.acos(up.dot(elfTangent));
    elfPlaneScreen.quaternion.setFromAxisAngle(axis, elfRadians);

    fraction += 0.0001;
    if (fraction > 1) {
        fraction = 0;
    }
}

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

    picnicTexture.needsUpdate = true;
    elfTexture.needsUpdate = true;
}

function animate() {
    videoPlaneMove();
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
    prevTime = time;

    // console.log(camera.position);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}