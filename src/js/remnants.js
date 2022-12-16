import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';
import {Water} from 'three/Water2.js';
import {
    models, 
    points, 
    videos,
    pointLights
} from './config.js';

let camera, scene, renderer, controls, water, object;
let videoScreen, videoTexture;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const userHeight = 10;

const up = new THREE.Vector3(0, 0, 1);
const axis = new THREE.Vector3();
let fraction = 0;

let objID = [];
let objInfo = [];
let screensToPath = [];
let modelRotation = [];

let leifangSounds = [];
let leifangID = [];
let leifang_X, leifang_Y, leifang_Z;

let playVideos = [];
let playSounds = [];
let playing = false;

const darkGrey = new THREE.Color(0x1A1A1A);
darkGrey.convertSRGBToLinear();
const medGrey = new THREE.Color(0x404040);
medGrey.convertSRGBToLinear();
const white = new THREE.Color(0xffffff);
white.convertSRGBToLinear();
const waterColour = new THREE.Color(0x001e0f);

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = darkGrey;
    scene.fog = new THREE.FogExp2(scene.background, 0.002);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1, 10000);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // Controls
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const title = document.getElementById('title');

    title.addEventListener('click', function () {
        controls.lock();
        playSoundsVideos();
    });

    controls.addEventListener('lock', function () {
        title.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        title.style.display = '';
    });

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

    controls.getObject().position.x = 0;
    controls.getObject().position.z = 1850;
    controls.getObject().position.y = userHeight;

    // Lights
    const ambLight = new THREE.AmbientLight(medGrey);
    scene.add(ambLight);

    const hemLight = new THREE.HemisphereLight(white, darkGrey);
    scene.add(hemLight);

    const flashlight = new THREE.SpotLight(white, 4, 100);
    camera.add(flashlight);
    flashlight.position.set(0,0,1);
    flashlight.target = camera;

    for (let i = 0; i < pointLights.length; i++) {
        const obj = pointLights[i];
        const pointLight = new THREE.PointLight(obj.color, 2, 150);
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 8);
        const sphere = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshBasicMaterial({color: obj.color})
        );
        pointLight.add(sphere);
        sphere.visible = false;
        pointLight.position.set(obj.x, obj.y, obj.z);
        // scene.add(pointLight);
    }

    // Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    water = new Water(waterGeometry, {
        color: waterColour,
        scale: 10,
        flowDirection: new THREE.Vector2(1, 1),
        textureWidth: 1024,
        textureHeight: 1024
    });
    water.position.y = -10;
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Loading Manager
    const manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
    }

    // Audio Loader
    const audioLoader = new THREE.AudioLoader(manager);
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Load Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(obj.URL, function (glb) {
            object = glb.scene;
            object.position.set(obj.x, obj.y, obj.z);
            scene.add(object);
            
            if (obj.ID !== "Environment") {
                for (var i in object.children) {
                    objID.push(object.children[i].id);
                    objInfo.push([
                        object.children[i].id,
                        `
                            <span class="artist">${obj.artist}</span><br>
                            <i>${obj.title}</i>, 2022<br>
                            <span class="info">${obj.info}</span>
                        `
                    ])
                }
            }

            if (obj.ID === "SpeculativeGeologies") {
                modelRotation.push(object);
            }

            if (obj.ID === "Lęïfańg") {
                for (var i in object.children) {
                    leifangID.push(object.children[i].id);
                }
                for (i = 0; i < 5; i++) {
                    const sound = new THREE.PositionalAudio(audioListener);
                    audioLoader.load(`../assets/sounds/leifang/${i + 1}.mp3`, function (buffer) {
                        sound.setBuffer(buffer);
                        sound.setLoop(false);
                        sound.setRefDistance(3);
                        sound.setVolume(1);
                        sound.setDirectionalCone(360, 360, 0);
                    });

                    leifangSounds.push(sound);
                    object.add(sound);
                }
            }
        })
    }

    // Draw Paths
    for (let i = 0; i < points.length; i++) {
        let path = points[i].line;
        let vertices = path.getSpacedPoints(40);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xECFF00, visible: true});
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    };

    // Load Videos
    for (let i = 0; i < videos.length; i++) {
        const obj = videos[i];
        const video = document.getElementById(obj.ID);
        videoTexture = new THREE.VideoTexture(video);
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        const videoMaterial = new THREE.MeshStandardMaterial({
            map: videoTexture,
            side: THREE.DoubleSide,
            emissive: white,
            emissiveIntensity: 1,
            emissiveMap: videoTexture,
            transparent: obj.transparency,
            opacity: 1
        });
        videoScreen = new THREE.Mesh(obj.geometry, videoMaterial);
        videoScreen.position.set(obj.x, obj.y, obj.z);

        if (obj.ID === "Christoph") {
            videoScreen.rotation.y = Math.PI / 180 * -28;
        }

        const sound = new THREE.PositionalAudio(audioListener);
        audioLoader.load(obj.MP3, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setRefDistance(1);
            sound.setVolume(1);
            sound.setDirectionalCone(360, 360, 0);
        });

        playSounds.push(sound);
        videoScreen.add(sound);
        scene.add(videoScreen);
        playVideos.push(video);

        objID.push(videoScreen.id);
        objInfo.push(
            [videoScreen.id, 
                `
                <span class="artist">${obj.artist}</span><br>
                <i>${obj.title}</i>, ${obj.date}<br>
                <span class="info">${obj.info}</span>
                `
            ]
        );

        if (obj.title === "Corpse") {
            screensToPath.push(videoScreen);
        }
    };

    // Load Images
    for (let i = 0; i < 3; i++) {
        let texture = new THREE.TextureLoader(manager).load(`../assets/images/${i + 1}.jpg`);
        texture.encoding = THREE.sRGBEncoding;
        const geometry = new THREE.BoxGeometry(20, 35, 1);
        const material = new THREE.MeshBasicMaterial({map: texture});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set((i * 25) + -202, 11, -675);

        scene.add(cube);

        objID.push(cube.id);
        objInfo.push(
            [cube.id, 
                `
                <span class="artist">Katharine Platts & Phoebe Bray</span><br>
                <i>Lęïfańg</i>, 2022<br>
                <span class="info">Text / Image</span>
                `
            ]
        )
    };
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

