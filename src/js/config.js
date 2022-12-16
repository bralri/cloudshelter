import * as THREE from 'three';
import { Vector3 } from 'three';

export const models = [
    // Environment
    {
        ID: "Environment",
        URL: '../assets/models/environment/scene.gltf',
        x: 0, y: 0, z: 0
    },
    //
    // Molly
    {
        ID: "Molly",
        URL: '../assets/models/molly/Dock.glb',
        artist: "Molly Erin McCarthy",
        title: "Dock",
        info: "3D Model",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: '../assets/models/molly/Door.glb',
        artist: "Molly Erin McCarthy",
        title: "Door",
        info: "3D Model",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: '../assets/models/molly/Grave.glb',
        artist: "Molly Erin McCarthy",
        title: "Grave",
        info: "3D Model",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: '../assets/models/molly/Pennywort.glb',
        artist: "Molly Erin McCarthy",
        title: "Pennywort",
        info: "3D Model",
        x: 0, y: 0, z: 0
    },
    {
        ID: "Molly",
        URL: '../assets/models/molly/Trinity.glb',
        artist: "Molly Erin McCarthy",
        title: "Trinity",
        info: "3D Model",
        x: 0, y: 0, z: 0
    },
    //
    // Speculative Geologies
    {
        ID: "SpeculativeGeologies",
        URL: '../assets/models/speculative_geologies/57.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that translates languages",
        info: "3D Model",
        x: 60, y: 8, z: 0
    },
    {
        ID: "SpeculativeGeologies",
        URL: '../assets/models/speculative_geologies/57f.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that generates images",
        info: "3D Model",
        x: -20, y: 8, z: 940
    },
    {
        ID: "SpeculativeGeologies",
        URL: '../assets/models/speculative_geologies/63cc.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that accumulates oils, smudges, and fingerprints",
        info: "3D Model",
        x: -530, y: 8, z: 510
    },
    {
        ID: "SpeculativeGeologies",
        URL: '../assets/models/speculative_geologies/51.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral triangulates locations",
        info: "3D Model",
        x: 590, y: 8, z: -440
    },
    {
        ID: "SpeculativeGeologies",
        URL: '../assets/models/speculative_geologies/60aa.glb',
        artist: "Speculative Geologies by Jason Urban & Leslie Mutchler",
        title: "A rock or mineral that generates images",
        info: "3D Model",
        x: 475, y: 8, z: 430
    },
    //
    // Leifang
    {
        ID: "Lęïfańg",
        URL: '../assets/models/leifang/pearls.glb',
        artist: "Katherine Platts & Phoebe Bray",
        title: "Lęïfańg",
        info: "Click to listen to the Lęïfańg",
        x: 0, y: 0, z: 0
    }
]

export const pointLights = [
    // {
    //     x: -60,
    //     y: 4,
    //     z: -715,
    //     color: white
    // }
]

export const videos = [
    {
        ID: "Elf",
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Elf', Video Collage",
        MP3: "../assets/sounds/alex/Elf.mp3",
        geometry: new THREE.PlaneGeometry(20, 40),
        transparency: true
    },
    {
        ID: "Picnic",
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Picnic', Video Collage",
        MP3: "../assets/sounds/alex/Picnic.mp3",
        geometry: new THREE.PlaneGeometry(10, 20),
        transparency: true
    },
    {
        ID: "Heat",
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Heat', Video Collage",
        MP3: "../assets/sounds/alex/Heat.mp3",
        geometry: new THREE.PlaneGeometry(10, 20),
        transparency: true
    }, 
    {
        ID: "Christoph",
        artist: "Christoph Jones",
        title: "The Void, Suicide and The Sorrowing of Man",
        date: "2022",
        info: "Contains discussions of suicide, death and depression",
        MP3: "../assets/sounds/christoph/christoph.mp3",
        geometry: new THREE.BoxGeometry(2, 35, 60),
        transparency: false,
        x: 1253,
        y: 20,
        z: -5
    }
]

export const points = [
    // Corpse - Elf
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 4, 200),
                new THREE.Vector3(-200, 4, 0),
                new THREE.Vector3(0, 4, -200),
                new THREE.Vector3(200, 4, 0)
            ], true, "centripetal")
        },
    // Corpse - Picnic
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-200, 4, 0),
                new THREE.Vector3(0, 4, -200),
                new THREE.Vector3(200, 4, 0),
                new THREE.Vector3(0, 4, 200)
            ], true, "centripetal")
        },
    // Corpse - Heat
        {
            line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 4, -200),
                new THREE.Vector3(200, 4, 0),
                new THREE.Vector3(0, 4, 200),
                new THREE.Vector3(-200, 4, 0)
            ], true, "centripetal")
        }
]