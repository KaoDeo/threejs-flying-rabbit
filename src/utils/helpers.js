import {
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader,
  LoadingManager,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three";

const textureCache = new Map();

const loadingManager = new LoadingManager();

let loadingProgress = 0;

loadingManager.onProgress = (url, loaded, total) => {
  loadingProgress = (loaded / total) * 100;
  console.log(`Loading progress: ${loadingProgress.toFixed(1)}%`);
};

loadingManager.onLoad = () => {
  console.log("All textures loaded!");
};

const textureLoader = new TextureLoader(loadingManager);

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

  // Optimize texture settings for better performance
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
}

function loadTextureAsync(url) {
  return new Promise((resolve, reject) => {
    if (textureCache.has(url)) {
      resolve(textureCache.get(url));
      return;
    }

    textureLoader.load(
      url,
      (texture) => {
        textureCache.set(url, texture);
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error(`Failed to load texture: ${url}`, error);
        reject(error);
      }
    );
  });
}

export async function preloadAllTextures() {
  const textureUrls = [
    "./assets/worn-rusted-painted_albedo.png",
    "./assets/worn-rusted-painted_ao.png",
    "./assets/worn-rusted-painted_height.png",
    "./assets/worn-rusted-painted_metallic.png",
    "./assets/worn-rusted-painted_normal-ogl.png",
    "./assets/worn-rusted-painted_roughness.png",

    "./assets/peeling-painted-metal_albedo.png",
    "./assets/peeling-painted-metal_ao.png",
    "./assets/peeling-painted-metal_height.png",
    "./assets/peeling-painted-metal_metallic.png",
    "./assets/peeling-painted-metal_normal-ogl.png",
    "./assets/peeling-painted-metal_roughness.png",

    "./assets/wrinkled-paper-albedo.png",
    "./assets/wrinkled-paper-ao.png",
    "./assets/wrinkled-paper-height.png",
    "./assets/wrinkled-paper-metalness.png",
    "./assets/wrinkled-paper-normal-ogl.png",
    "./assets/wrinkled-paper-roughness.png",
  ];

  try {
    await Promise.all(textureUrls.map((url) => loadTextureAsync(url)));
    console.log("All textures preloaded successfully!");
  } catch (error) {
    console.error("Error preloading textures:", error);
  }
}

export function loadTextures(textureName) {
  const getTextureFromCache = (url) => {
    const texture = textureCache.get(url);
    if (!texture) {
      console.warn(`Texture not found in cache: ${url}`);
      // Fallback to synchronous loading
      return textureLoader.load(url);
    }
    return texture;
  };

  switch (textureName) {
    case "worn-rusted-painted":
      return [
        getTextureFromCache("./assets/worn-rusted-painted_albedo.png"),
        getTextureFromCache("./assets/worn-rusted-painted_ao.png"),
        getTextureFromCache("./assets/worn-rusted-painted_height.png"),
        getTextureFromCache("./assets/worn-rusted-painted_metallic.png"),
        getTextureFromCache("./assets/worn-rusted-painted_normal-ogl.png"),
        getTextureFromCache("./assets/worn-rusted-painted_roughness.png"),
      ];

    case "peeling-painted-metal":
      return [
        getTextureFromCache("./assets/peeling-painted-metal_albedo.png"),
        getTextureFromCache("./assets/peeling-painted-metal_ao.png"),
        getTextureFromCache("./assets/peeling-painted-metal_height.png"),
        getTextureFromCache("./assets/peeling-painted-metal_metallic.png"),
        getTextureFromCache("./assets/peeling-painted-metal_normal-ogl.png"),
        getTextureFromCache("./assets/peeling-painted-metal_roughness.png"),
      ];

    case "wrinkled-paper":
      return [
        getTextureFromCache("./assets/wrinkled-paper-albedo.png"),
        getTextureFromCache("./assets/wrinkled-paper-ao.png"),
        getTextureFromCache("./assets/wrinkled-paper-height.png"),
        getTextureFromCache("./assets/wrinkled-paper-metalness.png"),
        getTextureFromCache("./assets/wrinkled-paper-normal-ogl.png"),
        getTextureFromCache("./assets/wrinkled-paper-roughness.png"),
      ];

    default:
      return null;
  }
}

export function getLoadingProgress() {
  return loadingProgress;
}
