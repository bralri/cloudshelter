import * as THREE from 'three';
import { TetrahedronGeometry } from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {PointerLockControls} from 'three/PointerLockControls.js';

import {models, videos, images, room} from './lpl_variables.js';

let camera, scene, renderer, controls, object, sound;
let videoScreen, videoTexture;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const standingHeight = 15;

let speed = 5.0;
let _speed = 300.0; 

let objID = [];
let objInfo = [];

let playVideos = [];
let playSounds = [];
let playing = false;

const darkGrey = new THREE.Color(0x1A1A1A);
darkGrey.convertSRGBToLinear();
const medGrey = new THREE.Color(0x63666A);
medGrey.convertSRGBToLinear();
const white = new THREE.Color(0xFAF9F6);
white.convertSRGBToLinear();

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = darkGrey;
    // scene.fog = new THREE.FogExp2(scene.background, 0.01);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

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

    controls.getObject().position.set(0, standingHeight, 0);

    // Lights
    // const ambLight = new THREE.AmbientLight(darkGrey);
    // scene.add(ambLight);

    // const hemLight = new THREE.HemisphereLight(medGrey, darkGrey);
    // scene.add(hemLight);
    var mainLight = new THREE.PointLight( 0xffffff, 0.4, 0);
    mainLight.position.set( 0, 75, 0)
    scene.add( mainLight );
    var light = new THREE.AmbientLight( 0xfafafa, 0.4 );
    scene.add( light );

    const manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', (transition) => {
            transition.target.remove();
        });
    }

    // Audio Loader
    // const audioLoader = new THREE.AudioLoader(manager);
    // const audioListener = new THREE.AudioListener();
    // camera.add(audioListener);

    // sound = new THREE.PositionalAudio(audioListener);
    // audioLoader.load(
        
    //     '../assets/sounds/bus/Bus-stop.m4a', 
        
    //     function (buffer) {
    //         sound.setBuffer(buffer);
    //         sound.setLoop(true);
    //         sound.setRefDistance(1);
    //         sound.setVolume(1);
    //         sound.setDirectionalCone(360, 360, 0);
    // });
    // scene.add(sound)

    // Build Room
    for (var i in room) {
        let surface;
        if (room[i].texture) {
            let texture = new THREE.TextureLoader().load(room[i].texture);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(8, 8);
            surface = new THREE.Mesh(
                new THREE.PlaneGeometry(room[i].width, room[i].length),
                new THREE.MeshBasicMaterial({
                    map: texture,
                    alphaTest: 0.5
                })
            );
        } else {
            surface = new THREE.Mesh(
                new THREE.PlaneGeometry(room[i].width, room[i].height),
                new THREE.MeshPhongMaterial({
                    color: white,
                    side: THREE.FrontSide
                })
            );
        }
        surface.name = i;
        surface.position.set(
            room[i].x ? room[i].x : 0,
            room[i].y ? room[i].y : 0,
            room[i].z ? room[i].z : 0
        )
        surface.rotateX(room[i].rotationX ? room[i].rotationX : 0);
        surface.rotateY(room[i].rotationY ? room[i].rotationY : 0);
        surface.rotateZ(room[i].rotationZ ? room[i].rotationZ : 0);
        scene.add(surface);
    }

    // Load Models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < models.length; i++) {
        const obj = models[i];
        loader.load(
            
            obj.url, 
            
            function (glb) {

                object = glb.scene;
                object.position.set(obj.x, obj.y, obj.z);
                // scene.add(object);

                for (var i in object.children) {
                    objID.push(object.children[i].id);
                    objInfo.push([
                        object.children[i].id,
                        `
                            <span class="artist">Gwen SenHui Chen</span><br>
                            <i>${obj.title}</i><br>
                            <span class="info">${obj.info}</span>
                        `
                    ])
                }
        })
    }

    // Load Videos
    for (let i = 0; i < videos.length; i++) {
        const obj = videos[i];
        const video = document.getElementById(obj.id);
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
            transparent: obj.transparent,
            opacity: 1
        });
        videoScreen = new THREE.Mesh(obj.geometry, videoMaterial);
        videoScreen.position.set(obj.x, obj.y, obj.z);

            // const sound = new THREE.PositionalAudio(audioListener);
            // audioLoader.load(obj.MP3, function (buffer) {
            //     sound.setBuffer(buffer);
            //     sound.setLoop(true);
            //     sound.setRefDistance(1);
            //     sound.setVolume(1);
            //     sound.setDirectionalCone(360, 360, 0);
            // });

            // playSounds.push(sound);
            // videoScreen.add(sound);

        scene.add(videoScreen);
        playVideos.push(video);

        objID.push(videoScreen.id);
        objInfo.push(
            [videoScreen.id, 
                `
                <span class="artist">Gwen Senhui Chen</span><br>
                <i>${obj.title}</i><br>
                <span class="info">${obj.info}</span>
                `
            ]
        )
    }

    // Load Images
    for (let i = 0; i < images.length; i++) {
        const obj = images[i];
        const texture = new THREE.TextureLoader(manager).load(obj.url);
        texture.encoding = THREE.sRGBEncoding;
        const geometry = obj.geometry;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: obj.transparent,
            opacity: 1
        });
        const image = new THREE.Mesh(geometry, material);
        image.position.set(obj.x, obj.y, obj.z);

        // scene.add(image);

        objID.push(image.id);
        objInfo.push(
            [image.id, 
                `
                <span class="artist">Gwen Senhui Chen</span><br>
                <i>${obj.title}</i><br>
                <span class="info">${obj.info}</span>
                `
            ]
        )
    }

}

function playSoundsVideos() {
    if (!playing) {
        for (let i = 0; i < playVideos.length; i++) {
            playVideos[i].play();
        }
        // for (let i = 0; i < playSounds.length; i++) {
        //     playSounds[i].play();
        // }
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

    if (controls.isLocked === true) {
        let objIntersections = (new THREE.Raycaster(
            camera.position, // origin
            camera.getWorldDirection(new THREE.Vector3()))).intersectObjects(scene.children, true); //far

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

        const time = performance.now();
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * _speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * _speed * delta;
        
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        prevTime = time;
    }

    document.querySelector('.co-ord').innerHTML = Math.round(controls.getObject().position.x) + ", " + Math.round(controls.getObject().position.z);
}