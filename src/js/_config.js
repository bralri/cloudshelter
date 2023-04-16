import {variables} from './_variables.js';

const v = variables[0];
const vol = 3;

export const artworks = [
    // Room 0 - Entrance
    [
        {
            type: "video",
            id: "Banner",
            src: v.bannerVideo,
            width: 1920, height: 1080,
            title: "AL-Ship Banner",
            info: "",
            audio: "",
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: -100, y: 50, z: -150,
            volume: vol
        },
        {
            type: "video",
            id: "Holofied",
            src: v.holofiedVideo,
            width: 1920, height: 1080,
            title: "AL-Ship Holofied",
            info: "",
            audio: v.ALShipHolofiedMP3,
            geometryW: 192, geometryH: 108,
            transparency: true,
            x: 100, y: 50, z: -150,
            volume: vol
        }
    ],
    // Room 1 - The Factory
    [
        {
            type: "glb",
            id: "Factory",
            title: "Factory",
            info: "Factory",
            src: v.factoryGLB,
            x: 0, y: -30, z: -400,
            o: 1, t: true
        },
        {
            type: "video",
            id: "Bio-Nest-1",
            src: v.bioNest1Video,
            width: 720, height: 576,
            title: "Bio-Nest-1",
            info: "Bio-Nest-1",
            audio: v.bioNest1MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 400, y: 10, z: -150,
            volume: vol
        },
        {
            type: "video",
            id: "Bio-Nest-2",
            src: v.bioNest2Video,
            width: 720, height: 576,
            title: "Bio-Nest-2",
            info: "Bio-Nest-2",
            audio: v.bioNest2MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 200, y: 10, z: -150,
            volume: vol
        },
        {
            type: "video",
            id: "Bio-Nest-3",
            src: v.bioNest3Video,
            width: 720, height: 576,
            title: "Bio-Nest-3",
            info: "Bio-Nest-3",
            audio: v.bioNest3MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 0, y: 10, z: -150,
            volume: vol
        },
        {
            type: "video",
            id: "Bio-Nest-4",
            src: v.bioNest4Video,
            width: 720, height: 576,
            title: "Bio-Nest-4",
            info: "Bio-Nest-4",
            audio: v.bioNest4MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: -200, y: 10, z: -150,
            volume: vol
        },
        {
            type: "video",
            id: "Bio-Nest-5",
            src: v.bioNest5Video,
            width: 720, height: 576,
            title: "Bio-Nest-5",
            info: "Bio-Nest-5",
            audio: v.bioNest5MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: -400, y: 10, z: -150,
            volume: vol
        }
    ],
    // Room 2
    [
        {
            type: "glb",
            id: "Structure 1",
            title: "Structure 1",
            info: "Structure 1",
            src: v.structure1GLB,
            x: 0, y: 0, z: -300,
            o: 1, t: true
        },
        {
            type: "video",
            id: "Bio-Nest-1",
            src: v.bioNest1Video,
            width: 720, height: 576,
            title: "Bio-Nest-1",
            info: "",
            audio: v.bioNest3MP3,
            geometryW: 72, geometryH: 57,
            transparency: true,
            x: 0, y: 10, z: -150,
            volume: vol
        }
    ],
]