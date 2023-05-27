import * as THREE from 'three';

export const shootAssets = (
    world,
    scene,
    camera,
    controls,
    assetBodies,
    assetMeshes,
    asset,
    assetsToThrow,
    amountOfBoxes
) => {

    const shootVelocity = 20;
    let canShoot = true;

    const pickAssetsToThrow = (array, numItems) => {
        if (numItems >= array.length) {
            return array;
        } else {
            let shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledAssets.slice(0, numItems);
        }
    }

    let amountToShoot = pickAssetsToThrow(assetsToThrow, amountOfBoxes);

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
        const assetPosition = cameraPosition.clone().add(vector.multiplyScalar(20)).add(randomOffset);

        return assetPosition;
    }

    if (!canShoot || !controls.isLocked) {
        return;
    }
    canShoot = false;
    const shootDirection = new THREE.Vector3();
    getShootDir(shootDirection);

    for (let i = 0; i < amountToShoot.length; i++) {
        const asset = amountToShoot[i];
        let geometryRadius = Math.ceil(asset.userData.portalRadius) * 2;
        const assetBody = new CANNON.Body({
            mass: 5, 
            shape: new CANNON.Box(new CANNON.Vec3(geometryRadius, geometryRadius * 2, geometryRadius)),
            material: new CANNON.Material()
        });
        world.addBody(assetBody);
        asset.scale.set(0.1, 0.1, 0.1);
        scene.add(asset);
        const spreadFactor = Math.random() * 3;
        const randomSpread = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).multiplyScalar(spreadFactor);
        shootDirection.add(randomSpread).normalize().multiplyScalar(shootVelocity);
        assetBody.velocity.copy(shootDirection);
        const positionOffset = shootDirection.clone().normalize().multiplyScalar(assetBody.shapes[0].boundingSphereRadius * 1.02 + geometryRadius + i * 2);
        const assetPosition = getShootDir(shootDirection).add(positionOffset);
        assetBody.position.copy(assetPosition);
        amountToShoot[i].position.copy(assetPosition);

        assetBodies.push(assetBody);
        assetMeshes.push(asset);

        if (boxes.length > 20) {
            world.removeBody(...assetBodies.splice(0, 1));
            scene.remove(...assetMeshes.splice(0, 1));
        }
    }

    setTimeout(() => {
        canShoot = true;
    }, 1000) // shoot delay
}