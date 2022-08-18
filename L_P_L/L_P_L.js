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

let video, video2, video6, video7;
let PPT1609_1, PPT1609_2, bebeVideo;
let videoTexture, videoTexture2, videoTexture5, videoTexture6, videoTexture7;
let PPT1609_1_Texture, PPT1609_2_Texture, bebeTexture;
let videoPlaneScreen6;
let bebePlaneScreen;
let videoPlaneScreen4;
let videoPlaneScreen3;
let videoPlaneScreen2;
let videoPlaneScreen;

let width = window.innerWidth;
let height = window.innerHeight;

let bagModel, cakeModel, fruitModel, arcadeModelY;
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
const pink = new THREE.Color(0xFF47E6);
pink.convertSRGBToLinear();
const darkPink = new THREE.Color(0xD03BBB);
darkPink.convertSRGBToLinear();

//

init();
animate();

//

function init() {
    cameraSetup();
    sceneSetup();
    controlsSetup();
    rendererSetup();

    loadingManager();

    loadModels();
    loadVideos();
    loadAudios();
    loadImgs();

    document.body.addEventListener('keydown', onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        if (keyCode == 89) { //Y
            window.open('https://www.gwens.online/ppt1609', '_blank').focus();
        }
    }
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
    scene.background = pink;
    scene.fog = new THREE.Fog(pink, 0, 160);

    const light = new THREE.HemisphereLight(pink, darkPink, 0.5);
    light.position.set(0, 10, 0);
    scene.add(light);

    //

    const shadowLight1 = new THREE.DirectionalLight(darkPink, 1);
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
    let floorTexture = new THREE.TextureLoader(manager).load('../img/floor2.png');
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

function loadingManager() {
    manager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    });
}

