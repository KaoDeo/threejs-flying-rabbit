import * as THREE from "three";

// Constants
export const DIMENSIONS = {
  W: 500,
  H: 500,
  ASPECT_RATIO: 16 / 9,
};

// Materials
export const MATERIALS = {
  orange: new THREE.MeshPhongMaterial({ color: 0xb7513c, flatShading: true }),
  green: new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true }),
  brown: new THREE.MeshPhongMaterial({ color: 0x5c2c22, flatShading: true }),
  pink: new THREE.MeshPhongMaterial({ color: 0xb1325e, flatShading: true }),
  gray: new THREE.MeshPhongMaterial({ color: 0x666666, flatShading: true }),
  clouds: new THREE.MeshPhongMaterial({ color: 0xeeeeee, flatShading: true }),
  rabbit: new THREE.MeshPhongMaterial({ color: 0xaaaaaa, flatShading: true }),
};

// Colors
export const COLORS = {
  fogColor: 0xd5f8f8,
  clearColor: 0xc5f5f5,
  ambientLight: 0xc5f5f5,
  directionalLight: 0xffffff,
  floorColor: 0xe0dacd,
};
