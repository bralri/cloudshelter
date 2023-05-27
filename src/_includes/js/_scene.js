import * as THREE from 'three';
import { PointerLockControls } from 'three/PointerLockcontrols.js';
import { Water } from 'three/Water.js';
import { Water2 } from 'three/Water2.js';
import { COLOURS, TEXTURES } from './_config.min.js';

const worldSize = 10000;
let moveLeft = false, moveRight = false;
let moveForward = false, moveBackward = false;

export const createScene = () => {
    const scene = new THREE.Scene()
    scene.background = COLOURS.pink;
    scene.fog = new THREE.FogExp2(scene.background, 0.0006);

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        1,
        4000
    );

    const controls = setupControls(camera);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    const terrain = setupTerrain(scene, world);

    const draw = () => {
        world.step(1 / 60);
        terrain.water.material.uniforms['time'].value += 1 / 60;
        renderer.render(scene, camera);
    }

    return {
        controls,
        
        draw
    }
}

const setupControls = (camera) => {
    const controls = new PointerLockControls(camera, document.body);
    controls.getObject().position.set(0, 58, -20);

    controls.addEventListener('lock', function () {
        OVERLAY.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        OVERLAY.style.display = 'block';
    });
    TITLE.addEventListener('click', function () {
        if (sceneReady) {
            controls.lock();
            playAssets();
        }
    }, false);
    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp' : case 'KeyW' : moveForward = true; break;
            case 'ArrowLeft' : case 'KeyA' : moveLeft = true; break;
            case 'ArrowDown' : case 'KeyS' : moveBackward = true; break;
            case 'ArrowRight' : case 'KeyD' : moveRight = true; break;
        }
    };
    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp' : case 'KeyW' : moveForward = false; break;
            case 'ArrowLeft' : case 'KeyA' : moveLeft = false; break;
            case 'ArrowDown' : case 'KeyS' : moveBackward = false; break;
            case 'ArrowRight' : case 'KeyD' : moveRight = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return controls;
}

const setupTerrain = (scene, world) => {
    const terrainGeometry = new THREE.PlaneGeometry(worldSize, worldSize);
    const terrainBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(worldSize / 2, worldSize / 2, 0.01)),
        position: new CANNON.Vec3(0, -30, 0)
    })
    terrainBody.quaternion.setFromEuler(- Math.PI / 2, 0, 0);
    world.addBody(terrainBody);

    const water = new Water(terrainGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: TEXTURES.waterNormal,
            sunDirection: new THREE.Vector3(),
            sunColor: COLOURS.pink,
            waterColor: COLOURS.green,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
    });
    water.rotation.x = - Math.PI / 2;
    water.position.y = -60;

    const water2 = new Water2(terrainGeometry, 
        {
            color: COLOURS.green,
            scale: 10,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 512,
            textureHeight: 512
    });
    water2.renderOrder = 1;
    water2.rotation.x = - Math.PI / 2;
    water2.position.y = -29;
    scene.add(water, water2);

    return water;
}