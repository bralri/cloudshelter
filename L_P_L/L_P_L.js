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

let video, video2, video3, video4, video5, video6, video7;
let videoTexture, videoTexture2, videoTexture3, videoTexture4, videoTexture5, videoTexture6, videoTexture7;
let videoPlaneScreen5;

let width = window.innerWidth;
let height = window.innerHeight;

let bagModel, cakeModel, fruitModel, arcadeModelY;
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

//

init();
animate();

//

function init() {
    cameraSetup();
    sceneSetup();
    controlsSetup();
    loadModels();
    loadVideo();
    loadImg();
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
    //scene.fog = new THREE.Fog(midGrey, 0, 1800);

    const light = new THREE.HemisphereLight(white, midGrey, 0.5);
    light.position.set(0, 10, 0);
    scene.add(light);

    //

    const shadowLight1 = new THREE.DirectionalLight(white, 1);
    shadowLight1.position.set(0, 30, 0);
    shadowLight1.angle = Math.PI * 0.2;
    shadowLight1.castShadow = true;
    shadowLight1.shadow.mapSize.width = 2048;
    shadowLight1.shadow.mapSize.height = 2048;
    shadowLight1.shadow.camera.near = 0.1;
    shadowLight1.shadow.camera.far = 1000;
    shadowLight1.shadow.camera.left = -1000;
    shadowLight1.shadow.camera.right = 1000;
    shadowLight1.shadow.camera.top = 1000;
    shadowLight1.shadow.camera.bottom = -1000;
    scene.add(shadowLight1);

    //

    let floorGeometry = new THREE.PlaneGeometry(200, 200, 4, 4);
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
    floor.position.set(0, -3, 0);
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

    //

    const loader = new THREE.GLTFLoader(loadingManager);
    loader.load( //bag.glb

        '../Leisure_Pursuit_Lounge/models/bag.glb',

        function(bag) {
            bag.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            })
            bagModel = bag.scene;
            bagModel.position.set(0, 10, -20);
            bagModel.scale.set(2, 2, 2);
            scene.add(bagModel);
        }
    )

    loader.load( //cake.glb

        '../Leisure_Pursuit_Lounge/models/cake.glb',

        function(cake) {
            cake.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            })
            cakeModel = cake.scene;
            cakeModel.position.set(10, 10, -20);
            cakeModel.scale.set(2, 2, 2);
            scene.add(cakeModel);
        }
    )

    loader.load( //fruit.glb

        '../Leisure_Pursuit_Lounge/models/fruit.glb',

        function(fruit) {
            fruit.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            })
            fruitModel = fruit.scene;
            fruitModel.position.set(20, 10, -20);
            fruitModel.scale.set(2, 2, 2);
            scene.add(fruitModel);
        }
    )

}

