import * as THREE from "three";
import { shadowSupport } from "../utils/helpers.js";

export class Planet {
  constructor(options = {}) {
    this.mesh = new THREE.Group();
    this.planet = null;
    this.rotation = { x: 0.001, y: 0.002 };

    // Orbital configuration
    this.isOrbiting = options.isOrbiting || false;
    this.orbitAngle = options.orbitAngle || 0;
    this.orbitSpeed = options.orbitSpeed || 0.01;
    this.orbitRadius = options.orbitRadius || 80;
    this.orbitCenter = options.orbitCenter || { x: 0, y: -50, z: -20 };
    this.orbitHeight = options.orbitHeight || 0;

    // Planet configuration
    this.size = options.size || 30;
    this.color = options.color || null;
    this.useGrassTexture = options.useGrassTexture !== false;

    this._createPlanet();

    // Set initial position
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

    // Update orbital position if orbiting
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

  _createPlanet() {
    let planetMaterial;
    let textureLoader = new THREE.TextureLoader();

    if (this.useGrassTexture) {
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

      // Configure texture settings for better tiling
      [
        albedoTexture,
        aoTexture,
        heightTexture,
        metallicTexture,
        normalTexture,
        roughnessTexture,
      ].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2); // Repeat texture 8 times for better detail
      });

      // Create grass material using StandardMaterial for better texture support
      planetMaterial = new THREE.MeshStandardMaterial({
        map: albedoTexture,
        aoMap: aoTexture,
        displacementMap: heightTexture,
        displacementScale: 0,
        metalnessMap: metallicTexture,
        normalMap: normalTexture,
        roughnessMap: roughnessTexture,
        flatShading: false, // Disable flat shading for better texture rendering
      });
    } else {
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

      // Configure texture settings for better tiling
      [
        albedoTexture,
        aoTexture,
        heightTexture,
        metallicTexture,
        normalTexture,
        roughnessTexture,
      ].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Repeat texture 8 times for better detail
      });

      // Create grass material using StandardMaterial for better texture support
      planetMaterial = new THREE.MeshStandardMaterial({
        map: albedoTexture,
        aoMap: aoTexture,
        displacementMap: heightTexture,
        displacementScale: 3,
        metalnessMap: metallicTexture,
        normalMap: normalTexture,
        roughnessMap: roughnessTexture,
        flatShading: true, // Disable flat shading for better texture rendering
      });
    }

    // Create planet geometry
    const planetGeometry = new THREE.SphereGeometry(this.size, 32, 32);

    // Create planet mesh
    this.planet = new THREE.Mesh(planetGeometry, planetMaterial);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;

    this.mesh.add(this.planet);
    shadowSupport(this.mesh);
  }
}
