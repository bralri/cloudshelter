import * as THREE from 'three';

// GLB
const factoryGLB = "../assets/models/gwen/factory_2.glb";
const structureGLB = "../assets/models/gwen/structures/1.glb";

// Audio
const bioNest1 = "../assets/videos/Holes/bio-nest-1/bio-nest-1.mp3";
const bioNest2 = "../assets/videos/Holes/bio-nest-2/bio-nest-2.mp3";
const bioNest3 = "../assets/videos/Holes/bio-nest-3/bio-nest-3.mp3";
const bioNest4 = "../assets/videos/Holes/bio-nest-4/bio-nest-4.mp3";
const bioNest5 = "../assets/videos/Holes/bio-nest-5/bio-nest-5.mp3";

const vol = 3;

export const artworks = [
    // Room 0 - The Factory
    [
        {
            id: "Factory",
            type: "glb",
            title: "Factory",
            info: "Factory",
            src: factoryGLB,
            x: 0, y: -30, z: -400,
            o: 1, t: true
        },
        {
            id: "Bio-Nest-1",
            type: "video",
            title: "Bio-Nest-1",
            info: "Bio-Nest-1",
            audio: bioNest1,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: 400, y: 10, z: -150,
            volume: vol
        },
        {
            id: "Bio-Nest-2",
            type: "video",
            title: "Bio-Nest-2",
            info: "Bio-Nest-2",
            audio: bioNest2,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: 200, y: 10, z: -150,
            volume: vol
        },
        {
            id: "Bio-Nest-3",
            type: "video",
            title: "Bio-Nest-3",
            info: "Bio-Nest-3",
            audio: bioNest3,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: 0, y: 10, z: -150,
            volume: vol
        },
        {
            id: "Bio-Nest-4",
            type: "video",
            title: "Bio-Nest-4",
            info: "Bio-Nest-4",
            audio: bioNest4,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: -200, y: 10, z: -150,
            volume: vol
        },
        {
            id: "Bio-Nest-5",
            type: "video",
            title: "Bio-Nest-5",
            info: "Bio-Nest-5",
            audio: bioNest5,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: -400, y: 10, z: -150,
            volume: vol
        }
    ],
    // Room 1 - Random Structure
    [
        {
            id: "Structure",
            type: "glb",
            title: "Structure",
            info: "Structure",
            src: structureGLB,
            x: 0, y: 0, z: -300,
            o: 1, t: true
        },
        {
            id: "Bio-Nest-1",
            type: "video",
            title: "Bio-Nest-1",
            info: "",
            mp3: bioNest3,
            geometry: new THREE.PlaneGeometry(72, 57),
            transparency: true,
            x: 0, y: 10, z: -150,
            volume: vol
        }
    ]
]

export const models = [
    // Environment
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/structures/1.glb',
        x: 0, y: 0, z: -750,
        o: 0.4, t: true
    },
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/structures/2.glb',
        x: 0, y: 0, z: 750,
        o: 0.4, t: true
    },
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/structures/3.glb',
        x: -750, y: 0, z: 0,
        o: 0.4, t: true
    },
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/structures/4.glb',
        x: 750, y: 0, z: 0,
        o: 0.4, t: true
    },
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/factory_2.glb',
        x: 750, y: 0, z: -750,
        o: 0.3, t: true
    },
    {
        ID: "structure: ",
        URL: '../assets/models/gwen/structures/6.glb',
        x: -750, y: 0, z: -750,
        o: 0.4, t: true
    },

    {
        ID: "structure: ",
        URL: '../assets/models/gwen/red_nail.glb',
        x: 0, y: -30, z: 0,
        o: 1, t: false
    }
]

