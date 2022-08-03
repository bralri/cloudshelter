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
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const shadowLight1 = new THREE.PointLight(0xffffff, 0.6);
    shadowLight1.position.set(-20, 100, -70);
    shadowLight1.angle = Math.PI * 0.2;
    shadowLight1.castShadow = true;

    shadowLight1.shadow.mapSize.width = 512;
    shadowLight1.shadow.mapSize.height = 512;
    shadowLight1.shadow.camera.near = 0.5;
    shadowLight1.shadow.camera.far = 500;

    scene.add(shadowLight1);

    const shadowLight2 = new THREE.PointLight(0xffffff, 0.2);
    shadowLight2.position.set(20, 100, 70);
    shadowLight2.angle = Math.PI * 0.2;
    shadowLight2.castShadow = true;

    shadowLight2.shadow.mapSize.width = 512;
    shadowLight2.shadow.mapSize.height = 512;
    shadowLight2.shadow.camera.near = 0.5;
    shadowLight2.shadow.camera.far = 500;

    scene.add(shadowLight2);

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

    let floorGeometry = new THREE.PlaneGeometry(500, 500);
    floorGeometry.rotateX(- Math.PI / 2);
    let floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xE1E1E1,
        side: THREE.DoubleSide
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.z = -50;
    scene.add(floor);

    //cube test
    let cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    let cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 20, -50);
    cube.castShadow = true;
    //scene.add(cube);

    const shelterLoader = new THREE.GLTFLoader();
    shelterLoader.load(

        './glb/untitled.glb',

        function(gltf) {
            gltf.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            })
            shelterModel = gltf.scene;
            shelterModel.position.set(0, 0, -50);
            shelterModel.scale.set(0.6, 0.6, 0.6);
            scene.add(shelterModel);
        }
    )

    //video
    // video = document.getElementById("video");
    // videoTexture = new THREE.VideoTexture(video);
    // videoTexture.minFilter = THREE.LinearFilter;
    // videoTexture.magFilter = THREE.LinearFilter;

    // const videoMaterial = new THREE.MeshPhongMaterial({
    //     map: videoTexture,
    //     side: THREE.DoubleSide,
    //     toneMapped: false
    // });

    // let videoGeometry = new THREE.PlaneGeometry(10, 10);
    // let videoCubeScreen= new THREE.Mesh(videoGeometry, videoMaterial);
    // videoCubeScreen.position.set(0, 10, -20);
    // videoCubeScreen.castShadow = true;
    // scene.add(videoCubeScreen);
    // video.play();

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

function animate() {
    requestAnimationFrame(animate);

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

    // videoTexture.needsUpdate = true;

    prevTime = time;

    renderer.render(scene, camera);
}