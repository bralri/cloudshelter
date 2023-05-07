import * as THREE from 'three';
import {variables} from '../js/_variables.min.js';

const v = variables;
const vol = 1;
const ref = 1;
const scale = 1;

export const assets = [
    // Room 0 - Entrance
    [
        // CANNON Tests
        {
            id: "plane",
            // THREE
            geometry: new THREE.PlaneGeometry(400, 400),
            c: 0xffffff,
            w: false,
            cannonObject: true,
                // CANNON
                type: CANNON.Body.STATIC,
                shape: new CANNON.Box(new CANNON.Vec3(200, 200, 0.1)),
                position: new CANNON.Vec3(0, -40, -75)
        },
        {
            id: "box",
            // THREE
            geometry: new THREE.BoxGeometry(10, 10, 10),
            c: 0xff0000,
            w: true,
            cannonObject: true,
                // CANNON
                mass: 1 / 12*12,
                shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5)),
                position: new CANNON.Vec3(0, 60, -75)
        },
        {
            id: "sphere",
            // THREE
            geometry: new THREE.SphereGeometry(10),
            c: 0x0000ff,
            w: true,
            cannonObject: true,
                // CANNON
                mass: 1 / 12*12,
                shape: new CANNON.Sphere(10),
                position: new CANNON.Vec3(0, 20, -80)
        },
        // Portal
        {
            type: "door",
            currentRoom: "Upkeep",
            nextRoom: "The Factory",
            x: 0, y: -500
        },
        // Cell Towers
        // {
        //     type: "glb",
        //     id: "Cell-Tower-1",
        //     title: "Cell-Tower-1",
        //     info: "Cell-Tower-1",
        //     src: v.celltower3GLB,
        //     x: -100, y: -30, z: -400,
        //     o: 1, t: false, scale: scale
        // },
        // {
        //     type: "glb",
        //     id: "Cell-Tower-2",
        //     title: "Cell-Tower-2",
        //     info: "Cell-Tower-2",
        //     src: v.celltower2GLB,
        //     x: 100, y: -30, z: -400,
        //     o: 1, t: false, scale: scale
        // },
        // Aircon Units
        // {
        //     type: "glb",
        //     id: "Aircon-1",
        //     title: "Aircon-1",
        //     info: "Aircon-1",
        //     src: v.aircon1GLB,
        //     x: 200, y: -30, z: -300,
        //     o: 1, t: false, scale: 2
        // },
        // {
        //     type: "glb",
        //     id: "Aircon-2",
        //     title: "Aircon-2",
        //     info: "Aircon-2",
        //     src: v.aircon2GLB,
        //     x: 100, y: -30, z: -300,
        //     o: 1, t: false, scale: 2
        // },
        // {
        //     type: "glb",
        //     id: "Aircon-3",
        //     title: "Aircon-3",
        //     info: "Aircon-3",
        //     src: v.aircon3GLB,
        //     x: 0, y: -30, z: -300,
        //     o: 1, t: false, scale: 2
        // },
        // {
        //     type: "glb",
        //     id: "Aircon-4",
        //     title: "Aircon-4",
        //     info: "Aircon-4",
        //     src: v.aircon4GLB,
        //     x: -100, y: -30, z: -300,
        //     o: 1, t: false, scale: 2
        // },
        // {
        //     type: "glb",
        //     id: "Aircon-5",
        //     title: "Aircon-5",
        //     info: "Aircon-5",
        //     src: v.aircon5GLB,
        //     x: -200, y: -30, z: -300,
        //     o: 1, t: false, scale: 2
        // },
        // // Videos
        // {
        //     type: "video",
        //     id: "AL-Ship-Banner",
        //     title: "AL-Ship Banner",
        //     info: "",
        //     src: v.ALShipBannerVideo,
        //     width: 1920 * 4, height: 1080 * 4,
        //     geometryW: 192, geometryH: 108,
        //     transparency: true,
        //     x: -400, y: 400, z: -151
        // },
        // {
        //     type: "video",
        //     id: "AL-Ship-Ad",
        //     title: "AL-Ship Ad",
        //     info: "",
        //     src: v.ALShipAdVideo,
        //     audio: v.ALShipHolofiedMP3,
        //     width: 1920, height: 1080,
        //     geometryW: 192, geometryH: 108,
        //     transparency: true,
        //     x: -200, y: 25, z: -150,
        //     volume: vol, ref: ref
        // },
        // {
        //     type: "video",
        //     id: "TOD-Ad",
        //     title: "TOD-Ad",
        //     info: "",
        //     src: v.TODAdVideo,
        //     width: 1920, height: 1080,
        //     geometryW: 192, geometryH: 108,
        //     transparency: true,
        //     x: 0, y: 25, z: -150
        // },
        // {
        //     type: "video",
        //     id: "Tanqueray-TOD",
        //     title: "Tanqueray-TOD",
        //     info: "",
        //     src: v.TanquerayTODVideo,
        //     audio: v.TanquerayTODAudio,
        //     width: 1280, height: 720,
        //     geometryW: 192, geometryH: 108,
        //     transparency: true,
        //     x: 200, y: 25, z: -150,
        //     volume: vol, ref: ref
        // },
        // {
        //     type: "video",
        //     id: "Tanqueray-Ad",
        //     title: "Tanqueray-Ad",
        //     info: "",
        //     src: v.TanquerayAdVideo,
        //     audio: v.TanquerayAdAudio,
        //     width: 1920, height: 1080,
        //     geometryW: 192, geometryH: 108,
        //     transparency: true,
        //     x: 400, y: 25, z: -150,
        //     volume: vol, ref: ref
        // }
    ],
    // Room 1 - The Factory
    [
        // Portal
        {
            type: "door",
            currentRoom: "The Factory",
            nextRoom: "Nails",
            x: -200, y: 50
        },
        // Structures
        {
            type: "glb",
            id: "Factory",
            title: "Factory",
            info: "Factory",
            src: v.factoryGLB,
            x: 0, y: -30, z: -400,
            o: 1, t: true, scale: 2
        },
        // Videos
        {
            type: "video",
            id: "Bio-Nest-1",
            title: "Bio-Nest-1",
            info: "Bio-Nest-1",
            src: v.bioNest1Video,
            audio: v.bioNest1MP3,
            width: 720, height: 576,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 400, y: 10, z: -150,
            volume: vol, ref: ref
        },
        {
            type: "video",
            id: "Bio-Nest-2",
            title: "Bio-Nest-2",
            info: "Bio-Nest-2",
            src: v.bioNest2Video,
            audio: v.bioNest2MP3,
            width: 720, height: 576,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 200, y: 10, z: -150,
            volume: vol, ref: ref
        },
        {
            type: "video",
            id: "Bio-Nest-3",
            title: "Bio-Nest-3",
            info: "Bio-Nest-3",
            src: v.bioNest3Video,
            audio: v.bioNest3MP3,
            width: 720, height: 576,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 0, y: 10, z: -150,
            volume: vol, ref: ref
        },
        {
            type: "video",
            id: "Bio-Nest-4",
            title: "Bio-Nest-4",
            info: "Bio-Nest-4",
            src: v.bioNest4Video,
            audio: v.bioNest4MP3,
            width: 720, height: 576,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: -200, y: 10, z: -150,
            volume: vol, ref: ref
        },
        {
            type: "video",
            id: "Bio-Nest-5",
            title: "Bio-Nest-5",
            info: "Bio-Nest-5",
            src: v.bioNest5Video,
            audio: v.bioNest5MP3,
            width: 720, height: 576,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: -400, y: 10, z: -150,
            volume: vol, ref: ref
        }
    ],
    // Room 2 - Nails
    [
        // Portal
        {
            type: "door",
            currentRoom: "Nails",
            nextRoom: "Biltong",
            x: -200, y: 50
        },
        // Structures
        {
            type: "glb",
            id: "red-nail",
            title: "red-nail",
            info: "red-nail",
            src: v.redNailGLB,
            x: -250, y: -30, z: -500,
            o: 1, t: false, scale: scale
        },
        {
            type: "glb",
            id: "blue-nail",
            title: "blue-nail",
            info: "blue-nail",
            src: v.blueNailGLB,
            x: 250, y: -30, z: -500,
            o: 0.9, t: true, scale: scale
        },
        // Videos
        

        {
            type: "video",
            id: "ppt1609-Spam",
            title: "ppt1609-Spam",
            info: "",
            src: v.ppt1609SpamAdVideo,
            width: 1920, height: 1080,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: -400, y: 25, z: -150
        },
        {
            type: "video",
            id: "ppt1609-QR",
            title: "ppt1609-QR",
            info: "",
            src: v.ppt1609QRVideo,
            width: 1920, height: 1080,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: -200, y: 25, z: -150
        },
        {
            type: "video",
            id: "Chatroom-Ad",
            title: "Chatroom-Ad",
            info: "",
            src: v.chatroomAdVideo,
            width: 1920, height: 1080,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: 0, y: 25, z: -150
        },
        {
            type: "video",
            id: "Peen-Bucket",
            title: "Peen-Bucket",
            info: "",
            src: v.peenBucketVideo,
            audio: v.peenBucketAudio,
            width: 720, height: 576,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: 200, y: 25, z: -150,
            volume: vol, ref: ref
        },
        {
            type: "video",
            id: "Peen-Bucket",
            title: "Peen-Bucket",
            info: "",
            src: v.peenVideo,
            audio: v.peenAudio,
            width: 720, height: 576,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: 400, y: 25, z: -150,
            volume: vol, ref: ref
        }
    ],
    // Room 3 - Amoeba
    [
        // Portal
        {
            type: "door",
            currentRoom: "Biltong",
            nextRoom: "Upkeep",
            x: -200, y: 50
        },
        {
            type: "glb",
            id: "Biltong",
            title: "Biltong",
            info: "Biltong",
            src: v.biltongGLB,
            x: 0, y: -30, z: -1000,
            o: 0.9, t: false, scale: scale
        }
    ]
]