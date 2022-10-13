const models = [
    {
        name: "entrance lane",
        URL: '../models/voidshow/mainlane.glb',
        px: -32,
        py: -2,
        pz: -740,
        scale: 0.5,
        rx: 0,
        ry: 0,
        rz: 0
    },
    {
        name: "underpass blue",               
        URL: '../models/voidshow/underpassblue.glb',
        px: 1000,
        py: -2.5,
        pz: -2000,
        scale: 1,
        rx: 0,
        ry: 45,
        rz: 2
    },
    {
        name: "underpass grey",              
        URL: '../models/voidshow/underpassgrey.glb',
        px: -500,
        py: -2.5,
        pz: -2000,
        scale: 1.5,
        rx: 0,
        ry: 45,
        rz: 0
    },
    {
        name: "tree",             
        URL: '../models/voidshow/tree.glb',
        px: 0,
        py: -2,
        pz: -2500,
        scale: 0.5,
        rx: 0,
        ry: 0,
        rz: 0
    },
    {
        name: "path",             
        URL: '../models/voidshow/path.glb',
        px: -200,
        py: -2,
        pz: -2500,
        scale: 0.5,
        rx: 0,
        ry: 0,
        rz: 0
    },
    {
        name: "bin 1",             
        URL: '../models/voidshow/bin.glb',
        px: 100,
        py: -2,
        pz: -2500,
        scale: 0.2,
        rx: 0,
        ry: 0,
        rz: 0
    },
    {
        name: "forest structure",            
        URL: '../models/voidshow/foreststructure.glb',
        px: 0,
        py: -14,
        pz: -2300,
        scale: 0.2,
        rx: 0,
        ry: 0,
        rz: 0
    }
]

const pointsArray = [
    {
        line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 8, 0),
                new THREE.Vector3(-18, 8, -365),
                new THREE.Vector3(-41, 8, -985),
                new THREE.Vector3(12, 8, -1173),
                new THREE.Vector3(290, 8, -1359),
                new THREE.Vector3(393, 8, 187),
                new THREE.Vector3(100, 8, 218)
        ], true, "centripetal")
    },
    {
        line: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-494, 8, -2001),
                new THREE.Vector3(-536, 8, -2041),
                new THREE.Vector3(-573, 8, -2058),
                new THREE.Vector3(-633, 8, -2043),
                new THREE.Vector3(-780, 8, -1970),
                new THREE.Vector3(-898, 15, -2217),
                new THREE.Vector3(-628, 25, -2397),
                new THREE.Vector3(-578, 15, -2142),
                new THREE.Vector3(-563, 8, -2074),
                new THREE.Vector3(-537, 8, -2036),
                new THREE.Vector3(-445, 8, -1943),
                new THREE.Vector3(-371, 8, -1887),
                new THREE.Vector3(-222, 8, -1977),
                new THREE.Vector3(-66, 8, -1758),
                new THREE.Vector3(-306, 8, -1551),
                new THREE.Vector3(-357, 8, -1815),
                new THREE.Vector3(-416, 8, -1919)
        ], true, "centripetal") 
    }
]

const videos = [
    {
        ID: "Elf",
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "",
        MP3: "../sound/voidshow/Alex/Elf.mp3",
        geometry: new THREE.PlaneBufferGeometry(10, 20),
        transparency: true,
        refDistance: 2,
        volume: 0.1,
        innercone: 360,
        outercone: 360,
        rotation: Math.PI/2
    },
    {
        ID: "Picnic",
        artist: "Alex Pearl",
        title: "Corpse",
        date: "2022",
        info: "",
        MP3: "../sound/voidshow/Alex/Picnic.mp3",
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
        info: "11 minute loop",
        MP3: "../sound/voidshow/Christoph/christoph.mp3",
        geometry: new THREE.BoxBufferGeometry(70, 45, 2),
        transparency: false,
        refDistance: 3,
        volume: 1,
        innercone: 180,
        outercone: 230,
        rotation: -62,
        px: 1093,
        py: 30,
        pz: -2110
    }
]

const imgs = [
    {
        img: "../img/voidshow/about/Alex.png",
        px: 961,
        py: 10,
        pz: -2021
    },
    {
        img: "../img/voidshow/about/Brian.png",
        px: 980,
        py: 10,
        pz: -2055
    },
    {
        img: "../img/voidshow/about/Bryan.png",
        px: 999,
        py: 10,
        pz: -2088
    },
    {
        img: "../img/voidshow/about/Christoph.png",
        px: 1008,
        py: 10,
        pz: -1935
    },
    {
        img: "../img/voidshow/about/Gwen.png",
        px: 1031,
        py: 10,
        pz: -1976
    },
    {
        img: "../img/voidshow/about/Molly.png",
        px: 1049,
        py: 10,
        pz: -2009
    }
]