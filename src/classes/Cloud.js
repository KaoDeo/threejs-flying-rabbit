import {
  Group,
  TextureLoader,
  RepeatWrapping,
  MeshStandardMaterial,
  SphereGeometry,
  Mesh,
} from "three";
import { shadowSupport, randomIntFromInterval } from "../utils/helpers.js";

export class Cloud {
  constructor(config) {
    this.mesh = new Group();
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
    let textureLoader = new TextureLoader();

    const albedoTexture = textureLoader.load(
      "../assets/wrinkled-paper-albedo.png"
    );

    const aoTexture = textureLoader.load("../assets/wrinkled-paper-ao.png");

    const heightTexture = textureLoader.load(
      "../assets/wrinkled-paper-height.png"
    );

    const metallicTexture = textureLoader.load(
      "../assets/wrinkled-paper-metallic.png"
    );

    const normalTexture = textureLoader.load(
      "../assets/wrinkled-paper-normal-ogl.png"
    );

    const roughnessTexture = textureLoader.load(
      "../assets/wrinkled-paper-roughness.png"
    );

    [
      albedoTexture,
      aoTexture,
      heightTexture,
      metallicTexture,
      normalTexture,
      roughnessTexture,
    ].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(2, 2);
    });

    const cloudMaterial = new MeshStandardMaterial({
      map: albedoTexture,
      aoMap: aoTexture,
      displacementMap: heightTexture,
      displacementScale: 0,
      metalnessMap: metallicTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      flatShading: false,
    });

    const group = new Group();

    const cloudGeo = new SphereGeometry(5, 4, 6);
    const cloud = new Mesh(cloudGeo, cloudMaterial);
    cloud.scale.set(1, 0.8, 1);

    const cloud2 = cloud.clone();
    cloud2.scale.set(0.55, 0.35, 1);
    cloud2.position.set(5, -1.5, 2);

    const cloud3 = cloud.clone();
    cloud3.scale.set(0.75, 0.5, 1);
    cloud3.position.set(-5.5, -2, -1);

    const cloud4 = cloud.clone();
    cloud4.scale.set(0.75, 0.5, 1);
    cloud4.position.set(5, -1.5, 2);

    group.add(cloud);
    group.add(cloud2);
    group.add(cloud3);
    group.add(cloud4);
    shadowSupport(group);

    return group;
  }
}
