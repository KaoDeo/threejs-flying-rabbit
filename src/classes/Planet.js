import { Group, SphereGeometry, Mesh } from "three";
import {
  shadowSupport,
  createMaterial,
  applyTexture,
  loadTextures,
} from "../utils/helpers.js";

export class Planet {
  constructor(options = {}) {
    this.mesh = new Group();
    this.planet = null;
    this.rotation = { x: 0.001, y: 0.002 };

    this.isOrbiting = options.isOrbiting || false;
    this.orbitAngle = options.orbitAngle || 0;
    this.orbitSpeed = options.orbitSpeed || 0.01;
    this.orbitRadius = options.orbitRadius || 80;
    this.orbitCenter = options.orbitCenter || { x: 0, y: -50, z: -20 };
    this.orbitHeight = options.orbitHeight || 0;

    this.size = options.size || 30;
    this.color = options.color || null;

    this._createPlanet(options.textureName);

    if (this.isOrbiting) {
      this._updateOrbitPosition();
    } else {
      this.mesh.position.set(
        options.position?.x || 0,
        options.position?.y || -50,
        options.position?.z || -20
      );
    }
  }

  update() {
    if (this.planet) {
      this.planet.rotation.x += this.rotation.x;
      this.planet.rotation.y += this.rotation.y;
    }

    if (this.isOrbiting) {
      this.orbitAngle += this.orbitSpeed;
      this._updateOrbitPosition();
    }
  }

  _updateOrbitPosition() {
    const x = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
    const y = this.orbitCenter.y + this.orbitHeight;
    const z = this.orbitCenter.z + Math.sin(this.orbitAngle) * this.orbitRadius;

    this.mesh.position.set(x, y, z);
  }

  _createPlanet(textureName) {
    let planetMaterial;

    const textures = loadTextures(textureName);

    switch (textureName) {
      case "worn-rusted-painted":
        {
          textures.forEach((texture) => applyTexture(texture, 2));
          const [albedo, ao, height, metallic, normal, roughness] = textures;
          planetMaterial = createMaterial(
            albedo,
            ao,
            height,
            0,
            metallic,
            normal,
            roughness,
            false
          );
        }
        break;
      case "peeling-painted-metal":
        {
          textures.forEach((texture) => applyTexture(texture));
          const [albedo, ao, height, metallic, normal, roughness] = textures;
          planetMaterial = createMaterial(
            albedo,
            ao,
            height,
            3,
            metallic,
            normal,
            roughness,
            true
          );
        }
        break;
    }

    const planetGeometry = new SphereGeometry(this.size, 32, 32);

    this.planet = new Mesh(planetGeometry, planetMaterial);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;

    this.mesh.add(this.planet);
    shadowSupport(this.mesh);
  }
}
