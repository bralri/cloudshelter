import * as THREE from 'three';
import { GLTFLoader } from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const glbLoader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const audioLoader = new THREE.AudioLoader(manager);
export const audioListener = new THREE.AudioListener();
export const animationActions = [];

/**
* Methods for assets to trigger functions
* @param {boolean} pickUp if true, allows item to be picked up
* @param {boolean} canThrow if true, allows item, if picked up, to be able to be 'thrown'
* @param {boolean} anim if true, filter for models with animations
* @param {boolean} canTalk if true, filter for NPC model to talk or respond to user
*/

export const roomAssets = [
// Room 0 - Entrance
    [
    // Models // type: 'glb' // if throw asset, method: 'asset-to-throw'
        // Portals
        {
            assetId: 'portal-factory',
            type: 'glb',
            x: 0, y: -10, z: 1500, w: 0
        },
        // Scene assets
        {
            assetId: 'cell-tower',
            type: 'glb',
            x: 0, y: -30, z: 0, w: 0
        },

    // Videos
        // Al-Ships
        {
            assetId: 'al-ship-banner',
            type: 'video',
            x: -400, y: 10, z: -300, w: 0
        },{
            assetId: 'al-ship-ad',
            type: 'video',
            x: -400, y: 200, z: -300, w: 0
        },
        // ppt1609
        {
            assetId: 'ppt1609-spam-ad',
            type: 'video',
            x: 0, y: 100, z: -300, w: 0
        },{
            assetId: 'ppt1609-qr',
            type: 'video',
            x: 0, y: 400, z: -300, w: 0
        },
        // Tanqueray
        {
            assetId: 'tanqueray-tod',
            type: 'video',
            x: 400, y: 50, z: -300, w: 0
        },{
            assetId: 'tanqueray-ad',
            type: 'video',
            x: 400, y: 300, z: -300, w: 0
        }
    ],
// Room 1 - ?
    [
        {
            //
        }
    ]
]

const assetsFactory = {
// Models
    // Animated
    'doggo': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/doggo2.glb', x, y, z, w);

        model.then((asset) => {
            asset.mesh.scale.set(7.5, 7.5, 7.5);
            asset.userData = {
                id: 'doggo',
                idNumb: asset.mesh.id,
                method: {
                    anim: true
                }
            }
        });
        return model;
    },
    // Portals
    'portal-factory': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/factory1.glb', x, y, z, w);

        model.then((asset) => {
            asset.mesh.scale.set(0.5, 0.5, 0.5);

            asset.userData = {
                id: 'portal-factory',
                idNumb: asset.mesh.id,
                roomNumb: 1,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius / 2,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Enter The Factory</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            }
        });
        return model;
    },
    'portal-blue-nail': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/blueNail-sub.glb', x, y, z, w);

        model.then((asset) => {
            asset.userData = {
                id: 'door-blue-nail',
                idNumb: asset.mesh.id,
                roomNumb: 2,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Nails</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            }
        });
        return model;
    },
    'portal-biltong': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/biltong.glb', x, y, z, w);

        model.then((asset) => {
            asset.userData = {
                id: 'portal-biltong',
                idNumb: asset.id,
                roomNumb: 3,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Biltong</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            }
        });
        return model;
    },
    // Scene Assets
    'cell-tower': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/cell-tower/cellTower.glb', x, y, z, w);

        model.then((asset) => {
            asset.userData = {
                id: 'cell-tower',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
    'npc': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/NPC/NPC.glb', x, y, z, w);

        model.then((asset) => {
            asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'npc',
                idNumb: asset.mesh.id,
                caption: `<span class="artist">LMB to talk</span><br>`,
                method: {
                    canTalk: true
                }
            }
        });
        return model;
    },
    // temp
    'foot': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/foot.glb', x, y, z, w);

        model.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'foot',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
    'hand': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/hand.glb', x, y, z, w);

        model.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'hand',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
    'exo-skeleton': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/exo-skeleton.glb', x, y, z, w);

        model.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'exo-skeleton',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
    'blue-nail': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/blueNail-sub.glb', x, y, z, w);

        model.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'blue-nail',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
    'red-nail': (x, y, z, w) => {
        const model = loadModels('../assets/models/gwen/structures/red_nail.glb', x, y, z, w);

        model.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.userData = {
                id: 'red-nail',
                idNumb: asset.mesh.id
            }
        });
        return model;
    },
