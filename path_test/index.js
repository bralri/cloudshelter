let camera, scene, renderer, controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let video, videoScreen, videoTexture, sound;

const up = new THREE.Vector3(1, 0, 0);
const axis = new THREE.Vector3();
let fraction = 0;

let degreeX = 0; 
let degreeY = 0; 
let degreeZ = 0;

let manager;

let pointsArray = [];
let objIntersects = [];
let videos_ = [];
let videoplay_ = [];
let soundplay_ = [];
let playing = false;

init();
animate();

function init() {
    sceneSetup();
    controlsSetup();
    loadingManager();
    drawPath();
    loadModels();
    load_Videos();
    load_Stills();
}

function sceneSetup() {
    scene = new THREE.Scene();
    scene.background = 0x000000;
    scene.fog = new THREE.Fog(0x000000, 0, 2000);

    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000 
    );

    camera.position.y = 10;

    const ambLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambLight);

    const light = new THREE.HemisphereLight(0x63666A, 0x000000, 0.5);
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
    pointsArray = [
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
                ], true, "centripetal")
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
    
    for (let i = 0; i < pointsArray[0].length; i++) {
        let points = pointsArray[0][i].line;
        let vertices = points.getSpacedPoints(100);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            visible: false,
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

function load_Videos() {
    const videos = [
        [
            {
                ID: "Elf",
                artist: "Alex",
                title: "Corpse",
                date: "2022",
                info: "",
                MP3: "../sound/voidshow/Alex/Elf.mp3",
                geometry: new THREE.PlaneBufferGeometry(10, 20),
                transparency: true,
                innercone: 360,
                outercone: 360,
                rotation: Math.PI/2
            },
            {
                ID: "Picnic",
                artist: "Alex",
                title: "Corpse",
                date: "2022",
                info: "",
                MP3: "../sound/voidshow/Alex/Picnic.mp3",
                geometry: new THREE.PlaneBufferGeometry(10, 20),
                transparency: true,
                innercone: 360,
                outercone: 360,
                rotation: Math.PI/2
            },
            {
                ID: "Christoph",
                artist: "Christoph",
                title: "The Void, Suicide and The Sorrowing of Man",
                date: "2022",
                info: "11 minute loop",
                MP3: "../sound/voidshow/Christoph/christoph.mp3",
                geometry: new THREE.BoxBufferGeometry(70, 45, 2),
                transparency: false,
                innercone: 180,
                outercone: 230,
                rotation: -62,
                px: 1093,
                py: 30,
                pz: -2110
            }
        ]
    ]

    for (let i = 0; i < videos[0].length; i++) {
        const object = videos[0][i];
        let video = document.getElementById(object.ID);
        videoTexture = new THREE.VideoTexture(video);
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        let videoGeometry = object.geometry;
        let videoMaterial = new THREE.MeshLambertMaterial({
                map: videoTexture,
                side: THREE.DoubleSide,
                transparent: object.transparency,
                opacity: 1
            });
        videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);
        if (object.artist == "Christoph") {
            videoScreen.position.set(object.px, object.py, object.pz);
            rotateObject(videoScreen, 0, object.rotation, 0);
        } else if (object.artist == "Alex") {
            rotateObject(videoScreen, 0, object.rotation, 0);
        }
        videoScreen.receiveShadow = false;
        videoScreen.castShadow = false;
        scene.add(videoScreen);

        const audioListener = new THREE.AudioListener();
        camera.add(audioListener);
        sound = new THREE.PositionalAudio(audioListener);
        const audioLoader = new THREE.AudioLoader(manager);
        audioLoader.load(object.MP3, function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setRefDistance(4);
            sound.setVolume(1);
            sound.setDirectionalCone(object.innercone, object.outercone, 0.1);
        })

        videoplay_.push(video);
        soundplay_.push(sound);

        videoScreen.add(sound);
        videos_.push(videoScreen);
    }
}

function load_Stills() {
    const imgs = [
        [
            {
                img: "../img/voidshow/about/Alex.png",
                px: 961,
                py: 10,
                pz: -2021
            },
            {
                img: "../img/voidshow/about/Brian.png",
                px: 980,
                py: 10,
                pz: -2055
            },
            {
                img: "../img/voidshow/about/Bryan.png",
                px: 999,
                py: 10,
                pz: -2088
            },
            {
                img: "../img/voidshow/about/Christoph.png",
                px: 1008,
                py: 10,
                pz: -1935
            },
            {
                img: "../img/voidshow/about/Gwen.png",
                px: 1031,
                py: 10,
                pz: -1976
            },
            {
                img: "../img/voidshow/about/Molly.png",
                px: 1049,
                py: 10,
                pz: -2009
            }
        ]
    ];

    for (let i = 0; i < imgs[0].length; i++) {
        const object = imgs[0][i];
        const geometry = new THREE.BoxBufferGeometry(2, 20, 20);
        let texture = new THREE.TextureLoader(manager).load(
            object.img
        );
        const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(object.px, object.py, object.pz);
        rotateObject(cube, 0, -30, 0);
        
        scene.add(cube);
    };
}

function videoPlaneMove() {
    for (let i = 0; i < 2; i++) {
        const path = pointsArray[0][i].line;
        const position = path.getPoint(fraction);
        const tangent = path.getTangent(fraction);
        const corpseVideo = videos_[i];
        corpseVideo.position.copy(position);
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        corpseVideo.quaternion.setFromAxisAngle(axis, radians);
    }

    fraction += 0.00001;
    if (fraction > 1) {
        fraction = 0;
    }
}

function play_Sounds_Videos() {
    if (!playing) {
        for (let i = 0; i < soundplay_.length; i++) {
            soundplay_[i].play();
        }
        for (let i = 0; i < videoplay_.length; i++) {
            videoplay_[i].play();
        }
    }
    playing = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);

    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }
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