export const videos = [
    // Holograms
    {
        ID: "Banner",
        title: "AL-Ship Banner",
        info: "",
        MP3: "",
        geometry: new THREE.PlaneGeometry(192, 108),
        transparency: true,
        x: 1400, y: 100, z: -500
    },
    {
        ID: "Holofied",
        title: "AL-Ship Holofied",
        info: "",
        MP3: "../assets/videos/Holograms/Holofied/holofied.mp3",
        geometry: new THREE.PlaneGeometry(192, 108),
        transparency: true,
        x: 1200, y: 100, z: -500
    },

    // Holes
    // Bio-Nests
    {
        ID: "Bio-Nest-1",
        title: "Bio-Nest-1",
        info: "",
        MP3: "../assets/videos/Holes/bio-nest-1/bio-nest-1.mp3",
        geometry: new THREE.PlaneGeometry(72, 57),
        transparency: true,
        x: 1100, y: 10, z: -500
    },
    {
        ID: "Bio-Nest-2",
        title: "Bio-Nest-2",
        info: "",
        MP3: "../assets/videos/Holes/bio-nest-2/bio-nest-2.mp3",
        geometry: new THREE.PlaneGeometry(72, 57),
        transparency: true,
        x: 1000, y: 10, z: -500
    },
    {
        ID: "Bio-Nest-3",
        title: "Bio-Nest-3",
        info: "",
        MP3: "../assets/videos/Holes/bio-nest-3/bio-nest-3.mp3",
        geometry: new THREE.PlaneGeometry(72, 57),
        transparency: true,
        x: 900, y: 10, z: -500
    },
    {
        ID: "Bio-Nest-4",
        title: "Bio-Nest-4",
        info: "",
        MP3: "../assets/videos/Holes/bio-nest-4/bio-nest-4.mp3",
        geometry: new THREE.PlaneGeometry(72, 57),
        transparency: true,
        x: 800, y: 10, z: -500
    },
    {
        ID: "Bio-Nest-5",
        title: "Bio-Nest-5",
        info: "",
        MP3: "../assets/videos/Holes/bio-nest-5/bio-nest-5.mp3",
        geometry: new THREE.PlaneGeometry(72, 57),
        transparency: true,
        x: 700, y: 10, z: -500
    },

    // papaya
    {
        ID: "Papaya-0",
        title: "Papaya-0",
        info: "",
        geometry: new THREE.PlaneGeometry(72, 58),
        transparency: false,
        x: 600, y: 10, z: -500
    },
    {
        ID: "Papaya-1",
        title: "Papaya-1",
        info: "",
        geometry: new THREE.PlaneGeometry(72, 58),
        transparency: false,
        x: 500, y: 10, z: -500
    },
    {
        ID: "Papaya-2",
        title: "Papaya-2",
        info: "",
        geometry: new THREE.PlaneGeometry(72, 58),
        transparency: false,
        x: 400, y: 10, z: -500
    },

    // morph
    {
        ID: "Morph-1",
        title: "Morph-1",
        info: "",
        geometry: new THREE.PlaneGeometry(72, 108),
        transparency: true,
        x: 300, y: 10, z: -500
    },
    {
        ID: "Morph-2",
        title: "Morph-2",
        info: "",
        geometry: new THREE.PlaneGeometry(82, 108),
        transparency: true,
        x: 200, y: 10, z: -500
    },

    // AL-Ship
    {
        ID: "AL-ere(a)ction",
        title: "AL-ere(a)ction",
        info: "",
        MP3: "../assets/videos/AL-SHIP/AL-ere(a)ction/AL-ere(a)ction.mp3",
        geometry: new THREE.PlaneGeometry(72, 58),
        transparency: false,
        x: 100, y: 10, z: -500
    },
    {
        ID: "AL-Feet",
        title: "AL-Feet",
        info: "",
        MP3: "../assets/videos/AL-SHIP/AL-Feet/Al-Feet.mp3",
        geometry: new THREE.PlaneGeometry(64, 48),
        transparency: false,
        x: 0, y: 10, z: -500
    },
    {
        ID: "AL-Licking",
        title: "AL-Licking",
        info: "",
        geometry: new THREE.PlaneGeometry(128, 72),
        transparency: false,
        x: -200, y: 10, z: -500
    },
    {
        ID: "AL-Touching",
        title: "AL-Touching",
        info: "",
        geometry: new THREE.PlaneGeometry(128, 72),
        transparency: false,
        x: -400, y: 10, z: -500
    }
]