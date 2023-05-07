import {assets} from '../js/_config.min.js'
import {roomNumb} from '../js/gwen.min.js';

export const world = new CANNON.World();
export const cannonBodies = [];
export let cannonReady = false;

export function cannonInit() {

    world.gravity.set(0, -9.82, 0);

    const currentRoom = assets[roomNumb];

    for (let i = 0; i < currentRoom.length; i++) {

        const obj = currentRoom[i];

        if (obj.cannonObject) {
            const physicsMaterial = new CANNON.Material(obj.id);
            const cannonBody = new CANNON.Body({
                mass: obj.mass,
                shape: obj.shape,
                material: physicsMaterial,
                position: obj.position
            })
            if (obj.id === "plane") {
                cannonBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
            } 
    
            world.addBody(cannonBody);
            cannonBodies.push(cannonBody);
        }
    }

    cannonReady = true;
}