function loadModels() {

    const loader = new THREE.GLTFLoader(manager);
    loader.load( //bag.glb

        '../Leisure_Pursuit_Lounge/models/bag_e.glb',

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

        '../Leisure_Pursuit_Lounge/models/cake_e.glb',

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

        '../Leisure_Pursuit_Lounge/models/fruit_e.glb',

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

function loadVideos() {
    video = document.getElementById("AI-SHIP");
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    let videoGeometry = new THREE.PlaneBufferGeometry(80, 45);
    const videoMaterials = new THREE.MeshPhongMaterial({

            map: videoTexture, 
            side: THREE.DoubleSide,
            emissive: white,
            emissiveMap: videoTexture,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5

    })

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
    let videoGeometry2 = new THREE.PlaneBufferGeometry(80, 45);
    const videoMaterials2 = new THREE.MeshPhongMaterial({

            map: videoTexture2, 
            side: THREE.DoubleSide, //FRONT
            emissive: white,
            emissiveMap: videoTexture2,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5

    })

    let videoMaterial2 = new THREE.MeshFaceMaterial(videoMaterials2);
    let videoPlaneScreen2 = new THREE.Mesh(videoGeometry2, videoMaterial2);
    videoPlaneScreen2.position.set(100, 50, -50);
    videoPlaneScreen2.receiveShadow = false;
    videoPlaneScreen2.castShadow = false;
    scene.add(videoPlaneScreen2);
    video2.muted = true;
    video2.play();

    // PPT1609 Video BoxPanel

    PPT1609_1 = document.getElementById("PPT1609_1");
    PPT1609_1_Texture = new THREE.VideoTexture(PPT1609_1);
    PPT1609_1_Texture.encoding = THREE.sRGBEncoding;
    PPT1609_1_Texture.minFilter = THREE.LinearFilter;
    PPT1609_1_Texture.magFilter = THREE.LinearFilter;

    PPT1609_2 = document.getElementById("PPT1609_2");
    PPT1609_2_Texture = new THREE.VideoTexture(PPT1609_2);
    PPT1609_2_Texture.encoding = THREE.sRGBEncoding;
    PPT1609_2_Texture.minFilter = THREE.LinearFilter;
    PPT1609_2_Texture.magFilter = THREE.LinearFilter;

    let PPT1609_Geometry = new THREE.BoxBufferGeometry(25, 50, 5);
    const PPT1609_Materials = [
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
            map: PPT1609_1_Texture, 
            side: THREE.DoubleSide, //FRONT
            emissive: white,
            emissiveMap: PPT1609_1_Texture,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        }),  
        new THREE.MeshPhongMaterial({
            map: PPT1609_2_Texture, 
            side: THREE.DoubleSide, //BACK
            emissive: white,
            emissiveMap: PPT1609_2_Texture,
            emissiveIntensity: 1,
            transparent: false,
            opacity: 0.5
        })
    ]

    let PPT1609_Material = new THREE.MeshFaceMaterial(PPT1609_Materials);
    let PPT1609_PlaneScreen = new THREE.Mesh(PPT1609_Geometry, PPT1609_Material);
    PPT1609_PlaneScreen.position.set(-35, 22.1, -40);
    PPT1609_PlaneScreen.receiveShadow = false;
    PPT1609_PlaneScreen.castShadow = false;

    scene.add(PPT1609_PlaneScreen);

    PPT1609_1.muted = true;
    PPT1609_1.play();
    PPT1609_2.muted = true;
    PPT1609_2.play();

    // Bebe Video & Podium

    bebeVideo = document.getElementById("bebe");
    bebeTexture = new THREE.VideoTexture(bebeVideo);
    bebeTexture.encoding = THREE.sRGBEncoding;
    bebeTexture.minFilter = THREE.LinearFilter;
    bebeTexture.magFilter = THREE.LinearFilter;
    let bebeGeometry = new THREE.PlaneBufferGeometry(15, 30);
    const bebeMaterials = new THREE.MeshPhongMaterial({
        
        map: bebeTexture, 
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: bebeTexture,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1

    })

    let bebeMaterial = new THREE.MeshFaceMaterial(bebeMaterials);
    bebePlaneScreen = new THREE.Mesh(bebeGeometry, bebeMaterial);
    bebePlaneScreen.position.set(0, 11, -40);
    bebePlaneScreen.receiveShadow = false;
    bebePlaneScreen.castShadow = false;
    scene.add(bebePlaneScreen);
    bebeVideo.muted = true;
    bebeVideo.play();

    const cylinderGeometry = new THREE.CylinderBufferGeometry(10, 10, 1, 64);
    const cylinderMaterial = new THREE.MeshBasicMaterial({
        color: midGrey
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, -3, -40);
    cylinder.receiveShadow = true;
    cylinder.castShadow = true;
    scene.add(cylinder);

    //

    video6 = document.getElementById("morph");
    videoTexture6 = new THREE.VideoTexture(video6);
    videoTexture6.encoding = THREE.sRGBEncoding;
    videoTexture6.minFilter = THREE.LinearFilter;
    videoTexture6.magFilter = THREE.LinearFilter;
    let videoGeometry6 = new THREE.PlaneBufferGeometry(10, 15);
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
    let videoGeometry7 = new THREE.BoxBufferGeometry(40, 50, 1);
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

function loadAudios() {
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    const sound = new THREE.PositionalAudio(audioListener);

    // const audioHelper = new THREE.PositionalAudioHelper(sound);
    // sound.add(audioHelper);

    const audioLoader = new THREE.AudioLoader(manager);
    audioLoader.load('../Leisure_Pursuit_Lounge/sound/CF.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setRefDistance(20);
        sound.setVolume(0.5);
        sound.setDirectionalCone(360, 360, 0.1);
        sound.position.y = 10;
    })

    document.body.addEventListener('keydown', onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        if (keyCode == 69) {
            sound.play();
        }
    }
    bebePlaneScreen.add(sound);
}

function loadImgs() {

    const imgGeometry_1 = new THREE.PlaneBufferGeometry(14, 20);
    const imgTexture_1 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/xw11PtEw.jpg');
    imgTexture_1.magFilter = THREE.NearestFilter;
    imgTexture_1.minFilter = THREE.NearestFilter;
    imgTexture_1.encoding = THREE.sRGBEncoding;
    const imgMaterial_1 = new THREE.MeshPhongMaterial({
        map: imgTexture_1,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_1,
        emissiveIntensity: 1
    });

    const imgPlane_1 = new THREE.Mesh(imgGeometry_1, imgMaterial_1);
    imgPlane_1.position.set(0, 15, -10)
    scene.add(imgPlane_1); 

    //

    const imgGeometry_2 = new THREE.PlaneBufferGeometry(7, 10);
    const imgTexture_2 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/bag1.png');
    imgTexture_2.magFilter = THREE.NearestFilter;
    imgTexture_2.minFilter = THREE.NearestFilter;
    imgTexture_2.encoding = THREE.sRGBEncoding;
    const imgMaterial_2 = new THREE.MeshPhongMaterial({
        map: imgTexture_2,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_2,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1
    });

    const imgPlane_2 = new THREE.Mesh(imgGeometry_2, imgMaterial_2);
    imgPlane_2.position.set(20, 15, -10)
    scene.add(imgPlane_2);
    
    //

    const imgGeometry_3 = new THREE.PlaneBufferGeometry(7, 15);
    const imgTexture_3 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/bag2.png');
    imgTexture_3.magFilter = THREE.NearestFilter;
    imgTexture_3.minFilter = THREE.NearestFilter;
    imgTexture_3.encoding = THREE.sRGBEncoding;
    const imgMaterial_3 = new THREE.MeshPhongMaterial({
        map: imgTexture_3,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_3,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1
    });

    const imgPlane_3 = new THREE.Mesh(imgGeometry_3, imgMaterial_3);
    imgPlane_3.position.set(30, 15, -10)
    scene.add(imgPlane_3); 

    //

    const imgGeometry_4 = new THREE.PlaneBufferGeometry(7, 10);
    const imgTexture_4 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/bag3.png');
    imgTexture_4.magFilter = THREE.NearestFilter;
    imgTexture_4.minFilter = THREE.NearestFilter;
    imgTexture_4.encoding = THREE.sRGBEncoding;
    const imgMaterial_4 = new THREE.MeshPhongMaterial({
        map: imgTexture_4,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_4,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1
    });

    const imgPlane_4 = new THREE.Mesh(imgGeometry_4, imgMaterial_4);
    imgPlane_4.position.set(40, 15, -10)
    scene.add(imgPlane_4);

    //

    const imgGeometry_5 = new THREE.PlaneBufferGeometry(14, 20);
    const imgTexture_5 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/book.png');
    imgTexture_5.magFilter = THREE.NearestFilter;
    imgTexture_5.minFilter = THREE.NearestFilter;
    imgTexture_5.encoding = THREE.sRGBEncoding;
    const imgMaterial_5 = new THREE.MeshPhongMaterial({
        map: imgTexture_5,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_5,
        emissiveIntensity: 1
    });

    const imgPlane_5 = new THREE.Mesh(imgGeometry_5, imgMaterial_5);
    imgPlane_5.position.set(-20, 15, -10)
    scene.add(imgPlane_5); 

    //

    const imgGeometry_6 = new THREE.PlaneBufferGeometry(14, 20);
    const imgTexture_6 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/DwlaJXhU.jpg');
    imgTexture_6.magFilter = THREE.NearestFilter;
    imgTexture_6.minFilter = THREE.NearestFilter;
    imgTexture_6.encoding = THREE.sRGBEncoding;
    const imgMaterial_6 = new THREE.MeshPhongMaterial({
        map: imgTexture_6,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_6,
        emissiveIntensity: 1
    });

    const imgPlane_6 = new THREE.Mesh(imgGeometry_6, imgMaterial_6);
    imgPlane_6.position.set(-40, 15, -10)
    scene.add(imgPlane_6); 

    //

    const imgGeometry_7 = new THREE.PlaneBufferGeometry(20, 20);
    const imgTexture_7 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/ppt1609.jpg');
    imgTexture_7.magFilter = THREE.NearestFilter;
    imgTexture_7.minFilter = THREE.NearestFilter;
    imgTexture_7.encoding = THREE.sRGBEncoding;
    const imgMaterial_7 = new THREE.MeshPhongMaterial({
        map: imgTexture_7,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_7,
        emissiveIntensity: 1
    });

    const imgPlane_7 = new THREE.Mesh(imgGeometry_7, imgMaterial_7);
    imgPlane_7.position.set(-60, 15, -10)
    scene.add(imgPlane_7); 

    //

    const imgGeometry_8 = new THREE.PlaneBufferGeometry(15, 30);
    const imgTexture_8 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/ai-ship.jpg');
    imgTexture_8.magFilter = THREE.NearestFilter;
    imgTexture_8.minFilter = THREE.NearestFilter;
    imgTexture_8.encoding = THREE.sRGBEncoding;
    const imgMaterial_8 = new THREE.MeshPhongMaterial({
        map: imgTexture_8,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_8,
        emissiveIntensity: 1
    });

    const imgPlane_8 = new THREE.Mesh(imgGeometry_8, imgMaterial_8);
    imgPlane_8.position.set(-80, 15, -10)
    scene.add(imgPlane_8); 

    //

    const imgGeometry_9 = new THREE.PlaneBufferGeometry(15, 30);
    const imgTexture_9 = new THREE.TextureLoader(manager).load('../Leisure_Pursuit_Lounge/img/tod.jpg');
    imgTexture_9.magFilter = THREE.NearestFilter;
    imgTexture_9.minFilter = THREE.NearestFilter;
    imgTexture_9.encoding = THREE.sRGBEncoding;
    const imgMaterial_9 = new THREE.MeshPhongMaterial({
        map: imgTexture_9,
        side: THREE.DoubleSide,
        emissive: white,
        emissiveMap: imgTexture_9,
        emissiveIntensity: 1
    });

    const imgPlane_9 = new THREE.Mesh(imgGeometry_9, imgMaterial_9);
    imgPlane_9.position.set(-100, 15, -10)
    scene.add(imgPlane_9); 

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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function update() {

    videoTexture.needsUpdate = true; //AI-SHIP
    videoTexture2.needsUpdate = true; //Tanqueray-18

    PPT1609_1_Texture.needsUpdate = true; //ppt1609_1
    PPT1609_2_Texture.needsUpdate = true; //ppt1609_2

    bebeTexture.needsUpdate = true; //bebe
    videoTexture6.needsUpdate = true; //morph
    videoTexture7.needsUpdate = true; //TOD_AD

    // let pos = camera.position;
    // videoPlaneScreen5.lookAt(pos); //bebe lookat camera

    //model rotations
    bagModel.rotation.y += 0.0095;
    cakeModel.rotation.y += 0.0095;
    fruitModel.rotation.y += 0.0095;
    
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

function onTransitionEnd(transition) {
    transition.target.remove();
}