import * as THREE from "three";
import { MATERIALS } from "../constants/materials.js";
import { shadowSupport } from "../utils/helpers.js";

export class Pilot {
  constructor() {
    this.mesh = new THREE.Group();
    this.pilot = this._createPilot();
    this.isBlinking = false;
    this.blinkTime = 0;
    this.earTime = 0;

    this.mesh.rotation.x = 1.5;
    this.mesh.position.set(0, 7, 5);
    this.mesh.add(this.pilot);
  }

  update() {
    this.earTime += 0.1;

    // Ear animations
    this.earPivotL.rotation.x = -Math.PI / 2.25 + Math.sin(this.earTime) * 0.1;
    this.earPivotR.rotation.x = -Math.PI / 3 + Math.sin(this.earTime + 1) * 0.1;
  }

  startEyeBlinking() {
    this.isBlinking = true;
    this.blinkTime = 0;
  }

  stopEyeBlinking() {
    this.isBlinking = false;
    this.eye.scale.y = 1;
    this.eyeb.scale.y = 1;
  }

  updateBlinking() {
    if (!this.isBlinking) return;

    this.blinkTime += 0.02;
    const eyeScale = (Math.sin(this.blinkTime) + 1) * 0.4 + 0.2; // Smooth 0.2 to 1.0
    this.eye.scale.y = eyeScale;
    this.eyeb.scale.y = eyeScale;
  }

  _createPilot() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(5, 5, 5);
    const positionAttributeBody = bodyGeo.attributes.position;
    positionAttributeBody.setY(3, positionAttributeBody.getY(3) + 0.5);
    positionAttributeBody.setY(6, positionAttributeBody.getY(6) + 0.5);

    const body = new THREE.Mesh(bodyGeo, MATERIALS.rabbit);
    body.position.y = 1;
    body.position.z = 4;

    const seatGeo = new THREE.BoxGeometry(6, 1, 6);
    const seat = new THREE.Mesh(seatGeo, MATERIALS.brown);
    seat.position.set(0, -2.5, 0);
    seat.rotation.set(0.25, 0, 0);
    body.add(seat);

    this.earPivotL = new THREE.Object3D();
    this.earPivotL.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 2.5, 0));
    this.earPivotL.rotation.x = -Math.PI / 2.25;

    this.earPivotR = this.earPivotL.clone();
    this.earPivotR.rotation.x = -Math.PI / 3;

    const earGeo = new THREE.BoxGeometry(2, 6, 0.5);
    const positionAttributeEar = earGeo.attributes.position;
    positionAttributeEar.setX(2, positionAttributeEar.getX(2) - 0.5);
    positionAttributeEar.setX(3, positionAttributeEar.getX(3) - 0.5);
    positionAttributeEar.setX(6, positionAttributeEar.getX(6) + 0.5);
    positionAttributeEar.setX(7, positionAttributeEar.getX(7) + 0.5);

    const ear = new THREE.Mesh(earGeo, MATERIALS.rabbit);
    ear.position.x = -1.5;
    ear.position.y = 2.5;

    const earInside = new THREE.Mesh(earGeo, MATERIALS.pink);
    earInside.scale.set(0.5, 0.7, 0.5);
    earInside.position.set(0, 0, 0.25);
    ear.add(earInside);

    this.earPivotL.add(ear);
    body.add(this.earPivotL);

    const ear2 = ear.clone();
    ear2.position.x = ear.position.x * -1;
    this.earPivotR.add(ear2);
    body.add(this.earPivotR);

    const eyeGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const eye = new THREE.Mesh(eyeGeo, MATERIALS.gray);
    eye.position.set(1, 0.5, 2.5);
    body.add(eye);
    this.eye = eye;

    const eyeb = eye.clone();
    eyeb.position.x = eye.position.x * -1;
    this.eyeb = eyeb;
    body.add(eyeb);

    const noseGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const positionAttributeNose = noseGeo.attributes.position;
    positionAttributeNose.setX(2, 0);
    positionAttributeNose.setX(3, 0);
    positionAttributeNose.setX(6, 0);
    positionAttributeNose.setX(7, 0);
    const nose = new THREE.Mesh(noseGeo, MATERIALS.pink);
    nose.position.set(0, -0.5, 2.5);
    body.add(nose);

    const mouthGeo = new THREE.BoxGeometry(0.25, 0.25, 0.5);
    const mouth = new THREE.Mesh(mouthGeo, MATERIALS.gray);
    mouth.position.set(0, -1.5, 2.5);
    body.add(mouth);

    group.add(body);
    shadowSupport(group);

    return group;
  }
}
