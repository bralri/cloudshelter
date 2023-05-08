import * as THREE from 'three';

export function setupThrowBoxes(world, scene, camera, controls, groundPhysicsMaterial, boxes, boxMeshes, moveForward, moveBackward, moveLeft, moveRight) {
    let canShoot = true;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const shootDelay = 500;
    const mass = 5, size = new CANNON.Vec3(1, 1, 1);
    const boxMaterial = new CANNON.Material("highFriction");
    const boxShape = new CANNON.Box(size);
    const boxBody = new CANNON.Body({mass: mass, shape: boxShape, material: boxMaterial});
    boxBody.addShape(boxShape);
    boxBody.linearDamping = 0.31;
    world.addBody(boxBody);
    const boxContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, boxMaterial, {friction: 1});
    world.addContactMaterial(boxContactMaterial);
    const boxGeometry = new THREE.BoxGeometry(size.x * 2, size.y * 2, size.z * 2);
    const shootDirection = new THREE.Vector3();
    const shootVelocity = 20;
    function getShootDir(targetVec) {
        const vector = targetVec;
        targetVec.set(0, 0, -1);
        vector.unproject(camera);
        camera.getWorldDirection(targetVec);
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        targetVec.add(controls.getDirection(direction).multiplyScalar(0.5)).add(controls.getObject().getWorldDirection(velocity).multiplyScalar(0.5)).add(direction.multiplyScalar(0.5));
      
        // Calculate initial position of the box based on the position of the camera
        const cameraPosition = new THREE.Vector3();
        camera.getWorldPosition(cameraPosition);
        const randomOffset = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(5);
        const boxPosition = cameraPosition.add(targetVec.normalize().multiplyScalar(20)).add(randomOffset);
      
        return boxPosition;
      }      
    window.addEventListener("click", () => {
        if (!canShoot || !controls.isLocked) {
          return;
        }
        canShoot = false;
        const x = controls.getObject().position.x;
        const y = controls.getObject().position.y;
        const z = controls.getObject().position.z;
        const spreadFactor = Math.random() * 3;
        for (let i = 0; i < 4; i++) {
            const boxBody = new CANNON.Body({ mass: 1 / 12 * 12 });
            boxBody.addShape(boxShape);
            const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) }));
            world.addBody(boxBody);
            scene.add(boxMesh);
            getShootDir(shootDirection);
            shootDirection.x += (Math.random() - 0.5) * spreadFactor;
            shootDirection.y += (Math.random() - 0.5) * spreadFactor;
            shootDirection.z += (Math.random() - 0.5) * spreadFactor;
            shootDirection.normalize();
            boxBody.velocity.set(shootDirection.x * shootVelocity, shootDirection.y * shootVelocity, shootDirection.z * shootVelocity);
            const sphereRadius = boxShape.boundingSphereRadius;
            const positionOffset = shootDirection.clone().multiplyScalar(sphereRadius * 1.02 + size.x + i * 2);
            const boxPosition = getShootDir(shootDirection).add(positionOffset);
            boxBody.position.set(boxPosition.x, boxPosition.y, boxPosition.z);
            boxMesh.position.set(boxPosition.x, boxPosition.y, boxPosition.z);
            boxes.push(boxBody);
            boxMeshes.push(boxMesh);
            if (boxes.length > 28) {
                world.removeBody(boxes.shift());
                scene.remove(boxMeshes.shift());
            }
        }        
        setTimeout(() => {
          canShoot = true;
        }, shootDelay);
    });      
}