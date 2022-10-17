import * as THREE from 'three';
import {GLTFLoader} from '../js/jsm/GLTFLoader.js';
import {PointerLockControls} from '../js/jsm/PointerLockControls.js';
import {models, points, videos, imgs, promiseLoader} from './config.js'

let camera, scene, renderer, controls;

const gltfLoader = promiseLoader(new GLTFLoader());
const textureLoader = promiseLoader(new THREE.TextureLoader());

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let videoScreen, videoTexture;

const up = new THREE.Vector3(0, 0, 1);
const axis = new THREE.Vector3();
let fraction = 0;

let objID = [];
let objInfo = [];

let videoScreens = [];
let playVideos = [];
let playSounds = [];
let playing = false;

window.onload = async function() {
    await init()
    animate();
}

// init();
// animate();

async function init() {
    // SCENE SETUP
    scene = new THREE.Scene();
    scene.background = 0x000000;
    scene.fog = new THREE.Fog(scene.background, 0, 2000);

    camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        2000 
    );

    const ambLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambLight);

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
    controls = new PointerLockControls(camera, document.body);

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
        [0, 0],
        [-61, -981],
        [932, -1893],
        [-354, -1793]
    ]

    let camera_location_picker = Math.floor(Math.random() * camera_location_array.length);
    controls.getObject().position.x = camera_location_array[camera_location_picker][0];
    controls.getObject().position.z = camera_location_array[camera_location_picker][1];
    controls.getObject().position.y = 10;
    scene.add(controls.getObject());

    // LOADING MANAGER
    const manager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });

    // DRAW PATH FROM POINTS
    for (let i = 0; i < points.length; i++) {
        let path = points[i].line;
        let vertices = path.getSpacedPoints(60);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            visible: false
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    };

    // LOAD MODELS
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(  
    
            obj.URL,
    
            function(glb) {
                let object = glb.scene;
                object.position.set(obj.px, obj.py, obj.pz);
                object.scale.set(obj.scale, obj.scale, obj.scale);
                rotateObject(object, obj.rx, obj.ry, obj.rz);

                for(var i in object.children){
                    objID.push(object.children[i].id)
                    objInfo.push(
                      [
                        object.children[i].id,
                        `
                          <span class="artist">${obj.artist}</span><br>
                          ${obj.title}, ${obj.date}<br>
                          <span class="info">${obj.info}</span>
                          `
                      ]
                    )
                }
                scene.add(object);
            }
    )};

    // LOAD VIDEOS
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    for (let i = 0; i < videos.length; i++) {
        const obj = videos[i];
        let video = document.getElementById(obj.ID);
        videoTexture = await new THREE.VideoTexture(video);
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

        objID.push(videoScreen.id);
        objInfo.push(
            [
                videoScreen.id,
                `
                <span class="artist">${obj.artist}</span><br>
                ${obj.title}, ${obj.date}<br>
                <span class="info">${obj.info}</span>
                `
            ]
        );

        playSounds.push(sound);
        videoScreen.add(sound);
        scene.add(videoScreen);
        playVideos.push(video);
        if (obj.artist === "Alex Pearl") {
            videoScreens.push(videoScreen);
        }
    };

    // LOAD STILLS
    for (let i = 0; i < imgs.length; i++) {
        const obj = imgs[i];
        const geometry = new THREE.BoxBufferGeometry(2, 20, 20);
        let texture = await new THREE.TextureLoader(manager).load(obj.img);
        const material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(obj.px, obj.py, obj.pz);
        rotateObject(cube, 0, -30, 0);

        objID.push(cube.id);
        objInfo.push(
            [
                cube.id,
                `
                <span class="artist">${obj.artist}</span><br>
                ${obj.title}, ${obj.date}<br>
                <span class="info">${obj.info}</span>
                `
            ]
        );

        scene.add(cube);
    };
}

function rotateObject(object, degreeX, degreeY, degreeZ) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
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

    for (let i = 0; i < videoScreens.length; i++) {
        const path = points[i].line;
        const position = path.getPoint(fraction);
        const tangent = path.getTangent(fraction);
        const alexVideo = videoScreens[i]
        alexVideo.position.copy(position);
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        alexVideo.quaternion.setFromAxisAngle(axis, radians);
    }

    fraction += 0.00001;
    if (fraction > 1) {
        fraction = 0;
    }

    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();

    const time = performance.now();

    if (controls.isLocked === true) {
        // // ARTWORK INFO DISPLAY
        let objIntersections = (new THREE.Raycaster(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3()),
            0,
            100
        )).intersectObjects(
            scene.children,
            true
        );

        if (objIntersections[0] && objID.indexOf(objIntersections[0].object.id) !== -1) {
            for (let i = 0; i < objInfo.length; i++) {
                if (objIntersections[0].object.id === objInfo[i][0]) {
                    document.querySelector('#artwork-caption p').innerHTML = objInfo[i][1];
                }
            }
            document.getElementById('artwork-caption').style.display = 'block';
        } else {
            document.getElementById('artwork-caption').style.display = 'none';
        }

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

    document.querySelector('.co-x').innerHTML = "x: " + Math.round(controls.getObject().position.x);
    document.querySelector('.co-z').innerHTML = "y: " + Math.round(controls.getObject().position.z);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}