import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import { DIMENSIONS, MATERIALS, COLORS } from "./constants/materials.js";
import { Carrot } from "./classes/Carrot.js";
import { Cloud } from "./classes/Cloud.js";

const internals = {};

internals.W = DIMENSIONS.W;
internals.H = DIMENSIONS.H;

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("user-input");
  const submitButton = document.getElementById("submit-button");

  submitButton.addEventListener("click", () => {
    const inputValue = inputElement.value;
    handleText(inputValue);
  });
});

function handleText(inputValue) {
  const carrot = internals.carrot;
  if (carrot) {
    const loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(inputValue, {
          font: font,
          size: 3,
          depth: 0.1,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 1,
        });

        const material = new THREE.MeshBasicMaterial({
          color: 0x5c2c22,
          flastShading: true,
        });
        const text = new THREE.Mesh(geometry, material);
        text.position.set(0, -6, 0);

        if (inputValue) {
          internals.scene.add(text);
        }
      }
    );
  }
}

function initializeThreeJS() {
  internals.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  internals.camera = new THREE.PerspectiveCamera(
    45,
    internals.W / internals.H,
    1,
    1000
  );
  internals.scene = new THREE.Scene();
  internals.scene.fog = new THREE.Fog(COLORS.fogColor, 100, 300);

  internals.renderer.setPixelRatio(window.devicePixelRatio);
  internals.renderer.setClearColor(COLORS.clearColor, 0.7);

  internals.camera.aspect = DIMENSIONS.ASPECT_RATIO;
  internals.camera.updateProjectionMatrix();

  internals.renderer.setSize(
    internals.W,
    internals.W / DIMENSIONS.ASPECT_RATIO
  );
  internals.resizeHandler = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    if (aspect > DIMENSIONS.ASPECT_RATIO) {
      internals.W = height * DIMENSIONS.ASPECT_RATIO;
      internals.H = height;
    } else {
      internals.W = width;
      internals.H = width / DIMENSIONS.ASPECT_RATIO;
    }

    internals.renderer.setSize(internals.W, internals.H);
    internals.camera.aspect = DIMENSIONS.ASPECT_RATIO;
    internals.camera.updateProjectionMatrix();
  };

  internals.resizeHandler();
  internals.renderer.shadowMap.enabled = true;
  document.body.appendChild(internals.renderer.domElement);

  internals.camera.position.set(40, 20, 100);
  internals.scene.add(internals.camera);
  internals.controls = new OrbitControls(
    internals.camera,
    internals.renderer.domElement
  );
  internals.controls.minDistance = 50;
  internals.controls.maxDistance = 250;
}

function setupLights() {
  const directional = new THREE.DirectionalLight(COLORS.directionalLight, 1);
  directional.position.set(30, 20, 0);
  directional.castShadow = true;

  internals.scene.add(new THREE.AmbientLight(COLORS.ambientLight, 1));
  internals.scene.add(directional);
}

function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: COLORS.floorColor })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -100;

  internals.scene.add(floor);
}

function addElements() {
  internals.carrot = new Carrot();
  internals.scene.add(internals.carrot.mesh);

  internals.clouds = [
    new Cloud({ y: -15, z: 20 }),
    new Cloud({ y: 5, z: 10, delay: 3 }),
    new Cloud({ y: 25, z: -10, delay: 1.5 }),
    new Cloud({ y: -25, z: 10, delay: 6 }),
  ];

  internals.clouds.forEach((cloud) => {
    internals.scene.add(cloud.mesh);
  });
}

function setupInteractions() {
  const startInteraction = () => {
    if (internals.carrot && internals.carrot.pilot) {
      internals.carrot.pilot.startEyeBlinking();
    }
  };

  const endInteraction = () => {
    if (internals.carrot && internals.carrot.pilot) {
      internals.carrot.pilot.stopEyeBlinking();
    }
  };

  internals.renderer.domElement.addEventListener("mousedown", startInteraction);
  internals.renderer.domElement.addEventListener("mouseup", endInteraction);
}

function setupRender() {
  internals.render = () => {
    if (internals.carrot) {
      internals.carrot.update();
      if (internals.carrot.pilot) {
        internals.carrot.pilot.update();
        internals.carrot.pilot.updateBlinking();
      }
    }

    if (internals.clouds) {
      internals.clouds.forEach((cloud) => cloud.update());
    }

    internals.renderer.render(internals.scene, internals.camera);
    requestAnimationFrame(internals.render);
  };
  internals.render();
}

function init() {
  initializeThreeJS();
  setupLights();
  createFloor();
  addElements();
  setupInteractions();
  setupRender();
}

init();
