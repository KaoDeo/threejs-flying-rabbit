import * as THREE from "three";
import { MATERIALS } from "../constants/materials.js";
import { shadowSupport } from "../utils/helpers.js";
import { Pilot } from "./Pilot.js";

export class Carrot {
  constructor() {
    this.mesh = new THREE.Group();
    this.time = 0;

    this.body = this._createBody();
    this.wings = this._createWings();
    this.leafs = this._createLeafs();
    this.pilot = new Pilot();

    this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

    this.mesh.add(this.body);
    this.mesh.add(this.wings);
    this.mesh.add(this.leafs);
    this.mesh.add(this.pilot.mesh);
  }

  update() {
    this.time += 0.016;

    this.mesh.position.x = -2 + Math.sin(this.time * 0.5) * 1;
    this.mesh.position.y = 4 + Math.sin(this.time * 0.3) * 2;
    this.mesh.position.z = Math.sin(this.time * 0.4) * 3;

    this.mesh.rotation.x = -1.7 + Math.sin(this.time) * 0.1;

    this.leafs.rotation.y = this.time * 10;
  }

  _createBody() {
    const group = new THREE.Group();

    const bodyGeom = new THREE.CylinderGeometry(5, 2, 25, 12, 4);
    const positionAttribute = bodyGeom.attributes.position;
    positionAttribute.setY(16, positionAttribute.getY(16) + 3);
    positionAttribute.setY(17, positionAttribute.getY(17) - 2);

    group.add(new THREE.Mesh(bodyGeom, MATERIALS.orange));
    shadowSupport(group);

    return group;
  }

  _createWings() {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(7, 7, 0.5);
    const positionAttribute = geometry.attributes.position;
    positionAttribute.setY(2, positionAttribute.getY(2) + 2);
    positionAttribute.setY(3, positionAttribute.getY(3) + 2);
    positionAttribute.setX(2, positionAttribute.getX(2) - 1);
    positionAttribute.setX(3, positionAttribute.getX(3) - 1);

    const wingR = new THREE.Mesh(geometry, MATERIALS.brown);
    wingR.position.x = 6;
    wingR.position.y = 2;
    wingR.position.z = 1;

    const wingL = wingR.clone();
    wingL.position.x = -6;
    wingL.rotation.y = Math.PI;

    group.add(wingR);
    group.add(wingL);

    shadowSupport(group);

    return group;
  }

  _createLeafs() {
    const group = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(1.5, 1, 5, 4);

    const positionAttribute = geometry.attributes.position;
    positionAttribute.setY(8, positionAttribute.getY(8) + 0.5);

    const leafA = new THREE.Mesh(geometry, MATERIALS.green);
    leafA.position.y = 16;

    const leafB = leafA.clone();
    leafB.position.x = -1.75;
    leafB.position.y = 15;
    leafB.rotation.z = 0.4;

    const leafC = leafB.clone();
    leafC.position.x = leafB.position.x * -1;
    leafC.rotation.z = leafB.rotation.z * -1;

    group.add(leafA);
    group.add(leafB);
    group.add(leafC);

    shadowSupport(group);

    return group;
  }
}
