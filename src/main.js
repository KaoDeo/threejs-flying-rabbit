import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Fog,
  DirectionalLight,
  AmbientLight,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Color,
  Vector3,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import { DIMENSIONS, COLORS } from "./constants/materials.js";
import { preloadAllTextures, getLoadingProgress } from "./utils/helpers.js";

import { Planet } from "./classes/Planet.js";

const internals = {};

internals.W = DIMENSIONS.W;
internals.H = DIMENSIONS.H;

function showLoadingProgress() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-screen";
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
    font-family: Arial, sans-serif;
  `;

  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    width: 300px;
    height: 20px;
    background: #333;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
  `;

  const progressFill = document.createElement("div");
  progressFill.style.cssText = `
    height: 100%;
    background: linear-gradient(90deg, #b7513c, #379351);
    width: 0%;
    transition: width 0.3s ease;
  `;

  const progressText = document.createElement("div");
  progressText.textContent = "Loading textures...";
  progressText.style.fontSize = "18px";

  progressBar.appendChild(progressFill);
  loadingDiv.appendChild(progressBar);
  loadingDiv.appendChild(progressText);
  document.body.appendChild(loadingDiv);

  const updateProgress = () => {
    const progress = getLoadingProgress();
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Loading textures... ${progress.toFixed(1)}%`;

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    }
  };

  updateProgress();

  return loadingDiv;
}

function hideLoadingScreen(loadingDiv) {
  loadingDiv.style.opacity = "0";
  loadingDiv.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    document.body.removeChild(loadingDiv);
  }, 500);
}

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

        const material = new MeshStandardMaterial({
          color: 0x5c2c22,
          roughness: 0.8,
          metalness: 0.1,
        });

        internals.textMesh = new Mesh(geometry, material);
        internals.textMesh.castShadow = true;
        internals.scene.add(internals.textMesh);
      }
    );
  }
}

function initializeThreeJS() {
  internals.renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  internals.camera = new PerspectiveCamera(
    45,
    internals.W / internals.H,
    1,
    1000
  );
  internals.scene = new Scene();
  internals.scene.fog = new Fog(COLORS.fogColor, 100, 300);

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
}

function setupLights() {
  const directional = new DirectionalLight(COLORS.directionalLight, 1);
  directional.position.set(30, 20, 0);
  directional.castShadow = true;

  internals.scene.add(new AmbientLight(COLORS.ambientLight, 1));
  internals.scene.add(directional);
}

function createFloor() {
  const floor = new Mesh(
    new PlaneGeometry(1000, 1000),
    new MeshBasicMaterial({ color: COLORS.floorColor })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -100;

  internals.scene.add(floor);
}

function addElements() {
  internals.planet = new Planet({
    size: 30,
    position: { x: 0, y: -50, z: -20 },
    textureName: "worn-rusted-painted",
  });

  internals.scene.add(internals.planet.mesh);

  internals.orbitingPlanet = new Planet({
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

  internals.camera.position.set(35, 5, 0);
  internals.planet.mesh.add(internals.camera);
}

function setupRender() {
  internals.render = () => {
    const time = Date.now() * 0.001;

    if (internals.planet) {
      internals.planet.update();
    }

    if (internals.orbitingPlanet) {
      internals.orbitingPlanet.update();

      if (internals.camera.parent === internals.planet.mesh) {
        const orbitingPlanetWorldPos = new Vector3();
        internals.orbitingPlanet.mesh.getWorldPosition(orbitingPlanetWorldPos);

        internals.camera.lookAt(orbitingPlanetWorldPos);
      }

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

    if (internals.scene.fog) {
      const fogHue = (time * 0.1) % 1;
      const fogColor = new Color().setHSL(fogHue * 0.3 + 0.5, 0.3, 0.8);
      internals.scene.fog.color = fogColor;
      internals.renderer.setClearColor(fogColor, 0.7);
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

async function init() {
  const loadingScreen = showLoadingProgress();

  try {
    await preloadAllTextures();

    initializeThreeJS();
    setupLights();
    createFloor();
    addElements();
    setupInteractions();
    setupRender();

    hideLoadingScreen(loadingScreen);
  } catch (error) {
    console.error("Error initializing application:", error);
    hideLoadingScreen(loadingScreen);
  }
}

init();
