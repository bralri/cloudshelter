let camera, scene, renderer, controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let videoScreen, videoTexture;

const up = new THREE.Vector3(1, 0, 0);
const axis = new THREE.Vector3();
let fraction = 0;

let degreeX = 0; 
let degreeY = 0; 
let degreeZ = 0;

let objIntersects = [];
let videoScreens = [];
let playVideos = [];
let playSounds = [];
let playing = false;

init();
animate();

function init() {
    // SCENE SETUP
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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // CONTROLS
    controls = new THREE.PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const title = document.getElementById( 'title');

    title.addEventListener('click', function () {
        controls.lock();
        playSoundsVideos();
    } );

    controls.addEventListener( 'lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    } );

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

    const camera_location_array = [
        // [0, 0],
        // [-25, -370],
        // [-36, -717],
        // [-61, -981],
        [932, -1893],
        // [-354, -1793],
        // [-534, -2011],
        // [-68, -2203]
    ]

    let camera_location_picker = Math.floor(Math.random() * camera_location_array.length);

    controls.getObject().position.x = camera_location_array[camera_location_picker][0];
    controls.getObject().position.z = camera_location_array[camera_location_picker][1];

    scene.add(controls.getObject());

    // LOADING MANAGER
    const manager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });

    // DRAW PATHS
    for (let i = 0; i < pointsArray.length; i++) {
        let points = pointsArray[i].line;
        let vertices = points.getSpacedPoints(100);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            visible: false,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    };

    // LOAD MODELS
    const loader = new THREE.GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const object = models[i];
        loader.load(
    
            object.URL,
    
            function(glb) {
                glb.scene.traverse(async function(node) {
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
    };

    // LOAD VIDEOS
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    for (let i = 0; i < videos.length; i++) {
        const obj = videos[i];
        let video = document.getElementById(obj.ID);
        videoTexture = new THREE.VideoTexture(video);
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        let videoGeometry = obj.geometry;
        let videoMaterial = new THREE.MeshLambertMaterial({
            map: videoTexture,
            side: THREE.DoubleSide,
            transparent: obj.transparency,
            opacity: 1
        });
        videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);
        videoScreen.position.set(obj.px, obj.py, obj.pz);
        rotateObject(videoScreen, 0, obj.rotation, 0);

        const sound = new THREE.PositionalAudio(audioListener);
        audioLoader.load(obj.MP3, function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setRefDistance(obj.refDistance);
            sound.setVolume(obj.volume);
            sound.setDirectionalCone(obj.innercone, obj.outercone, 0);
        });
        playSounds.push(sound);
        videoScreen.add(sound);
        scene.add(videoScreen);

        playVideos.push(video);
        videoScreens.push(videoScreen);

        objIntersects.push(videoScreen);
    };

    // LOAD STILLS
    for (let i = 0; i < imgs.length; i++) {
        const obj = imgs[i];
        const geometry = new THREE.BoxBufferGeometry(2, 20, 20);
        let texture = new THREE.TextureLoader(manager).load(obj.img);
        const material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(obj.px, obj.py, obj.pz);
        rotateObject(cube, 0, -30, 0);
        scene.add(cube);

        objIntersects.push(cube);
    };
}

function rotateObject(object, degreeX, degreeY, degreeZ) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function videoPlaneMove() {
    for (let i = 0; i < 2; i++) {
        const path = pointsArray[i].line;
        const position = path.getPoint(fraction);
        const tangent = path.getTangent(fraction);
        const alexVideo = videoScreens[i];
        alexVideo.position.copy(position);
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        alexVideo.quaternion.setFromAxisAngle(axis, radians);
    }

    fraction += 0.00001;
    if (fraction > 1) {
        fraction = 0;
    }
}

function playSoundsVideos() {
    if (!playing) {
        for (let i = 0; i < playVideos.length; i++) {
            playVideos[i].play();
        }
        for (let i = 0; i < playSounds.length; i++) {
            playSounds[i].play();
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
    requestAnimationFrame(animate);
    render();
    videoPlaneMove();

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

    document.querySelector('.coordinates p').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}