function playLeifangSound() {
    for (let i = 0; i < leifangSounds.length; i++) {
        leifangSounds[i].position.set(leifang_X, leifang_Y, leifang_Z);
    }
    let numb = Math.floor(Math.random() * leifangSounds.length);
    leifangSounds[numb].play();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);

    for (let i = 0; i < screensToPath.length; i++) {
        const path = points[i].line;
        const position = path.getPoint(fraction);
        const tangent = path.getTangent(fraction);
        screensToPath[i].position.copy(position);
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        screensToPath[i].quaternion.setFromAxisAngle(axis, radians);
    }

    fraction += 0.00001;
    if (fraction > 1) {
        fraction = 0;
    }

    if (videoTexture) {
        videoTexture.needsUpdate = true;
    }

    for (let i = 0; i < modelRotation.length; i++) {
        let speed = 0.003;
        modelRotation[i].rotation.y += speed;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();

    if (controls.isLocked === true) {
        let objIntersections = (
            new THREE.Raycaster(
                camera.position, 
                camera.getWorldDirection(new THREE.Vector3()), 0, 750)
        ).intersectObjects(scene.children, true);

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

        if (objIntersections[0] && leifangID.indexOf(objIntersections[0].object.id) !== -1) {
            leifang_X = objIntersections[0].object.position.x;
            leifang_Y = objIntersections[0].object.position.y;
            leifang_Z = objIntersections[0].object.position.z;
            document.addEventListener('click', playLeifangSound);
        } else {
            document.removeEventListener('click', playLeifangSound);
        }

        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 5.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        if (moveForward || moveBackward) 
            velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) 
            velocity.x -= direction.x * 400.0 * delta;
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        prevTime = time;
    }

    document.querySelector('.co-ord').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);
}