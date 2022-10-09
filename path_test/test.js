const video_ = [
    {
        ID: videoID,
        SOUND: soundURL
    }
];

const videoID = [
    "Picnic",
    "Elf",
];

const soundURL = [
    "../sound/voidshow/Alex/Picnic.mp3",
    "../sound/voidshow/Alex/Elf.mp3"
];

for (let i = 0; i < 2; i++) {
    
    //VIDEO
    let video = document.getElementById(video.ID[i]);
    let texture = new THREE.VideoTexture(video);
    texture.encoding = THREE.sRGBEncoding;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    let geometry = new THREE.PlaneBufferGeometry(10, 20);
    geometry.rotateY(Math.PI / 2);
    let material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    let screen = new THREE.Mesh(geometry, material);
    screen.receiveShadow = false;
    screen.castShadow = false;
    scene.add(screen);

    //SOUND
    let sound = new THREE.PositionalAudio(audioListener);
    const audioLoader = new THREE.AudioLoader(manager);
    audioLoader.load(video.SOUND[i], function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setRefDistance(10);
        sound.setVolume(0.5);
        sound.setDirectionalCone(360, 360, 0.1);
    })
    picnicPlaneScreen.add(sound);

}