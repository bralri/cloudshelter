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

let alexVideo, alexVideoTexture, alexSound;
let christophVideo, christophTexture, christophScreen, christophSound;

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
    const path = [
        [
            {
                line: new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0, 8, 0),
                        new THREE.Vector3(-18, 8, -365),
                        new THREE.Vector3(-41, 8, -985),
                        new THREE.Vector3(12, 8, -1173),
                        new THREE.Vector3(290, 8, -1359),
                        new THREE.Vector3(393, 8, 187),
                        new THREE.Vector3(100, 8, 218)
                    ], true, "centripetal"),
            },
            {
                line: new THREE.CatmullRomCurve3([
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
                    ], true, "centripetal")
            }
        ]
    ]

    for (let i = 0; i < path[0][i].length; i++) {
        const paths = path[0][i];
        let vertices = paths.getSpacedPoints(100);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            visible: true,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }
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
    const videos = [
        [
            {
                ID: "Picnic",
                soundURL: "../sound/voidshow/Alex/Picnic.mp3",
                geometry: new THREE.PlaneBufferGeometry(10, 20),
                rx: 0,
                ry: Math.PI / 2,
                rz: 0,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1,
                refDistance: 2,
                volume: 0.5,
                coneInnerAngle: 360,
                coneOuterAngle: 360,
                coneOuterGain: 0
            },
            {
                ID: "Elf",
                soundURL: "../sound/voidshow/Alex/Elf.mp3",
                geometry: new THREE.PlaneBufferGeometry(10, 20),
                rx: 0,
                ry: Math.PI / 2,
                rz: 0,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1,
                refDistance: 2,
                volume: 0.1,
                coneInnerAngle: 360,
                coneOuterAngle: 360,
                coneOuterGain: 0
            }
        ]
    ]

    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    for (let i = 0; i < videos[0].length; i++) {
        const object = videos[0][i];
        let videoID = document.getElementById(object.ID);
        alexVideoTexture = new THREE.VideoTexture(videoID);
        alexVideoTexture.encoding = THREE.sRGBEncoding;
        alexVideoTexture.minFilter = THREE.LinearFilter;
        alexVideoTexture.magFilter = THREE.LinearFilter;
        let videoGeometry = object.geometry;
        rotateObject(videoGeometry, object.rx, object.ry, object.rz);
        let videoMaterial = new THREE.MeshBasicMaterial({
            map: alexVideoTexture,
            side: object.side,
            transparent: object.transparent,
            opacity: object.opacity,
        });
        alexVideo = new THREE.Mesh(videoGeometry, videoMaterial);
        alexVideo.receiveShadow = false;
        alexVideo.castShadow = false;
        scene.add(alexVideo);
        // alexVideo.play();
        alexSound = new THREE.PositionalAudio(audioListener);
        const audioLoader = new THREE.AudioLoader(manager);
        audioLoader.load(object.soundURL, function(buffer) {
            alexSound.setBuffer(buffer);
            alexSound.setLoop(true);
            alexSound.setRefDistance(object.refDistance);
            alexSound.setVolume(object.volume);
            alexSound.setDirectionalCone(
                object.coneInnerAngle, 
                object.coneOuterAngle, 
                object.coneOuterGain
            );
        })
        alexVideo.add(alexSound);
    }

    // const picnic = {
    //     ID: "Picnic",
    //     Sound: "../sound/voidshow/Alex/Picnic.mp3",
    // };

    // //Picnic.mov
    // picnicVideo = document.getElementById(picnic.ID);
    // picnicTexture = new THREE.VideoTexture(picnicVideo);
    // picnicTexture.encoding = THREE.sRGBEncoding;
    // picnicTexture.minFilter = THREE.LinearFilter;
    // picnicTexture.magFilter = THREE.LinearFilter;
    // picnicTexture.format = THREE.RGBAFormat;
    // let picnicGeometry = new THREE.PlaneBufferGeometry(10, 20);
    // picnicGeometry.rotateY(Math.PI / 2);
    // const picnicMaterials = new THREE.MeshBasicMaterial({
    //     map: picnicTexture,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 1
    // });
    // picnicPlaneScreen = new THREE.Mesh(picnicGeometry, picnicMaterials);
    // picnicPlaneScreen.receiveShadow = false;
    // picnicPlaneScreen.castShadow = false;
    // scene.add(picnicPlaneScreen);
    // //Picnic.mp3
    // picnicSound = new THREE.PositionalAudio(audioListener);
    // const picnicAudioLoader = new THREE.AudioLoader(manager);
    // picnicAudioLoader.load(picnic.Sound, function(buffer) {
    //     picnicSound.setBuffer(buffer);
    //     picnicSound.setLoop(true);
    //     picnicSound.setRefDistance(2);
    //     picnicSound.setVolume(0.5);
    //     picnicSound.setDirectionalCone(360, 360, 0);
    // })
    // picnicPlaneScreen.add(picnicSound);

    // //Elf.mov
    // elfVideo = document.getElementById("Elf");
    // elfTexture = new THREE.VideoTexture(elfVideo);
    // elfTexture.encoding = THREE.sRGBEncoding;
    // elfTexture.minFilter = THREE.LinearFilter;
    // elfTexture.magFilter = THREE.LinearFilter;
    // elfTexture.format = THREE.RGBAFormat;
    // let elfGeometry = new THREE.PlaneBufferGeometry(10, 20);
    // elfGeometry.rotateY(Math.PI / 2);
    // const elfMaterials = new THREE.MeshBasicMaterial({
    //     map: elfTexture,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 1
    // });
    // elfPlaneScreen = new THREE.Mesh(elfGeometry, elfMaterials);
    // elfPlaneScreen.receiveShadow = false;
    // elfPlaneScreen.castShadow = false;
    // scene.add(elfPlaneScreen);
    // //Elf.mp3
    // elfSound = new THREE.PositionalAudio(audioListener);
    // const elfAudioLoader = new THREE.AudioLoader(manager);
    // elfAudioLoader.load('../sound/voidshow/Alex/Elf.mp3', function(buffer) {
    //     elfSound.setBuffer(buffer);
    //     elfSound.setLoop(true);
    //     elfSound.setRefDistance(2);
    //     elfSound.setVolume(0.1);
    //     elfSound.setDirectionalCone(360, 360, 0)
    // })
    // elfPlaneScreen.add(elfSound);

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
    const imgs = [
        [
            {
                color: 0xffffff,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 961,
                py: 10,
                pz: -2021,
                rotation: -30
            },
            {
                color: 0x000000,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 980,
                py: 10,
                pz: -2055,
                rotation: -30
            },
            {
                color: 0x0000ff,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 999,
                py: 10,
                pz: -2088,
                rotation: -30
            },
            {
                color: 0x00ff00,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 1008,
                py: 10,
                pz: -1935,
                rotation: -30
            },
            {
                color: 0xff0000,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 1031,
                py: 10,
                pz: -1976,
                rotation: -30
            },
            {
                color: 0xffff00,
                geometry: new THREE.BoxBufferGeometry(2, 20, 20),
                px: 1049,
                py: 10,
                pz: -2009,
                rotation: -30
            },
        ]
    ];

    for (let i = 0; i < imgs[0].length; i++) {
        const object = imgs[0][i];
        const geometry = object.geometry;
        const material = new THREE.MeshPhongMaterial({
            color: object.color
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(object.px, object.py, object.pz);
        rotateObject(cube, 0, object.rotation, 0);
        
        scene.add(cube);
    };
}

function videoPlaneMove() {
    // //picnicPlaneScreen
    // const picnicPosition = path_2.getPoint(fraction);
    // const picnicTangent = path_2.getTangent(fraction);
    // picnicPlaneScreen.position.copy(picnicPosition);
    // axis.crossVectors(up, picnicTangent).normalize();
    // const picnicRadians = Math.acos(up.dot(picnicTangent));
    // picnicPlaneScreen.quaternion.setFromAxisAngle(axis, picnicRadians);

    // //elfPlaneScreen
    // const elfPosition = path_1.getPoint(fraction);
    // const elfTangent = path_1.getTangent(fraction);
    // elfPlaneScreen.position.copy(elfPosition);
    // axis.crossVectors(up, elfTangent).normalize();
    // const elfRadians = Math.acos(up.dot(elfTangent));
    // elfPlaneScreen.quaternion.setFromAxisAngle(axis, elfRadians);
    // for (let i = 0; i < path[0].length; i++) {
    //     const position = path[i].getPoint(fraction);
    //     const tangent = path[i].getTangent(fraction);
    //     alexVideo.position.copy(position);
    //     axis.crossVectors(up, tangent).normalize();
    //     const radians = Math.acos(up.dot(tangent));
    //     alexVideo.quaternion.setFromAxisAngle(axis, radians);
    // }

    // fraction += 0.00001;
    // if (fraction > 1) {
    //     fraction = 0;
    // }
}

function play_Sounds_Videos() {
    //Picnic
    // picnicVideo.play();
    // picnicSound.play();

    // //Elf
    // elfVideo.play();
    // elfSound.play();

    // alexVideo.play();
    alexSound.play();

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

    alexVideoTexture.needsUpdate = true;
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
}

function onTransitionEnd(transition) {
    transition.target.remove();
}