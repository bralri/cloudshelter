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
//
* @param {boolean} anim if true, filter for models with animations
* @param {boolean} canTalk if true, filter for NPC model to talk or respond to user
*/

const database = {
// Models
    // Animated
    'doggo': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/doggo2.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.scale.set(7.5, 7.5, 7.5);
            asset.mesh.userData = {
                id: 'doggo',
                idNumb: asset.mesh.id,
            };
        });
        return asset;
    },
    // Portals
    'portal-factory': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/factory1.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'portal-factory',
                idNumb: asset.mesh.id,
                roomNum: 1,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius / 2,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Enter The Factory</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            };
        });

        return asset;
    },
    'portal-blue-nail': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/blueNail-sub.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.userData = {
                id: 'door-blue-nail',
                idNumb: asset.mesh.id,
                roomNum: 2,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Nails</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            };
        });
        return asset;
    },
    'portal-biltong': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/biltong.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.userData = {
                id: 'portal-biltong',
                idNumb: asset.id,
                roomNum: 3,
                portalRadius: asset.mesh.children[0].geometry.boundingSphere.radius,
                portalPosition: asset.mesh.position,
                caption: `<span class="artist">Biltong</span><br>`,
                debugPortalMesh: createPortalMesh(asset)
            };
        });
        return asset;
    },
    // General
    'cell-tower': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/cell-tower/cellTower.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.userData = {
                id: 'cell-tower',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
    'npc': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/NPC/NPC.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'npc',
                idNumb: asset.mesh.id,
                caption: `<span class="artist">LMB to pick up & throw</span><br>`,
                hasBeenThrown: false,
                amountOfBoxes: 5,
                method: {
                    pickUp: true
                }
            };
        });
        return asset;
    },
    // temp
    'foot': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/foot.glb', x, y, z, w);

        asset.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'foot',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
    'hand': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/hand.glb', x, y, z, w);

        asset.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'hand',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
    'exo-skeleton': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/exo-skeleton.glb', x, y, z, w);

        asset.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'exo-skeleton',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
    'blue-nail': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/blueNail-sub.glb', x, y, z, w);

        asset.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'blue-nail',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
    'red-nail': (x, y, z, w) => {
        const asset = loadModels('../assets/models/gwen/structures/red_nail.glb', x, y, z, w);

        asset.then((asset) => {
            // asset.mesh.scale.set(0.5, 0.5, 0.5);
            asset.mesh.userData = {
                id: 'red-nail',
                idNumb: asset.mesh.id
            };
        });
        return asset;
    },
