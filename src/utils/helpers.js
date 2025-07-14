import {
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader,
} from "three";

export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const shadowSupport = (group) => {
  group.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
};

export const createMaterial = (
  albedoTexture,
  aoTexture,
  heightTexture,
  displacementScale,
  metallicTexture,
  normalTexture,
  roughnessTexture,
  flatShading = true
) => {
  return new MeshStandardMaterial({
    map: albedoTexture,
    aoMap: aoTexture,
    displacementMap: heightTexture,
    displacementScale: displacementScale,
    metalnessMap: metallicTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    flatShading: flatShading,
  });
};

export function applyTexture(texture, repeat = 1) {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
}

export function loadTextures(textureName) {
  const textureLoader = new TextureLoader();

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

    case "wrinkled-paper": {
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
