import * as THREE from "three";
import { shadowSupport } from "../utils/helpers.js";

export class Planet {
  constructor() {
    this.mesh = new THREE.Group();
    this.planet = null;
    this.rotation = { x: 0.001, y: 0.002 };

    this._createPlanet();
  }

  update() {
    if (this.planet) {
      this.planet.rotation.x += this.rotation.x;
      this.planet.rotation.y += this.rotation.y;
    }
  }

  _createPlanet() {
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load grass textures
    const albedoTexture = textureLoader.load(
      "../assets/stylized-grass1_albedo.png"
    );
    const aoTexture = textureLoader.load("../assets/stylized-grass1_ao.png");
    const heightTexture = textureLoader.load(
      "../assets/stylized-grass1_height.png"
    );
    const metallicTexture = textureLoader.load(
      "../assets/stylized-grass1_metallic.png"
    );
    const normalTexture = textureLoader.load(
      "../assets/stylized-grass1_normal-ogl.png"
    );
    const roughnessTexture = textureLoader.load(
      "../assets/stylized-grass1_roughness.png"
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
      texture.repeat.set(8, 8); // Repeat texture 8 times for better detail
    });

    // Create grass material using StandardMaterial for better texture support
    const grassMaterial = new THREE.MeshStandardMaterial({
      map: albedoTexture,
      aoMap: aoTexture,
      displacementMap: heightTexture,
      displacementScale: 3,
      metalnessMap: metallicTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      flatShading: true, // Disable flat shading for better texture rendering
    });

    // Create planet geometry
    const planetGeometry = new THREE.SphereGeometry(30, 32, 32);

    // Create planet mesh
    this.planet = new THREE.Mesh(planetGeometry, grassMaterial);
    this.planet.position.set(0, -50, -20);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;

    this.mesh.add(this.planet);
    shadowSupport(this.mesh);
  }
}
