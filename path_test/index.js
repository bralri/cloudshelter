let camera, scene, renderer, controls;
let camera_location_picker;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let picnicVideo, picnicTexture, picnicPlaneScreen, picnicSound;
let elfVideo, elfTexture, elfPlaneScreen, elfSound;
let christophVideo, christophTexture, christophScreen, christophSound;

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
const midGrey = new THREE.Color(0x63666A);
midGrey.convertSRGBToLinear();
const black = new THREE.Color(0x000000);
black.convertSRGBToLinear();

//

init();
animate();

//

function init() {
    sceneSetup();
    controlsSetup();

    loadingManager();

    drawPath();
    loadModels();
    load_Sounds_Videos();
    load_Stills();
}

function sceneSetup() {
    scene = new THREE.Scene();
    scene.background = black;
    scene.fog = new THREE.Fog(black, 0, 1800);

    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000 
    );

    camera.position.y = 10;

    const ambLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambLight);

    const light = new THREE.HemisphereLight(midGrey, black, 0.5);
    light.position.set(0, 10, 0);
    scene.add(light);

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

function controlsSetup() {
    controls = new THREE.PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const title = document.getElementById( 'title');

    title.addEventListener('click', function () {
        controls.lock();
        play_Sounds_Videos();
    } );

    controls.addEventListener( 'lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    } );

    const camera_location_array = [
        [0, 0],
        [-25, -370],
        [-36, -717],
        [-61, -981],
        [932, -1893],
        [-354, -1793],
        [-534, -2011],
        [-68, -2203]
    ]

    camera_location_picker = Math.floor(Math.random() * camera_location_array.length);

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
    const models = [
        [
            {
                name: "entrance lane",
                URL: '../models/voidshow/mainlane.glb',
                px: -32,
                py: -2,
                pz: -740,
                scale: 0.5,
                rx: 0,
                ry: 0,
                rz: 0
            },
            {
                name: "underpass blue",               
                URL: '../models/voidshow/underpassblue.glb',
                px: 1000,
                py: -2.5,
                pz: -2000,
                scale: 1,
                rx: 0,
                ry: 45,
                rz: 2
            },
            {
                name: "underpass grey",              
                URL: '../models/voidshow/underpassgrey.glb',
                px: -500,
                py: -2.5,
                pz: -2000,
                scale: 1.5,
                rx: 0,
                ry: 45,
                rz: 0
            },
            {
                name: "tree",             
                URL: '../models/voidshow/tree.glb',
                px: 0,
                py: -2,
                pz: -2500,
                scale: 0.5,
                rx: 0,
                ry: 0,
                rz: 0
            },
            {
                name: "path",             
                URL: '../models/voidshow/path.glb',
                px: -200,
                py: -2,
                pz: -2500,
                scale: 0.5,
                rx: 0,
                ry: 0,
                rz: 0
            },
            {
                name: "bin 1",             
                URL: '../models/voidshow/bin.glb',
                px: 100,
                py: -2,
                pz: -2500,
                scale: 0.2,
                rx: 0,
                ry: 0,
                rz: 0
            },
            {
                name: "forest structure",            
                URL: '../models/voidshow/foreststructure.glb',
                px: 0,
                py: -14,
                pz: -2300,
                scale: 0.2,
                rx: 0,
                ry: 0,
                rz: 0
            },
        ]
    ]
    
    const loader = new THREE.GLTFLoader(manager);
    for (let i = 0; i < models[0].length; i++) {
        const object = models[0][i];
        loader.load(
    
            object.URL,
    
            function(glb) {
                glb.scene.traverse(function(node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                })
    
                let model = glb.scene;
                model.position.set(object.px, object.py, object.pz);
                model.scale.set(object.scale, object.scale, object.scale);
                rotateObject(model, object.rx, object.ry, object.rz);
    
                scene.add(model);
            }
        )
    }
}

function load_Sounds_Videos() {
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    const picnic = {
        ID: "Picnic",
        Sound: "../sound/voidshow/Alex/Picnic.mp3",
    };

    //Picnic.mov
    picnicVideo = document.getElementById(picnic.ID);
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
        transparent: true,
        opacity: 1
    });
    picnicPlaneScreen = new THREE.Mesh(picnicGeometry, picnicMaterials);
    picnicPlaneScreen.receiveShadow = false;
    picnicPlaneScreen.castShadow = false;
    scene.add(picnicPlaneScreen);
    //Picnic.mp3
    picnicSound = new THREE.PositionalAudio(audioListener);
    const picnicAudioLoader = new THREE.AudioLoader(manager);
    picnicAudioLoader.load(picnic.Sound, function(buffer) {
        picnicSound.setBuffer(buffer);
        picnicSound.setLoop(true);
        picnicSound.setRefDistance(2);
        picnicSound.setVolume(0.5);
        picnicSound.setDirectionalCone(360, 360, 0);
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
        transparent: true,
        opacity: 1
    });
    elfPlaneScreen = new THREE.Mesh(elfGeometry, elfMaterials);
    elfPlaneScreen.receiveShadow = false;
    elfPlaneScreen.castShadow = false;
    scene.add(elfPlaneScreen);
    //Elf.mp3
    elfSound = new THREE.PositionalAudio(audioListener);
    const elfAudioLoader = new THREE.AudioLoader(manager);
    elfAudioLoader.load('../sound/voidshow/Alex/Elf.mp3', function(buffer) {
        elfSound.setBuffer(buffer);
        elfSound.setLoop(true);
        elfSound.setRefDistance(2);
        elfSound.setVolume(0.1);
        elfSound.setDirectionalCone(360, 360, 0)
    })
    elfPlaneScreen.add(elfSound);

    //Christoph.mp4
    christophVideo = document.getElementById("Christoph");
    christophTexture = new THREE.VideoTexture(christophVideo);
    christophTexture.encoding = THREE.sRGBEncoding;
    christophTexture.minFilter = THREE.LinearFilter;
    christophTexture.magFilter = THREE.LinearFilter;
    let christophGeometry = new THREE.BoxGeometry(70, 45, 1);
    let christopMaterials = [
        new THREE.MeshBasicMaterial({
            color: black
        }),
        new THREE.MeshBasicMaterial({
            color: black
        }),
        new THREE.MeshBasicMaterial({
            color: black
        }),
        new THREE.MeshBasicMaterial({
            color: black
        }),
        new THREE.MeshBasicMaterial({
            map: christophTexture,
            side: THREE.DoubleSide,
            transparent: false,
            opacity: 1
        }),
        new THREE.MeshBasicMaterial({
            color: black,
            side: THREE.BackSide
        })
    ];
    christophScreen = new THREE.Mesh(christophGeometry, christopMaterials);
    christophScreen.position.set(1093, 30, -2110);
    rotateObject(christophScreen, 0, -62, 0);
    scene.add(christophScreen);
    //christoph.mp3
    christophSound = new THREE.PositionalAudio(audioListener);
    const christophAudioLoader = new THREE.AudioLoader(manager);
    christophAudioLoader.load('../sound/voidshow/Christoph/christoph.mp3', function(buffer) {
        christophSound.setBuffer(buffer);
        christophSound.setLoop(true);
        christophSound.setRefDistance(2);
        christophSound.setVolume(0.5);
        christophSound.setDirectionalCone(180, 230, 0.1)
    })
    christophScreen.add(christophSound);
}