// Videos // type: 'video'
    // Transparent videos
        // Holograms
        // Videos for cell tower
        // Al-ship
        'al-ship-banner': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/AL-Ship-Banner/banner.webm',
                null,
                'al-ship-banner',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent? / opacity
                null // rotation
            );
            return video;
        },
        'al-ship-ad': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/AL-Ship-Ad/holofied.webm',
                '../assets/videos/Holograms/AL-Ship-Ad/holofied.mp3',
                'al-ship-ad',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // ppt1609
        'ppt1609-spam-ad': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/ppt-Spam/ppt1609SpamAd.webm',
                null,
                'ppt1609-spam-ad',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'ppt1609-qr': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/ppt-QR/ppt1609QR.webm',
                null,
                'ppt1609-qr',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // Tanqueray
        'tanqueray-tod': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/Tanqueray-TOD-Ad/TanquerayTOD.webm',
                '../assets/videos/Holograms/Tanqueray-TOD-Ad/TanquerayTOD.mp3',
                'tanqueray-tod',
                x, y, z, w,
                1280, 720,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'tanqueray-ad': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/Tanqueray-AD/TanquerayAD.webm',
                '../assets/videos/Holograms/Tanqueray-AD/TanquerayAD.mp3',
                'tanqueray-ad',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        //
        'tod-ad': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/TOD-Ad/TOD-AD.webm',
                null,
                'tod-ad',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'chatroom-ad': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holograms/Chatroom-Ad/ChatroomAd.webm',
                null,
                'chatroom-ad',
                x, y, z, w,
                1920, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // Peens
        'peen-bucket': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Peen/Bucket/PeenBucket.webm',
                '../assets/videos/Peen/Bucket/PeenBucket.mp3',
                'peen-bucket',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'peen': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Peen/Peen/Peen.webm',
                '../assets/videos/Peen/Peen/Peen.mp3',
                'peen-bucket',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // Holes
        'bio-nest-1': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/bio-nest-1/bio-nest-1.webm',
                '../assets/videos/Holes/bio-nest-1/bio-nest-1.mp3',
                'bio-nest-1',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'bio-nest-2': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/bio-nest-2/bio-nest-2.webm',
                '../assets/videos/Holes/bio-nest-2/bio-nest-2.mp3',
                'bio-nest-2',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'bio-nest-3': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/bio-nest-3/bio-nest-3.webm',
                '../assets/videos/Holes/bio-nest-3/bio-nest-3.mp3',
                'bio-nest-2',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'bio-nest-4': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/bio-nest-4/bio-nest-4.webm',
                '../assets/videos/Holes/bio-nest-4/bio-nest-4.mp3',
                'bio-nest-2',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'bio-nest-5': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/bio-nest-5/bio-nest-5.webm',
                '../assets/videos/Holes/bio-nest-5/bio-nest-5.mp3',
                'bio-nest-2',
                x, y, z, w,
                720, 576,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // Morphs
        'morph-1': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Morph/morph-1.webm',
                null,
                'morph-1',
                x, y, z, w,
                780, 1079,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'morph-2': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Morph/morph-2.webm',
                null,
                'morph-1',
                x, y, z, w,
                825, 1080,
                true, 1, // transparent?, opacity
                null // rotation
            );
            return video;
        },
    // Opaque videos
        // Papaya
        'papaya-0000': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/papaya-0/Papaya-0000.m4v',
                null,
                'papaya-0000',
                x, y, z, w,
                360, 240,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'papaya-0001': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/papaya-1/Papaya-0001.m4v',
                null,
                'papaya-0000',
                x, y, z, w,
                720, 480,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'papaya-0002': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/Holes/papaya-2/Papaya-0002.m4v',
                null,
                'papaya-0000',
                x, y, z, w,
                720, 480,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        // AL-Ship
        'al-ereaction': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/AL-SHIP/Al-ere(a)ction/Al-Ere(A)Ction.m4v',
                '../assets/videos/AL-SHIP/AL-ere(a)ction/AL-ere(a)ction.mp3',
                'al-ereaction',
                x, y, z, w,
                720, 576,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'al-feet': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/AL-SHIP/AL-Feet/Al-Feet.m4v',
                '../assets/videos/AL-SHIP/AL-Feet/Al-Feet.mp3',
                'al-feet',
                x, y, z, w,
                640, 480,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'al-licking': (x, y, z, w) => {
            const video = loadVideos(
                '/assets/videos/AL-SHIP/AL-Licking/Al-Licking.m4v',
                null,
                'al-licking',
                x, y, z, w,
                1280, 720,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
        'al-touching': (x, y, z, w) => {
            const video = loadVideos(
                '../assets/videos/AL-SHIP/AL-Touching/Al-Touching.m4v',
                null,
                'al-touching',
                x, y, z, w,
                1280, 720,
                false, null, // transparent?, opacity
                null // rotation
            );
            return video;
        },
// Audio objects // type: 'audioObject'
    'instructional-blessings': (x, y, z, w) => {
        const audioObject = loadAudio(
            '../assets/sounds/instructionalBlessings.m4a',
            'instructional-blessings',
            x, y, z
        );
        return audioObject;
    },
    'quite-alright': (x, y, z, w) => {
        const audioObject = loadAudio(
            '../assets/videos/Holograms/QuiteAlright.m4a',
            'quite-alright',
            x, y, z
        );
        return audioObject;
    },
}

/**
 * Loads an image texture
 * @param {string} src The source for the image texture
 * @returns 
 */
const loadTexture = (src) => {
    const texture = textureLoader.load(src);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

export const texture = {
    'waterNormal': loadTexture('/assets/images/waternormals.jpg'),
    'background': loadTexture('../assets/images/gwen/background.png')
}

/**
 * Creates a new colour
 * @param {string} hex The colour you want to create
 * @returns 
 */
const createColour = (hex) => {
    const colour = new THREE.Color(hex).convertSRGBToLinear();
    return colour;
}

export const colour = {
    'pink': createColour(0xf7dff7),
    'green': createColour(0xA0C090)
}

/**
 * Loads a new .glb/.gltf asset
 * @param {string} src The url source of the model
 * @param {number} x The x-coordinate of the model
 * @param {number} y The y-coordinate of the model
 * @param {number} z The z-coordinate of the model
 * @param {number} w The rotation of the model in degrees
 * @returns 
 */
const loadModels = (src, x, y, z, w) => {
    return new Promise((resolve, reject) => {
        glbLoader.load(src, (glb) => {
            const mesh = glb.scene;
            
            const getAnimations = () => {
                if (glb.animations.length === 0) {
                    return null;
                };

                const mixer = new THREE.AnimationMixer(mesh);
                const clips = glb.animations;
                clips.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    animationActions.push(action);
                })

                return {
                    mixer
                }
            }

            mesh.position.set(x, y, z);
            mesh.rotateY(w * Math.PI / 180);
            const getMixer = getAnimations();
            
            resolve({
                mesh, 
                getMixer
            });
        }, undefined, reject);
    });
}

