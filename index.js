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
const color = new THREE.Color();

let video, videoTexture;
let width = window.innerWidth;
let height = window.innerHeight;

let cloudModel, shelterModel;

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
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 120);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const shadowLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight1.position.set(-20, 150, -70);
    shadowLight1.angle = Math.PI * 0.2;
    shadowLight1.castShadow = true;

    shadowLight1.shadow.mapSize.width = 4096;
    shadowLight1.shadow.mapSize.height = 4096;
    shadowLight1.shadow.camera.near = 0.1;
    shadowLight1.shadow.camera.far = 500;

    shadowLight1.shadow.camera.left = -100;
    shadowLight1.shadow.camera.right = 100;
    shadowLight1.shadow.camera.top = 100;
    shadowLight1.shadow.camera.bottom = -100;
    

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

    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1000, 1000);
    floorGeometry.rotateX(- Math.PI / 2);
    let floorMaterial = new THREE.MeshLambertMaterial({
        color: 0xE1E1E1,
        side: THREE.DoubleSide
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.z = -50;
    floor.position.y = 0.4;
    scene.add(floor);

    const loader = new THREE.GLTFLoader();
    loader.load(

        './glb/untitled.glb',

        function(gltf1) {
            gltf1.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            shelterModel = gltf1.scene;
            shelterModel.position.set(0, 0, -50);
            shelterModel.scale.set(0.6, 0.6, 0.6);
            scene.add(shelterModel);
        }
    )
    loader.load(
        './glb/cloud.gltf',

        function(gltf2) {
            gltf2.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            cloudModel = gltf2.scene;
            cloudModel.position.set(-50, 90, -50);
            cloudModel.scale.set(20, 20, 20);
            scene.add(cloudModel);
        }
    )


    //video
    video = document.getElementById("video");
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const videoMaterial = new THREE.MeshPhongMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
        emissive: 0xffffff,
        emissiveMap: videoTexture,
        emissiveIntensity: 2,
    });

    let videoGeometry = new THREE.PlaneGeometry(11.5, 14.5);
    videoGeometry.rotateY(- Math.PI / 2);
    let videoPlaneScreen= new THREE.Mesh(videoGeometry, videoMaterial);
    videoPlaneScreen.position.set(-13.68, 9.5, -51.2);
    videoPlaneScreen.receiveShadow = true;
    let videoScreen2 = videoPlaneScreen.clone();
    videoScreen2.position.set(-12.61, 9.5, -51.2);
    scene.add(videoScreen2);
    scene.add(videoPlaneScreen);
    video.play();

    const videoLight1 = new THREE.PointLight(0xADD8E6, 1);
    videoLight1.position.set(-12.61, 7, -51.2);
    //videoLight1.distance = 1;
    videoLight1.decay = 2;

    scene.add(videoLight1);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(videoLight1, sphereSize);
    //scene.add(pointLightHelper)

    //

    renderer = new THREE.WebGLRenderer({ 
        antialias: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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