function load_Stills() {
    //Brian
    const brianGeometry = new THREE.BoxGeometry(2, 20, 20);
    const brianMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    const brianCube_1 = new THREE.Mesh(brianGeometry, brianMaterial);

    const brianCube_2 = new THREE.Mesh(
        brianCube_1.geometry.clone(),
        new THREE.MeshPhongMaterial({
            color: 0x000000
        })
    )
    const brianCube_3 = new THREE.Mesh(
        brianCube_1.geometry.clone(),
        new THREE.MeshPhongMaterial({
            color: 0x0000ff
        })
    )
    const brianCube_4 = new THREE.Mesh(
        brianCube_1.geometry.clone(),
        new THREE.MeshPhongMaterial({
            color: 0x00ff00
        })
    )
    const brianCube_5 = new THREE.Mesh(
        brianCube_1.geometry.clone(),
        new THREE.MeshPhongMaterial({
            color: 0xff0000
        })
    )
    const brianCube_6 = new THREE.Mesh(
        brianCube_1.geometry.clone(),
        new THREE.MeshPhongMaterial({
            color: 0xffff00
        })
    )

    //Left Set: Position
    brianCube_1.position.set(961, 10, -2021);
    brianCube_2.position.set(980, 10, -2055);
    brianCube_3.position.set(999, 10, -2088);
    //Right Set: Poisiton
    brianCube_4.position.set(1008, 10, -1935);
    brianCube_5.position.set(1031, 10, -1976);
    brianCube_6.position.set(1049, 10, -2009);
    //Left Set: Rotation
    rotateObject(brianCube_1, 0, -30, 0);
    rotateObject(brianCube_2, 0, -30, 0);
    rotateObject(brianCube_3, 0, -30, 0);
    //Right Set: Rotation
    rotateObject(brianCube_4, 0, -30, 0);
    rotateObject(brianCube_5, 0, -30, 0);
    rotateObject(brianCube_6, 0, -30, 0);


    scene.add(brianCube_1, brianCube_2, brianCube_3, brianCube_4, brianCube_5, brianCube_6);
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

    fraction += 0.00001;
    if (fraction > 1) {
        fraction = 0;
    }
}

function play_Sounds_Videos() {
    //Picnic
    picnicVideo.play();
    picnicSound.play();

    //Elf
    elfVideo.play();
    elfSound.play();

    //Christoph
    christophVideo.play();
    christophSound.play();
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
    christophTexture.needsUpdate = true;
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

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);
    }
    prevTime = time;

    // console.log(camera.position);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}