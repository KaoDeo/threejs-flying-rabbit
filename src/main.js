import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import { DIMENSIONS, COLORS } from "./constants/materials.js";
import { Cloud } from "./classes/Cloud.js";
import { Planet } from "./classes/Planet.js";

const internals = {};

internals.W = DIMENSIONS.W;
internals.H = DIMENSIONS.H;

function handleText(inputValue) {
  if (inputValue && inputValue.trim() !== "") {
    const loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      function (font) {
        if (internals.textMesh) {
          internals.scene.remove(internals.textMesh);
        }

        const geometry = new TextGeometry(inputValue, {
          font: font,
          size: 2,
          depth: 0.1,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05,
          bevelOffset: 0,
          bevelSegments: 1,
        });

        geometry.computeBoundingBox();
        const centerOffsetX =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(centerOffsetX, 0, 0);

        const material = new THREE.MeshStandardMaterial({
          color: 0x5c2c22,
          roughness: 0.8,
          metalness: 0.1,
        });

        internals.textMesh = new THREE.Mesh(geometry, material);
        internals.textMesh.castShadow = true;
        internals.scene.add(internals.textMesh);
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

  internals.renderer.shadowMap.enabled = true;
  document.body.appendChild(internals.renderer.domElement);

  internals.camera.position.set(40, 20, 100);
  internals.scene.add(internals.camera);

  internals.controls = new OrbitControls(
    internals.camera,
    internals.renderer.domElement
  );
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
  internals.planet = new Planet({
    useGrassTexture: true,
    size: 30,
    position: { x: 0, y: -50, z: -20 },
    textureName: "worn-rusted-painted",
  });

  internals.scene.add(internals.planet.mesh);

  internals.orbitingPlanet = new Planet({
    useGrassTexture: false,
    size: 8,
    color: 0x8b4513,
    isOrbiting: true,
    orbitSpeed: 0.01,
    orbitRadius: 80,
    orbitCenter: { x: 0, y: -50, z: -20 },
    orbitHeight: 10,
    textureName: "peeling-painted-metal",
  });
  internals.scene.add(internals.orbitingPlanet.mesh);

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

function setupRender() {
  internals.render = () => {
    if (internals.planet) {
      internals.planet.update();
    }

    if (internals.orbitingPlanet) {
      internals.orbitingPlanet.update();

      if (internals.textMesh) {
        const planetPos = internals.orbitingPlanet.mesh.position;
        internals.textMesh.position.set(
          planetPos.x,
          planetPos.y - 15,
          planetPos.z
        );
        internals.textMesh.lookAt(internals.camera.position);
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

function setupInteractions() {
  const inputElement = document.getElementById("user-input");
  const submitButton = document.getElementById("submit-button");

  if (inputElement && submitButton) {
    submitButton.addEventListener("click", () => {
      const inputValue = inputElement.value;
      handleText(inputValue);
    });

    inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const inputValue = inputElement.value;
        handleText(inputValue);
      }
    });
  }
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