/**
 * Creates a debug mesh to see portals
 * @param {object} asset The asset that the debug mesh will be attached to
 * @returns 
 */
const createPortalMesh = (asset) => {
    const portalMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(asset.mesh.children[0].geometry.boundingSphere.radius / 2, 2),
        new THREE.MeshBasicMaterial({color: colour.green, wireframe: true})
    )
    portalMesh.position.set(asset.mesh.position.x, asset.mesh.position.y, asset.mesh.position.z);
    return portalMesh;
}

/**
 * Loads a new Video asset
 * @param {string} src The url source of the video
 * @param {string} audioSrc The url source of the audio or null
 * @param {string} id The name id of the video
 * @param {number} x The x-coordinate of the video
 * @param {number} y The y-coordinate of the video
 * @param {number} z The z-coordinate of the video
 * @param {number} w The rotation of the video in degrees
 * @param {number} width The width of the video
 * @param {number} height The height of the video
 * @param {boolean} transparent Set the video to have transparency
 * @param {number} opacity If transparent is true, set the opacity
 * @returns 
 */
const videoScreenGeometry = new THREE.PlaneGeometry(1, 1);
const loadVideos = (src, audioSrc, id, x, y, z, w, width, height, transparent, opacity) => {
    const video = document.createElement('video');
    video.src = src;
    video.id = id;
    video.width = width; video.height = height;
    video.style.display = "none";
    video.loop = true; video.playsInline = true;
    video.muted = true; video.preload = "auto";
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    const mesh = new THREE.Mesh(
        videoScreenGeometry,
        new THREE.MeshStandardMaterial({
            map: videoTexture,
            side: THREE.DoubleSide,
            transparent: transparent,
            opacity: opacity
        })
    )

    mesh.scale.set(video.width / 5, video.height / 5);
    mesh.position.set(x, y, z);
    mesh.rotateY(w * Math.PI / 180);
    mesh.renderOrder = 2;

    const loadAudio = () => {
        if (!audioSrc) {
            return;
        }

        const audio = new THREE.PositionalAudio(audioListener);
        audioLoader.load(audioSrc, 
            (buffer) => {
                audio.setBuffer(buffer);
                audio.setLoop(true);
                audio.setRefDistance(1);
                audio.setVolume(1);
                audio.setDirectionalCone(360, 360, 0);
        })

        mesh.add(audio);

        return audio;
    }

    const audio = loadAudio();

    document.getElementById('videos').appendChild(video);

    return {
        video,
        mesh,
        videoTexture,
        audio
    }
}