// Videos
    'al-ship-banner': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/al-ship-banner/720x270.webm', // options: 480x180, 720x270
            null,
            'al-ship-banner',
            x, y, z, w,
            720, 270,
            true, 1 // transparent? / opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'al-ship-ad': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/al-ship-ad/578x480.webm', // options: 578x480, 876x720, 1300x1080
            '../assets/videos/al-ship-ad/audio.mp3',
            'al-ship-ad',
            x, y, z, w,
            578 * 1.5, 480 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'al-ereaction': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/al-ereaction/720x480.m4v', // options: 720x480, 720x576
            '../assets/videos/al-ereaction/audio.mp3',
            'al-ereaction',
            x, y, z, w,
            720, 480,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'al-feet': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/al-feet/320x240.m4v', // options: 320x240, 640x480
            '../assets/videos/al-feet/audio.mp3',
            'al-feet',
            x, y, z, w,
            320, 240,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'al-licking': (x, y, z, w) => {
        const asset = loadVideos(
            '/assets/videos/al-licking/720x480.m4v',
            null,
            'al-licking',
            x, y, z, w,
            720, 480,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'al-touching': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/al-touching/480x270.m4v', // options: 480x270, 720x480, 1280x720
            null,
            'al-touching',
            x, y, z, w,
            480, 270,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'ppt1609-spam': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/ppt1609-spam/284x480.webm', // options: 284x480, 427x720, 640x1080
            null,
            'ppt1609-spam',
            x, y, z, w,
            284 * 1.5, 480 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'ppt1609-qr': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/ppt1609-qr/289x480.webm', // options: 289x480, 433x720
            null,
            'ppt1609-qr',
            x, y, z, w,
            289 * 1.5, 480 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'ppt1609-poster': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/ppt1609-poster/480x480.webm', // options: 480, 720, 1080
            '../assets/videos/ppt1609-poster/audio.mp3',
            'ppt1609-qr',
            x, y, z, w,
            480 * 1.5, 480 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'tanqueray-tod': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/tanqueray-tod/213x180.webm', // options: 213x180, 284x240, 427x360, 569x480, 853x720
            '../assets/videos/tanqueray-tod/audio.mp3',
            'tanqueray-tod',
            x, y, z, w,
            427 * 1.5, 360 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'tanqueray-ad': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/tanqueray-ad/213x180.webm', // options: 213x180, 427x360, 569x480, 853x720, 1280x1080
            '../assets/videos/tanqueray-ad/audio.mp3',
            'tanqueray-ad',
            x, y, z, w,
            427 * 1.5, 360 * 1.5,
            true, 1 // transparent?, opacity
        );
        
        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'tod-ad': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/tod-ad/360x360.webm', // options: 360, 480, 720, 1080
            null,
            'tod-ad',
            x, y, z, w,
            480 * 1.5, 480 * 1.5,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'chatroom-ad': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/chatroom-ad/480x480.webm', // options: 480, 720, 1080
            null,
            'chatroom-ad',
            x, y, z, w,
            480, 480,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'peen-bucket': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/peen/bucket/200x240.webm', // options: 200x240, 720x576
            '../assets/videos/peen/bucket/audio.mp3',
            'peen-bucket',
            x, y, z, w,
            200, 240,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'peen': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/peen/300x288.webm', // options: 300x288, 720x576
            '../assets/videos/peen/audio.mp3',
            'peen-bucket',
            x, y, z, w,
            300, 288,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'bio-nest-1': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/bio-nest/1/240x240.webm', // options: 240, 480
            '../assets/videos/bio-next/1/audio.mp3',
            'bio-nest-1',
            x, y, z, w,
            240, 240,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'bio-nest-2': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/bio-nest/2/288x288.webm', // options: 288, 576
            '../assets/videos/bio-nest/2/audio.mp3',
            'bio-nest-2',
            x, y, z, w,
            288, 288,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'bio-nest-3': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/bio-nest/3/240x240.webm', // options: 240, 480
            '../assets/videos/bio-nest/3/audio.mp3',
            'bio-nest-2',
            x, y, z, w,
            720, 576,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'bio-nest-4': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/bio-nest/4/240x240.webm', // options: 240, 480
            '../assets/videos/bio-nest/4/audio.mp3',
            'bio-nest-2',
            x, y, z, w,
            240, 240,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'bio-nest-5': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/bio-nest/5/240x240.webm', // options: 240, 360, 480
            '../assets/videos/bio-nest/5/audio.mp3',
            'bio-nest-2',
            x, y, z, w,
            240, 240,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'papaya-0000': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/papaya/0000/240x208.m4v', // options: 240x208, 360x314
            null,
            'papaya-0000',
            x, y, z, w,
            360, 240,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'papaya-0001': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/papaya/0001/240x208.m4v', // options: 240x208, 360x314, 480x418
            null,
            'papaya-0001',
            x, y, z, w,
            240, 208,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'papaya-0002': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/papaya/0002/240x208.m4v', // options: 240x208, 360x314, 480x418
            null,
            'papaya-0002',
            x, y, z, w,
            240, 208,
            false, null // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'morph-1': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/morph/1/780x1080.webm',
            null,
            'morph-1',
            x, y, z, w,
            780, 1080,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'morph-2': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/morph/2/825x1080.webm',
            null,
            'morph-2',
            x, y, z, w,
            825, 1080,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'morph-3': (x, y, z, w) => {
        const asset = loadVideos(
            '../assets/videos/morph/3/478x618.webm',
            null,
            'morph-3',
            x, y, z, w,
            478, 618,
            true, 1 // transparent?, opacity
        );

        asset.mesh.userData = {
            id: asset.video.id,
            idNumb: asset.mesh.id
        };

        return asset;
    },
// Audio objects
    'instructional-blessings': (x, y, z, w) => {
        const asset = createAudioObject(
            '../assets/sounds/instructionalBlessings.m4a',
            'instructional-blessings',
            x, y, z
        );

        asset.mesh.userData = {
            id: 'instructional-blessings',
            idNumb: asset.mesh.id
        };

        return asset;
    },
    'quite-alright': (x, y, z, w) => {
        const asset = createAudioObject(
            '../assets/videos/Holograms/QuiteAlright.m4a',
            'quite-alright',
            x, y, z
        );

        asset.mesh.userData = {
            id: 'quite-alright',
            idNumb: asset.mesh.id
        };

        return asset;
    },
// Objects that get thrown
    'test-throw-obj': (x, y, z, w) => {
        const asset = createThrowAsset('../assets/models/gwen/NPC/NPC.glb', x, y, z, w);

        asset.then((asset) => {
            asset.mesh.userData = {
                id: 'test-throw-obj',
                idNumb: asset.mesh.id
            };
        });

        return asset;
    }
}

const loadTexture = (src) => {
    const texture = textureLoader.load(src);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

export const texture = {
    'waterNormal': loadTexture('/assets/images/waternormals.jpg'),
    'background': loadTexture('../assets/images/gwen/background.png')
}

const createColour = (hex) => {
    const colour = new THREE.Color(hex).convertSRGBToLinear();
    return colour;
}

export const colour = {
    'pink': createColour(0xf7dff7),
    'green': createColour(0xA0C090)
}

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

const createThrowAsset = (src, x, y, z, w) => {
    return new Promise((resolve, reject) => {
        glbLoader.load(src, (glb) => {
            const mesh = glb.scene;
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.position.set(x, y, z);

            const createCannonBody = () => {
                let radius = 2;
                const body = new CANNON.Body({
                    mass: 1, 
                    shape: new CANNON.Box(new CANNON.Vec3(radius, radius * 2, radius)),
                    material: new CANNON.Material()
                });

                return body;
            }

            const body = createCannonBody();
            
            resolve({
                mesh,
                body
            });
        }, undefined, reject);
    });
}

const createPortalMesh = (asset) => {
    const portalMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(asset.mesh.children[0].geometry.boundingSphere.radius / 2, 2),
        new THREE.MeshBasicMaterial({color: colour.green, wireframe: true})
    )
    portalMesh.position.set(asset.mesh.position.x, asset.mesh.position.y, asset.mesh.position.z);
    return portalMesh;
}

// add volume adjustment
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
    };
}

const audioObjectGeo = new THREE.IcosahedronGeometry(5, 2);
const audioObjectMat = new THREE.MeshBasicMaterial({
    color: colour.green,
    wireframe: true,
    visible: true // set to false when not debugging
});
const createAudioObject = (src, id, x, y, z) => {
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
    };
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
export const createAssetInstance = async (id, x, y, z, w) => {
    if (id in database) {
        const assetFunction = database[id];
        const asset = await assetFunction(x, y, z, w);
        return asset;
    } else {
        console.log(`Asset Id ${id} is not found.`);
        return undefined;
    }
}