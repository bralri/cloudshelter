import {BoxGeometry, PlaneGeometry} from 'three';

export const roomDimensions = {
    x: 200, y: 60, z: 200
}

export const room = [
    {
        width: roomDimensions.x,
        length: roomDimensions.z,
        y: 0.1,
        rotationX: - Math.PI / 2,
        texture: "../assets/images/floor2.png"
    },
    {
        width: roomDimensions.x,
        height: roomDimensions.z,
        y: roomDimensions.y,
        rotationX: Math.PI / 2
    },
    {
        width: roomDimensions.x,
        height: roomDimensions.y,
        y: roomDimensions.y / 2,
        z: roomDimensions.z / 2,
        rotationY: Math.PI
    },
    {
        width: roomDimensions.x,
        height: roomDimensions.y,
        y: roomDimensions.y / 2,
        z: - roomDimensions.z / 2
    },
    {
        width: roomDimensions.z,
        height: roomDimensions.y,
        rotationY: Math.PI / 2,
        x: - roomDimensions.x / 2,
        y: roomDimensions.y / 2,
    },
    {
        width: roomDimensions.z,
        height: roomDimensions.y,
        rotationY: - Math.PI / 2,
        x: roomDimensions.x / 2,
        y: roomDimensions.y / 2,
    }
]

export const models = [
    {
        id: "bag",
        url: "../assets/models/gwen/bag.glb",
        title: "bag",
        date: "2018",
        info: "",
        x: 0, y: 10, z: 30
    },
    {
        id: "cake",
        url: "../assets/models/gwen/cake.glb",
        title: "cake",
        date: "2018",
        info: "",
        x: -20, y: 10, z: 30
    },
    {
        id: "fruit",
        url: "../assets/models/gwen/fruit.glb",
        title: "fruit",
        date: "2018",
        info: "",
        x: 20, y: 10, z: 30
    },
]

export const videos = [
    {
        id: "AI-SHIP",
        title: "AI-SHIP",
        date: "2018",
        info: "",
        audio: "../assets/sounds/gwen/AI-SHIP.mp3",
        geometry: new BoxGeometry(60, 35, 1),
        transparent: false,
        x: 0, y: 25, z: -99.4
    },
    {
        id: "Tanqueray",
        title: "Tanquery",
        date: "2018",
        info: "",
        audio: "../assets/sounds/gwen/Tanqueray.mp3",
        geometry: new BoxGeometry(60, 35, 1),
        transparent: false,
        x: 0, y: 25, z: 99.4
    },
    {
        id: "TOD_AD",
        title: "TOD_AD",
        date: "2018",
        info: "",
        audio: "",
        geometry: new BoxGeometry(1, 30, 20),
        transparent: false,
        x: 99.4, y: 20, z: 0
    },
    {
        id: "bebe",
        title: "Bebe",
        date: "2018",
        info: "Click to talk with Bebe",
        audio: "../assets/sounds/gwen/bebe.mp3",
        geometry: new PlaneGeometry(15, 30),
        transparent: true,
        x: 0, y: 13, z: -40
    },
    {
        id: "morph",
        title: "Morph",
        date: "2018",
        info: "",
        audio: "",
        geometry: new PlaneGeometry(10, 15),
        transparent: true,
        x: -20, y: 10, z: -40
    },
    {
        id: "PPT1609_1",
        title: "PPT1609_1",
        date: "2018",
        info: "",
        audio: "",
        geometry: new BoxGeometry(1, 50, 25),
        transparent: false,
        x: -99.4, y: 30, z: 30
    },
    {
        id: "PPT1609_2",
        title: "PPT1609_2",
        date: "2018",
        info: "",
        audio: "",
        geometry: new BoxGeometry(1, 50, 25),
        transparent: false,
        x: -99.4, y: 30, z: -30
    },
]

export const images = [
    {
        id: "ai-ship",
        url: "../assets/images/gwen/ai-ship.jpg",
        title: "AI-SHIP",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -100, y: 0, z: 0,
        transparent: false
    },
    {
        id: "bag1",
        url: "../assets/images/gwen/bag1.png",
        title: "BAG 1",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -200, y: 0, z: 0,
        transparent: true
    },
    {
        id: "bag2",
        url: "../assets/images/gwen/bag2.png",
        title: "BAG 2",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -300, y: 0, z: 0,
        transparent: true
    },
    {
        id: "bag3",
        url: "../assets/images/gwen/bag3.png",
        title: "BAG 3",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -400, y: 0, z: 0,
        transparent: true
    },
    {
        id: "book",
        url: "../assets/images/gwen/book.png",
        title: "",
        date: "",
        info: "click to read",
        geometry: new PlaneGeometry(15, 30),
        x: -500, y: 0, z: 0,
        transparent: false
    },
    {
        id: "DwlaJXhU",
        url: "../assets/images/gwen/DwlaJXhU.jpg",
        title: "DwlaJXhU",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -600, y: 0, z: 0,
        transparent: false
    },
    {
        id: "ppt1609",
        url: "../assets/images/gwen/ppt1609.jpg",
        title: "ppt1609",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -700, y: 0, z: 0,
        transparent: false
    },
    {
        id: "tod",
        url: "../assets/images/gwen/tod.jpg",
        title: "tod",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -800, y: 0, z: 0,
        transparent: false
    },
    {
        id: "xw11PtEw",
        url: "../assets/images/gwen/xw11PtEw.jpg",
        title: "xw11PtEw",
        date: "?",
        info: "",
        geometry: new PlaneGeometry(15, 30),
        x: -900, y: 0, z: 0,
        transparent: false
    },
]