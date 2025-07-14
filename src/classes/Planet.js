import * as THREE from "three";
import { shadowSupport } from "../utils/helpers.js";

export class Planet {
  constructor(options = {}) {
    this.mesh = new THREE.Group();
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

    const textures = this._loadTextures(textureName);

    switch (textureName) {
      case "worn-rusted-painted":
        {
          textures.forEach((texture) => this._applyTexture(texture, 2));
          const [albedo, ao, height, metallic, normal, roughness] = textures;
          planetMaterial = this._createMaterial(
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
          textures.forEach((texture) => this._applyTexture(texture));
          const [albedo, ao, height, metallic, normal, roughness] = textures;
          planetMaterial = this._createMaterial(
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

    const planetGeometry = new THREE.SphereGeometry(this.size, 32, 32);

    this.planet = new THREE.Mesh(planetGeometry, planetMaterial);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;

    this.mesh.add(this.planet);
    shadowSupport(this.mesh);
  }

  _applyTexture(texture, repeat = 1) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
  }

  _createMaterial(
    albedoTexture,
    aoTexture,
    heightTexture,
    displacementScale,
    metallicTexture,
    normalTexture,
    roughnessTexture,
    flatShading = true
  ) {
    return new THREE.MeshStandardMaterial({
      map: albedoTexture,
      aoMap: aoTexture,
      displacementMap: heightTexture,
      displacementScale: displacementScale,
      metalnessMap: metallicTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      flatShading: flatShading,
    });
  }

  _loadTextures(textureName) {
    const textureLoader = new THREE.TextureLoader();

    switch (textureName) {
      case "worn-rusted-painted":
        const albedoTexture = textureLoader.load(
          "../assets/worn-rusted-painted_albedo.png"
        );
        const aoTexture = textureLoader.load(
          "../assets/worn-rusted-painted_ao.png"
        );
        const heightTexture = textureLoader.load(
          "../assets/worn-rusted-painted_height.png"
        );
        const metallicTexture = textureLoader.load(
          "../assets/worn-rusted-painted_metallic.png"
        );
        const normalTexture = textureLoader.load(
          "../assets/worn-rusted-painted_normal-ogl.png"
        );
        const roughnessTexture = textureLoader.load(
          "../assets/worn-rusted-painted_roughness.png"
        );

        return [
          albedoTexture,
          aoTexture,
          heightTexture,
          metallicTexture,
          normalTexture,
          roughnessTexture,
        ];

      case "peeling-painted-metal": {
        const albedoTexture = textureLoader.load(
          "../assets/peeling-painted-metal_albedo.png"
        );
        const aoTexture = textureLoader.load(
          "../assets/peeling-painted-metal_ao.png"
        );
        const heightTexture = textureLoader.load(
          "../assets/peeling-painted-metal_height.png"
        );
        const metallicTexture = textureLoader.load(
          "../assets/peeling-painted-metal_metallic.png"
        );
        const normalTexture = textureLoader.load(
          "../assets/peeling-painted-metal_normal-ogl.png"
        );
        const roughnessTexture = textureLoader.load(
          "../assets/peeling-painted-metal_roughness.png"
        );

        return [
          albedoTexture,
          aoTexture,
          heightTexture,
          metallicTexture,
          normalTexture,
          roughnessTexture,
        ];
      }
      default:
        return null;
    }
  }
}