function loadVideo() {
    video = document.getElementById("AI-SHIP");
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    let videoGeometry = new THREE.BoxGeometry(80, 45, 1);
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
    let videoPlaneScreen = new THREE.Mesh(videoGeometry, videoMaterial);
    videoPlaneScreen.position.set(0, 50, -50);
    videoPlaneScreen.receiveShadow = false;
    videoPlaneScreen.castShadow = false;
    scene.add(videoPlaneScreen);
    video.muted = true;
    video.play();

    //

    video2 = document.getElementById("Tanqueray");
    videoTexture2 = new THREE.VideoTexture(video2);
    videoTexture2.encoding = THREE.sRGBEncoding;
    videoTexture2.minFilter = THREE.LinearFilter;
    videoTexture2.magFilter = THREE.LinearFilter;
    let videoGeometry2 = new THREE.BoxGeometry(80, 45, 1);
    const videoMaterials2 = [
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
            map: videoTexture2, 
            side: THREE.FrontSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture2,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BACK
        })
    ]
    let videoMaterial2 = new THREE.MeshFaceMaterial(videoMaterials2);
    let videoPlaneScreen2 = new THREE.Mesh(videoGeometry2, videoMaterial2);
    videoPlaneScreen2.position.set(100, 50, -50);
    videoPlaneScreen2.receiveShadow = false;
    videoPlaneScreen2.castShadow = false;
    scene.add(videoPlaneScreen2);
    video2.muted = true;
    video2.play();

    //

    video3 = document.getElementById("PPT1609_1");
    videoTexture3 = new THREE.VideoTexture(video3);
    videoTexture3.encoding = THREE.sRGBEncoding;
    videoTexture3.minFilter = THREE.LinearFilter;
    videoTexture3.magFilter = THREE.LinearFilter;
    let videoGeometry3 = new THREE.BoxGeometry(25, 50, 1);
    const videoMaterials3 = [
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
            map: videoTexture3, 
            side: THREE.FrontSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture3,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BACK
        })
    ]
    let videoMaterial3 = new THREE.MeshFaceMaterial(videoMaterials3);
    let videoPlaneScreen3 = new THREE.Mesh(videoGeometry3, videoMaterial3);
    videoPlaneScreen3.position.set(-50, 30, -40);
    videoPlaneScreen3.receiveShadow = false;
    videoPlaneScreen3.castShadow = false;
    scene.add(videoPlaneScreen3);
    video3.muted = true;
    video3.play();

    //

    video4 = document.getElementById("PPT1609_2");
    videoTexture4 = new THREE.VideoTexture(video4);
    videoTexture4.encoding = THREE.sRGBEncoding;
    videoTexture4.minFilter = THREE.LinearFilter;
    videoTexture4.magFilter = THREE.LinearFilter;
    let videoGeometry4 = new THREE.BoxGeometry(25, 50, 1);
    const videoMaterials4 = [
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
            map: videoTexture4, 
            side: THREE.FrontSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture4,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BACK
        })
    ]
    let videoMaterial4 = new THREE.MeshFaceMaterial(videoMaterials4);
    let videoPlaneScreen4 = new THREE.Mesh(videoGeometry4, videoMaterial4);
    videoPlaneScreen4.position.set(-80, 30, -40);
    videoPlaneScreen4.receiveShadow = false;
    videoPlaneScreen4.castShadow = false;
    scene.add(videoPlaneScreen4);
    video4.muted = true;
    video4.play();

    //

    video5 = document.getElementById("bebe");
    videoTexture5 = new THREE.VideoTexture(video5);
    videoTexture5.encoding = THREE.sRGBEncoding;
    videoTexture5.minFilter = THREE.LinearFilter;
    videoTexture5.magFilter = THREE.LinearFilter;
    let videoGeometry5 = new THREE.PlaneGeometry(15, 30);
    const videoMaterials5 = new THREE.MeshPhongMaterial({
        
        map: videoTexture5, 
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: videoTexture5,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1

    })

    let videoMaterial5 = new THREE.MeshFaceMaterial(videoMaterials5);
    videoPlaneScreen5 = new THREE.Mesh(videoGeometry5, videoMaterial5);
    videoPlaneScreen5.position.set(0, 11, -40);
    videoPlaneScreen5.receiveShadow = false;
    videoPlaneScreen5.castShadow = false;
    scene.add(videoPlaneScreen5);
    video5.muted = true;
    video5.play();

    //

    video6 = document.getElementById("morph");
    videoTexture6 = new THREE.VideoTexture(video6);
    videoTexture6.encoding = THREE.sRGBEncoding;
    videoTexture6.minFilter = THREE.LinearFilter;
    videoTexture6.magFilter = THREE.LinearFilter;
    let videoGeometry6 = new THREE.PlaneGeometry(10, 15);
    videoGeometry6.rotateX(- Math.PI / 2);
    const videoMaterials6 = new THREE.MeshPhongMaterial({
        
        map: videoTexture6, 
        side: THREE.FrontSide,
        emissive: white,
        emissiveMap: videoTexture6,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1

    })

    let videoMaterial6 = new THREE.MeshFaceMaterial(videoMaterials6);
    let videoPlaneScreen6 = new THREE.Mesh(videoGeometry6, videoMaterial6);
    videoPlaneScreen6.position.set(0, -2, 0);
    videoPlaneScreen6.receiveShadow = false;
    videoPlaneScreen6.castShadow = false;
    scene.add(videoPlaneScreen6);
    video6.muted = true;
    video6.play();

    //

    video7 = document.getElementById("TOD_AD");
    videoTexture7 = new THREE.VideoTexture(video7);
    videoTexture7.encoding = THREE.sRGBEncoding;
    videoTexture7.minFilter = THREE.LinearFilter;
    videoTexture7.magFilter = THREE.LinearFilter;
    let videoGeometry7 = new THREE.BoxGeometry(40, 50, 1);
    const videoMaterials7 = [
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
            map: videoTexture7, 
            side: THREE.FrontSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture7,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: lightGrey, 
            side: THREE.DoubleSide //BACK
        })
    ]
    let videoMaterial7 = new THREE.MeshFaceMaterial(videoMaterials7);
    let videoPlaneScreen7 = new THREE.Mesh(videoGeometry7, videoMaterial7);
    videoPlaneScreen7.position.set(50, 30, -40);
    videoPlaneScreen7.receiveShadow = false;
    videoPlaneScreen7.castShadow = false;
    scene.add(videoPlaneScreen7);
    video7.muted = true;
    video7.play();
}

function loadImg() {

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

    videoTexture.needsUpdate = true; //AI-SHIP
    videoTexture2.needsUpdate = true; //Tanqueray-18
    videoTexture3.needsUpdate = true; //ppt1609_1
    videoTexture4.needsUpdate = true; //ppt1609_2
    videoTexture5.needsUpdate = true; //bebe
    videoTexture6.needsUpdate = true; //morph
    videoTexture7.needsUpdate = true; //TOD_AD

    let pos = camera.position;
    videoPlaneScreen5.lookAt(pos); //bebe lookat camera

    //model rotations
    // bagModel.rotation.y += 0.009;
    // cakeModel.rotation.y += 0.009;
    // fruitModel.rotation.y += 0.009;
    
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

    prevTime = time;

    renderer.render(scene, camera);
}