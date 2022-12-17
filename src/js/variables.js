import * as THREE from 'three';

export const models = [
    // Environment
    {
        ID: "scene",
        URL: 'assets/models/environment/scene.gltf',
        x: 0, y: 0, z: 0
    },
    //
    // Molly Erin McCarthy
    {
        ID: "Molly",
        URL: 'assets/models/molly/Dock.glb',
        artist: "Molly Erin McCarthy",
        title: "Dock",
        info: "",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: 'assets/models/molly/Door.glb',
        artist: "Molly Erin McCarthy",
        title: "Door",
        info: "",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: 'assets/models/molly/Grave.glb',
        artist: "Molly Erin McCarthy",
        title: "Grave",
        info: "",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: 'assets/models/molly/Pennywort.glb',
        artist: "Molly Erin McCarthy",
        title: "Pennywort",
        info: "",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: 'assets/models/molly/Trinity.glb',
        artist: "Molly Erin McCarthy",
        title: "Trinity",
        info: "",
        x: 0, y: 0, z: 0
    },
    //
    // Speculative Geologies
    {
        ID: "SpeculativeGeologies",
        URL: 'assets/models/speculative_geologies/57.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that translates languages",
        info: "",
        x: 60, y: 8, z: 0
    },
    {
        ID: "SpeculativeGeologies",
        URL: 'assets/models/speculative_geologies/57f.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that generates images",
        info: "",
        x: -20, y: 8, z: 940
    },
    {
        ID: "SpeculativeGeologies",
        URL: 'assets/models/speculative_geologies/63cc.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that accumulates oils, smudges, and fingerprints",
        info: "",
        x: -530, y: 8, z: 510
    },
    {
        ID: "SpeculativeGeologies",
        URL: 'assets/models/speculative_geologies/51.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral triangulates locations",
        info: "",
        x: 590, y: 8, z: -440
    },
    {
        ID: "SpeculativeGeologies",
        URL: 'assets/models/speculative_geologies/60aa.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that generates images",
        info: "",
        x: 475, y: 8, z: 430
    },
    //
    // Leifang
    {
        ID: "Lęïfańg",
        URL: 'assets/models/leifang/pearls.glb',
        artist: "Katherine Platts & Phoebe Bray",
        title: "Lęïfańg",
        info: "Click to listen to the Lęïfańg",
        x: 0, y: 0, z: 0
    }
]

export const videos = [
    // Alex Pearl
    {
        ID: "Long",
        artist: "Alex Pearl",
        title: "Corpse",
        info: "",
        MP3: "assets/sounds/alex/Long.mp3",
        geometry: new THREE.PlaneGeometry(20, 40),
        transparency: true
    },
    {
        ID: "Picnic",
        artist: "Alex Pearl",
        title: "Corpse",
        info: "",
        MP3: "assets/sounds/alex/Picnic.mp3",
        geometry: new THREE.PlaneGeometry(15, 30),
        transparency: true
    },
    {
        ID: "Heat",
        artist: "Alex Pearl",
        title: "Corpse",
        info: "",
        MP3: "assets/sounds/alex/Heat.mp3",
        geometry: new THREE.PlaneGeometry(15, 30),
        transparency: true
    },
    //
    // Christoph Jones
    {
        ID: "Christoph",
        artist: "Christoph Jones",
        title: "The Void, Suicide and The Sorrowing of Man",
        info: "CW// Contains discussions of suicide, death and depression",
        MP3: "assets/sounds/christoph/christoph.mp3",
        geometry: new THREE.BoxGeometry(2, 35, 60),
        transparency: false,
        x: 1253, y: 20, z: -5
    }
]

export const points = [
    // Corpse - Long
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(660, 5, 690),
                new THREE.Vector3(890, 5, 160),
                new THREE.Vector3(1210, 5, 240),
                new THREE.Vector3(980, 5, 440),
                new THREE.Vector3(730, 5, 430),
                new THREE.Vector3(500, 5, 110),
                new THREE.Vector3(90, 5, 170),
                new THREE.Vector3(-130, 5, 530),
                new THREE.Vector3(50, 5, 760),
                new THREE.Vector3(450, 5, 960)
            ], true, "centripetal"),
            color: 0xECFF00
        },
    // Corpse - Picnic
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-700, 3, -700),
                new THREE.Vector3(-680, 3, -490),
                new THREE.Vector3(-520, 3, -380),
                new THREE.Vector3(-150, 3, -170),
                new THREE.Vector3(-300, 3, -20),
                new THREE.Vector3(-760, 3, -60),
                new THREE.Vector3(-950, 3, -235),
                new THREE.Vector3(-1110, 3, -540),
                new THREE.Vector3(-890, 3, -770)
            ], true, "centripetal"),
            color: 0xFF0000
        },
    // Corpse - Heat
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(230, 2, -470),
                new THREE.Vector3(870, 2, -840),
                new THREE.Vector3(1040, 2, -480),
                new THREE.Vector3(620, 2, -80),
                new THREE.Vector3(330, 2, -80),
                new THREE.Vector3(170, 2, -340)
            ], true, "centripetal"),
            color: 0x0000FF
        }
]