/**
 * Loads an audioObject with positional audio
 * @param {string} src The source for the audio
 * @param {number} x The x-coordinate of the asset
 * @param {number} y The y-coordinate of the asset
 * @param {number} z The z-coordinate of the asset
 * @returns 
 */
const audioObjectGeo = new THREE.IcosahedronGeometry(5, 2);
const audioObjectMat = new THREE.MeshBasicMaterial({
    color: colour.green,
    wireframe: true,
    visible: true // set to false when not debugging
});
const loadAudio = (src, id, x, y, z) => {
    const audio = new THREE.PositionalAudio(audioListener);
    audioLoader.load(src,
        (buffer) => {
            audio.setBuffer(buffer);
            audio.setLoop(true);
            audio.setRefDistance(1);
            audio.setVolume(1);
            audio.setDirectionalCone(360, 360, 0);
        }    
    )

    const mesh = new THREE.Mesh(
        audioObjectGeo,
        audioObjectMat
    );


    mesh.add(audio);
    mesh.position.set(x, y, z);

    return {
        audio,
        mesh
    }
}

/**
 * Creates a new asset
 * @param {string} assetId The type of the asset to create
 * @param {number} x The x-coordinate of the asset
 * @param {number} y The y-coordinate of the asset
 * @param {number} z The z-coordinate of the asset
 * @param {number} w The rotation of the asset in degrees
 * @returns 
 */
export async function createAssetInstance(assetId, x, y, z, w) {
    if (assetId in assetsFactory) {
        const assetFunction = assetsFactory[assetId];
        const asset = await assetFunction(x, y, z, w);
        return asset;
    } else {
        console.log(`Asset Id ${assetId} is not found.`);
        return undefined;
    }
}