import * as THREE from "three";
import { MATERIALS } from "../constants/materials.js";
import { shadowSupport, randomIntFromInterval } from "../utils/helpers.js";

export class Cloud {
  constructor(config) {
    this.mesh = new THREE.Group();
    this.speed = 0.8;
    this.delay = (config.delay || 0) * 60;
    this.delayCounter = 0;

    const cloud = this._createCloud();

    this.mesh.position.x = 200;
    this.mesh.position.y = config.y || Math.random();
    this.mesh.position.z = config.z || 0;

    this.mesh.add(cloud);
  }

  update() {
    if (this.delayCounter < this.delay) {
      this.delayCounter++;
      return;
    }

    this.mesh.position.x -= this.speed;

    if (this.mesh.position.x < -200) {
      this.mesh.position.x = 200;
      this.mesh.position.y = randomIntFromInterval(-10, 20);
    }
  }

  _createCloud() {
    const group = new THREE.Group();

    const cloudGeo = new THREE.SphereGeometry(5, 4, 6);
    const cloud = new THREE.Mesh(cloudGeo, MATERIALS.clouds);
    cloud.scale.set(1, 0.8, 1);

    const cloud2 = cloud.clone();
    cloud2.scale.set(0.55, 0.35, 1);
    cloud2.position.set(5, -1.5, 2);

    const cloud3 = cloud.clone();
    cloud3.scale.set(0.75, 0.5, 1);
    cloud3.position.set(-5.5, -2, -1);

    group.add(cloud);
    group.add(cloud2);
    group.add(cloud3);

    shadowSupport(group);

    return group;
  }
}
