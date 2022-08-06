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
let width = window.innerWidth;
let height = window.innerHeight;

let cloudModel, shelterModel;
let loadingManager;

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

init();
animate();

function init() {
    cameraSetup();
    sceneSetup();
    controlsSetup();
    loadModels();
    videoScreen();
    rendererSetup();
}

function cameraSetup() {
    camera = new THREE.PerspectiveCamera( 
        75, 
        width / height, 
        1, 
        2000 
    );
    camera.position.y = 10;
}

function sceneSetup() {
    scene = new THREE.Scene();
    scene.background = white;
    scene.fog = new THREE.Fog(white, 0, 115);

    const light = new THREE.HemisphereLight(white, lightGrey, 1);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const shadowLight1 = new THREE.DirectionalLight(white, 0.4);
    shadowLight1.position.set(0, 100, -70);
    shadowLight1.angle = Math.PI * 0.2;
    shadowLight1.castShadow = true;
    shadowLight1.shadow.mapSize.width = 2048;
    shadowLight1.shadow.mapSize.height = 2048;
    shadowLight1.shadow.camera.near = 0.1;
    shadowLight1.shadow.camera.far = 500;
    shadowLight1.shadow.camera.left = -300;
    shadowLight1.shadow.camera.right = 300;
    shadowLight1.shadow.camera.top = 300;
    shadowLight1.shadow.camera.bottom = -300;
    scene.add(shadowLight1);

    let floorGeometry = new THREE.PlaneGeometry(150, 150, 4, 4);
    floorGeometry.rotateX(- Math.PI / 2);
    let floorTexture = new THREE.TextureLoader(loadingManager).load('../img/floor2.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 2);
    floorTexture.offset.set(0.3, 0.5);
    floorTexture.anisotropy = 0;
    floorTexture.magFilter = THREE.NearestFilter;
    floorTexture.minFilter = THREE.NearestFilter;
    floorTexture.encoding = THREE.sRGBEncoding;

    let floorMaterial = new THREE.MeshLambertMaterial({
        map: floorTexture
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.z = -70;
    scene.add(floor);
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

function loadModels() {
    loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function() {
        console.log('Manager onLoad called, render started.');
    }
    loadingManager.onProgress = function(item, loaded, total) {
        console.log('Manager onProgress: loading of', item, 'finished: ', loaded, ' of ', total, 'objects loaded.');
    }
    const loader = new THREE.GLTFLoader(loadingManager);
    loader.load(

        './glb/untitled.glb',

        function(gltf1) {
            gltf1.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = false;
                    node.receiveShadow = false;

                    node.material.opacity = 0.5;
                    node.material.transparent = true;
                }
            })
            shelterModel = gltf1.scene;
            shelterModel.position.set(0, 0, -50);
            shelterModel.scale.set(0.6, 0.6, 0.6);
            //scene.add(shelterModel);
        }
    )
    loader.load(

        '../glb/cloud_model.gltf',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material = new THREE.MeshLambertMaterial({
                        color: lightGrey,
                        side: THREE.BackSide,
                    })
                    node.material.opacity = 0.9;
                    node.material.transparent = true;
                }
            })
            cloudModel = gltf2.scene;
            cloudModel.position.set(0, 35, -70);
            cloudModel.scale.set(30, 30, 30);
            scene.add(cloudModel);
        }
    )
}

function videoScreen() {
    video = document.getElementById("video");
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    let videoGeometry = new THREE.BoxGeometry(50, 50, 1);
    const videoMaterials = [
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //RIGHT
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //LEFT
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //TOP
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BOTTOM
        }),
        new THREE.MeshPhongMaterial({
            map: videoTexture, 
            side: THREE.FrontSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BACK
        })
    ]
    let videoMaterial = new THREE.MeshFaceMaterial(videoMaterials);
    let videoPlaneScreen= new THREE.Mesh(videoGeometry, videoMaterial);
    videoPlaneScreen.position.set(0, 30, -50);
    videoPlaneScreen.receiveShadow = false;
    videoPlaneScreen.castShadow = false;
    //scene.add(videoPlaneScreen);
    //video.play();
}

function rendererSetup() {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = width / heigh;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function update() {
    if (cloudModel) {
        cloudModel.rotation.y += 0.002;
    }
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

        if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;

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

    videoTexture.needsUpdate = true;

    prevTime = time;

    renderer.render(scene, camera);
}