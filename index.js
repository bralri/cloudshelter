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

//colours
const white = new THREE.Color(0xffffff);
white.convertSRGBToLinear();
const lightGrey = new THREE.Color(0xD3D3D3);
lightGrey.convertSRGBToLinear();
const midGrey = new THREE.Color(0x63666A);
midGrey.convertSRGBToLinear();
const lightBlue = new THREE.Color(0xADD8E6);
lightBlue.convertSRGBToLinear();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 
        75, 
        width / height, 
        1, 
        2000 
    );
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = white;
    scene.fog = new THREE.Fog(white, 0, 150);

    const light = new THREE.HemisphereLight(white, lightGrey, 1);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const shadowLight1 = new THREE.DirectionalLight(lightGrey, 0.4);
    shadowLight1.position.set(-20, 150, -70);
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

    // floor

    let floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
    floorGeometry.rotateX(- Math.PI / 2);
    let floorMaterial = new THREE.MeshLambertMaterial({
        color: lightGrey,
        side: THREE.DoubleSide
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.z = -50;
    floor.position.y = 0.4;
    scene.add(floor);

    //loding manager
    const loadingManager = new THREE.LoadingManager();
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
                    console.log(node);
                }
            })
            shelterModel = gltf1.scene;
            shelterModel.position.set(0, 0, -50);
            shelterModel.scale.set(0.6, 0.6, 0.6);
            //scene.add(shelterModel);
        }
    )
    loader.load(

        './glb/cloud.gltf',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = false;
                    node.receiveShadow = false;

                    node.material.opacity = 0.8;
                    node.material.transparent = true;
                }
            })
            cloudModel = gltf2.scene;
            cloudModel.position.set(-50, 120, -50);
            cloudModel.scale.set(30, 30, 30);
            scene.add(cloudModel);
        }
    )


    //video
    video = document.getElementById("video");
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: videoTexture,

        transparent: false,
        opacity: 0.1
    });

    let videoGeometry = new THREE.PlaneGeometry(50, 50);
    // let videoGeometry = new THREE.PlaneGeometry(11.5, 14.5);
    //videoGeometry.rotateY(- Math.PI / 2);
    let videoPlaneScreen= new THREE.Mesh(videoGeometry, videoMaterial);
    //videoPlaneScreen.position.set(-13.1, 9.5, -51.2);
    videoPlaneScreen.position.set(0, 35, -50);
    videoPlaneScreen.receiveShadow = true;
    //let videoScreen2 = videoPlaneScreen.clone();
    //videoScreen2.position.set(-12.61, 9.5, -51.2);
    //scene.add(videoScreen2);
    scene.add(videoPlaneScreen);
    video.play();

    const videoLight1 = new THREE.PointLight(white, 5);
    videoLight1.position.set(-12.61, 7, -51.2);
    videoLight1.decay = 2;
    //scene.add(videoLight1);

    //

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

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {
    camera.aspect = width / heigh;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function update() {
    if (cloudModel) {
        cloudModel.rotation.y += 0.0005;
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