import * as THREE from 'three';

export const models = [
    {
        artist: "Bryan Ridpath",
        title: "entrance lane",
        date: "2022",
        info: "photogrammetry model",
        URL: '/models/show/mainlane_1.glb',
        px: -32,
        py: -6,
        pz: -740,
        scale: 0.5,
        rx: 0,
        ry: 0,
        rz: 0
    },
    {
        artist: "Bryan Ridpath",
        title: "underpass blue",
        date: "2022",
        info: "photogrammetry model",            
        URL: '/models/show/underpassblue_1.glb',
        px: 1000,
        py: -6,
        pz: -2000,
        scale: 1,
        rx: 0,
        ry: 45,
        rz: 2
    },
    {
        artist: "Bryan Ridpath",
        title: "underpass grey",
        date: "2022",
        info: "photogrammetry model",          
        URL: '/models/show/underpassgrey_1.glb',
        px: -500,
        py: -6,
        pz: -2000,
        scale: 1.5,
        rx: 0,
        ry: 45,
        rz: 0
    },
    // {
    //     artist: "Bryan Ridpath",
    //     title: "tree",
    //     date: "2022",
    //     info: "photogrammetry model",            
    //     URL: '/models/show/tree.glb',
    //     px: 0,
    //     py: -2,
    //     pz: -2500,
    //     scale: 0.5,
    //     rx: 0,
    //     ry: 0,
    //     rz: 0
    // },
    // {
    //     artist: "Bryan Ridpath",
    //     title: "path",
    //     date: "2022",
    //     info: "photogrammetry model",           
    //     URL: '/models/show/path.glb',
    //     px: -200,
    //     py: -2,
    //     pz: -2500,
    //     scale: 0.5,
    //     rx: 0,
    //     ry: 0,
    //     rz: 0
    // },
    // {
    //     artist: "Bryan Ridpath",
    //     title: "bin",
    //     date: "2022",
    //     info: "photogrammetry model",           
    //     URL: '/models/show/bin.glb',
    //     px: 100,
    //     py: -2,
    //     pz: -2500,
    //     scale: 0.2,
    //     rx: 0,
    //     ry: 0,
    //     rz: 0
    // },
    // {
    //     artist: "Bryan Ridpath",
    //     title: "forest structure",
    //     date: "2022",
    //     info: "photogrammetry model",            
    //     URL: '/models/show/foreststructure.glb',
    //     px: 0,
    //     py: -14,
    //     pz: -2300,
    //     scale: 0.2,
    //     rx: 0,
    //     ry: 0,
    //     rz: 0
    // }
]

export const points = [
    {
        line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 2, 0),
                new THREE.Vector3(-18, 2, -365),
                new THREE.Vector3(-41, 2, -985),
                new THREE.Vector3(12, 2, -1173),
                new THREE.Vector3(290, 2, -1359),
                new THREE.Vector3(393, 2, 187),
                new THREE.Vector3(100, 1, 218)
        ], true, "centripetal")
    },
    {
        line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-494, 4, -2001),
                new THREE.Vector3(-536, 4, -2041),
                new THREE.Vector3(-573, 4, -2058),
                new THREE.Vector3(-633, 4, -2043),
                new THREE.Vector3(-780, 4, -1970),
                new THREE.Vector3(-898, 14, -2217),
                new THREE.Vector3(-628, 20, -2397),
                new THREE.Vector3(-578, 14, -2142),
                new THREE.Vector3(-563, 4, -2074),
                new THREE.Vector3(-537, 4, -2036),
                new THREE.Vector3(-445, 4, -1943),
                new THREE.Vector3(-371, 4, -1887),
                new THREE.Vector3(-222, 4, -1977),
                new THREE.Vector3(-66, 4, -1758),
                new THREE.Vector3(-306, 4, -1551),
                new THREE.Vector3(-357, 4, -1815),
                new THREE.Vector3(-416, 4, -1919)
        ], true, "centripetal") 
    }
]

export const videos = [
    {
        ID: "Elf",
        artist: "Dr Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Elf', Video Collage",
        MP3: "/sound/Alex/Elf.mp3",
        geometry: new THREE.PlaneBufferGeometry(20, 40),
        transparency: true,
        refDistance: 2,
        volume: 0.1,
        innercone: 360,
        outercone: 360,
        rotation: Math.PI/2
    },
    {
        ID: "Picnic",
        artist: "Dr Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Picnic', Video Collage",
        MP3: "/sound/Alex/Picnic.mp3",
        geometry: new THREE.PlaneBufferGeometry(10, 20),
        transparency: true,
        refDistance: 4,
        volume: 1,
        innercone: 360,
        outercone: 360,
        rotation: Math.PI/2
    },
    {
        ID: "Christoph",
        artist: "Christoph Jones",
        title: "The Void, Suicide and The Sorrowing of Man",
        date: "2022",
        info: "CW// Contains discussions of suicide, death and depression",
        MP3: "/sound/Christoph/christoph.mp3",
        geometry: new THREE.BoxBufferGeometry(70, 45, 2),
        transparency: false,
        refDistance: 3,
        volume: 1,
        innercone: 180,
        outercone: 230,
        rotation: -62,
        px: 1093,
        py: 25,
        pz: -2110
    }
]

export const imgs = [
    {
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "'Picnic', Video Collage",
        img: "/img/show/Alex.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 961,
        py: 10,
        pz: -2021
    },
    {
        artist: "Brian Hart",
        title: "Liberated Architecture",
        date: "2020-2022",
        info: "Digital Collage",
        img: "/img/show/Brian.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 980,
        py: 10,
        pz: -2055
    },
    {
        artist: "Bryan Ridpath",
        title: "Untitled: Photogrammetry",
        date: "2022",
        info: "Photogrammetry Model",
        img: "/img/show/Bryan.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 999,
        py: 10,
        pz: -2088
    },
    {
        artist: "Christoph Jones",
        title: "The Void",
        date: "2022",
        info: "11 minute video essay",
        img: "/img/show/Christoph.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 1008,
        py: 10,
        pz: -1935
    },
    {
        artist: "Gwen Senhui Chen",
        title: "untitled",
        date: "2022",
        info: "info",
        img: "/img/show/Gwen.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 1031,
        py: 10,
        pz: -1976
    },
    {
        artist: "Molly Erin McCarthy",
        title: "sci fi",
        date: "2022",
        info: "3D Model",
        img: "/img/show/Molly.png",
        geometry: new THREE.BoxBufferGeometry(2, 20, 20),
        px: 1049,
        py: 10,
        pz: -2009
    }
]

export const promiseLoader = (loader, onProgress) => {
    const promiseLoader = (url) => {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, onProgress, reject);
        });
    }

    return {
        originalLoader: loader,
        load: promiseLoader
    };
}