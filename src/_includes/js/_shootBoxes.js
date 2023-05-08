import * as THREE from 'three';

export function setupThrowBoxes(
    world,
    scene,
    camera,
    controls,
    groundPhysicsMaterial,
    boxes,
    boxMeshes,
    moveForward,
    moveBackward,
    moveLeft,
    moveRight
  ) {

    let canShoot = true;

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const shootDelay = 500;
    const mass = 5, size = new CANNON.Vec3(2.5, 2.5, 2.5);

    const boxMaterial = new CANNON.Material("highFriction");
    const boxShape = new CANNON.Box(size);
    const boxBody = new CANNON.Body({
      mass: mass,
      shape: boxShape,
      material: boxMaterial,
    });
    boxBody.addShape(boxShape);
    boxBody.linearDamping = 0.31;
    world.addBody(boxBody);
  
    const boxContactMaterial = new CANNON.ContactMaterial(
      groundPhysicsMaterial,
      boxMaterial,
      { friction: 1 }
    );
    world.addContactMaterial(boxContactMaterial);
  
    const boxGeometry = new THREE.BoxGeometry(size.x * 2, size.y * 2, size.z * 2);
    const shootDirection = new THREE.Vector3();
    const shootVelocity = 20;
    const offsetX = 12;
  
    function getShootDir(targetVec) {
        const vector = targetVec;
        targetVec.set(0, 0, -1);
        vector.unproject(camera);
        camera.getWorldDirection(targetVec);
        
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        
        targetVec.add(controls.getDirection(direction).multiplyScalar(0.5)).add(controls.getObject().getWorldDirection(velocity).multiplyScalar(0.5)).add(direction.multiplyScalar(0.5));
    }
      
    window.addEventListener("click", () => {

        if (!canShoot || !controls.isLocked) {
            return;
        }

        canShoot = false;

        const x = controls.getObject().position.x;
        const y = controls.getObject().position.y;
        const z = controls.getObject().position.z;

        const offsetVec = controls.getDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(offsetX);

        const boxBody = new CANNON.Body({mass: 1 / 12*12});
        boxBody.addShape(boxShape);

        const boxMesh = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                wireframe: true
            })
        );

        world.addBody(boxBody);
        scene.add(boxMesh);

        getShootDir(shootDirection);
        boxBody.velocity.set(
            shootDirection.x * shootVelocity,
            shootDirection.y * shootVelocity,
            shootDirection.z * shootVelocity
        );

        const sphereRadius = boxShape.boundingSphereRadius;
        const positionOffset = shootDirection.clone().multiplyScalar(sphereRadius * 1.02 + size.x).add(offsetVec);

        boxBody.position.set(x + positionOffset.x, y + positionOffset.y, z + positionOffset.z);
        boxMesh.position.set(x + positionOffset.x, y + positionOffset.y, z + positionOffset.z);

        boxes.push(boxBody);
        boxMeshes.push(boxMesh);

        if (boxes.length > 20) {
            world.removeBody(boxes.shift());
            scene.remove(boxMeshes.shift());
        }

        setTimeout(() => {
            canShoot = true;
        }, shootDelay);
    });
  }