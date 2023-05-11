import * as THREE from 'three';

export function throwBoxes(
    world,
    scene,
    camera,
    controls,
    boxes,
    boxMeshes,
    amountOfBoxes
) {
    const boxSize = 2;
    const boxShape = new CANNON.Box(new CANNON.Vec3(boxSize / 2, boxSize / 2, boxSize / 2));
    const boxMaterial = new CANNON.Material();

    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const shootVelocity = 20;
    let canShoot = true;
    const shootDelay = 500;

    const getShootDir = (targetVec) => {
        const vector = targetVec;
        vector.set(0, 0, -1);
        vector.unproject(camera);
        const cameraPosition = camera.position;
        vector.sub(cameraPosition).normalize();
        const randomOffset = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().multiplyScalar(5);
        const boxPosition = cameraPosition.clone().add(vector.multiplyScalar(20)).add(randomOffset);

        return boxPosition;
    }

    if (!canShoot || !controls.isLocked) return;

    canShoot = false;
    const shootDirection = new THREE.Vector3();
    getShootDir(shootDirection);

    for (let i = 0; i < amountOfBoxes; i++) {
        const boxBody = new CANNON.Body({
            mass: 5, 
            shape: boxShape, 
            material: boxMaterial
        });
        const boxMesh = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshBasicMaterial({color: new THREE.Color()})
        );
        world.addBody(boxBody);
        scene.add(boxMesh);
        const spreadFactor = Math.random() * 3;
        const randomSpread = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).multiplyScalar(spreadFactor);
        shootDirection.add(randomSpread).normalize().multiplyScalar(shootVelocity);
        boxBody.velocity.copy(shootDirection);
        const positionOffset = shootDirection.clone().normalize().multiplyScalar(boxShape.boundingSphereRadius * 1.02 + boxSize + i * 2);
        const boxPosition = getShootDir(shootDirection).add(positionOffset);
        boxBody.position.copy(boxPosition);
        boxMesh.position.copy(boxPosition);
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);

        if (boxes.length > 21) {
            world.removeBody(...boxes.splice(0, 1));
            scene.remove(...boxMeshes.splice(0, 1));
        }
    }

    setTimeout(() => {
        canShoot = true;
    }, shootDelay);
}