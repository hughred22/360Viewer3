import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Texture,
  PhotoDome,
  Animation,
  UniversalCamera
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/core/Particles/particleSystemComponent";
import "@babylonjs/core/Particles/webgl2ParticleSystem";
import {
  AdvancedDynamicTexture,
  StackPanel,
  Button,
  Control
} from "@babylonjs/gui";

import borghese from "./assets/forFacebook-8K-LA.jpg";
import alps from "./assets/italy.jpg";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
new HemisphericLight("hemiLight", new Vector3(0, 1, 0));

const camera = new UniversalCamera(
  "camera",
  Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

engine.runRenderLoop(() => {
  scene.render();
});
window.addEventListener("resize", () => {
  engine.resize();
});

// Create the PhotoDome
let dome = new PhotoDome(
  "sphere",
  alps,
  {
    resolution: 64,
    size: 1000,
    useDirectMapping: false
  },
  scene
);

// Create a GUI texture
const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
  "UI"
);

// Create a stack panel to hold the buttons
const stackPanel = new StackPanel();
stackPanel.width = "220px";
stackPanel.horizontalAlignment =
  Control.HORIZONTAL_ALIGNMENT_RIGHT;
stackPanel.verticalAlignment =
  Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture.addControl(stackPanel);

// Create the buttons
const button1 = Button.CreateSimpleButton(
  "button1",
  "Alps"
);
button1.width = "100px";
button1.height = "40px";
button1.color = "white";
button1.thickness = 2;
button1.background = "green";
button1.onPointerUpObservable.add(() => {
  button1.thickness = 2;
  button2.thickness = 0;
  transition(alps);
});
stackPanel.addControl(button1);

const button2 = Button.CreateSimpleButton(
  "button2",
  "Gardens"
);
button2.width = "100px";
button2.height = "40px";
button2.thickness = 0;
button2.color = "white";
button2.background = "red";
button2.onPointerUpObservable.add(() => {
  button1.thickness = 0;
  button2.thickness = 2;
  transition(borghese);
});
stackPanel.addControl(button2);

const transition = (image) => {
  let anim = scene.beginDirectAnimation(
    dome.mesh,
    [fadeOutAnimation],
    0,
    120,
    false
  );
  anim.onAnimationEnd = () => loadNewTexture(image);
};

const loadNewTexture = (image) => {
  const newTexture = new Texture(image, scene);
  newTexture.onLoadObservable.add(() => {
    dome.dispose();

    // Create a new dome with the new texture
    dome = new PhotoDome(
      "sphere",
      image,
      {
        resolution: 64,
        size: 1000,
        useDirectMapping: false
      },
      scene
    );
    dome.mesh.material.alpha = 0;
    scene.beginDirectAnimation(
      dome.mesh,
      [fadeInAnimation],
      0,
      120,
      false
    );
  });
};

const fadeOutAnimation = new Animation(
  "fadeOut",
  "material.alpha",
  40,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CONSTANT
);

fadeOutAnimation.setKeys([
  { frame: 0, value: 1 },
  { frame: 120, value: 0 }
]);

const fadeInAnimation = new Animation(
  "fadeIn",
  "material.alpha",
  40,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CONSTANT
);

fadeInAnimation.setKeys([
  { frame: 0, value: 0 },
  { frame: 120, value: 1 }
]);
// Assume `scene` is your Babylon.js scene

// Create the zoom in button
var zoomInButton = Button.CreateSimpleButton(
  "zoomInButton",
  "Zoom In"
);
zoomInButton.paddingTopInPixels = 50;
zoomInButton.width = "100px";
zoomInButton.height = "90px";
zoomInButton.color = "white";
zoomInButton.background = "blue";
zoomInButton.onPointerUpObservable.add(() => {
  camera.fov = Math.max(0.1, camera.fov - 0.1);
});
stackPanel.addControl(zoomInButton);

// Create the zoom out button
var zoomOutButton = Button.CreateSimpleButton(
  "zoomOutButton",
  "Zoom Out"
);
zoomOutButton.width = "100px";
zoomOutButton.height = "40px";
zoomOutButton.color = "white";
zoomOutButton.background = "blue";
zoomOutButton.onPointerUpObservable.add(() => {
  camera.fov = Math.min(Math.PI / 2, camera.fov + 0.1);
});
stackPanel.addControl(zoomOutButton);

// Create a rotation animation
let isRotationPlaying = true;
let rotationSpeed = 0.00001; // Adjust as needed for faster/slower rotation

// Create the rotation button
const rotationButton = Button.CreateSimpleButton(
  "rotationButton",
  "Pause"
);
rotationButton.width = "100px";
rotationButton.height = "40px";
rotationButton.color = "white";
rotationButton.background = "purple";
rotationButton.onPointerUpObservable.add(() => {
  isRotationPlaying = !isRotationPlaying;
  rotationButton.textBlock.text = isRotationPlaying
    ? "Pause"
    : "Play";
});
stackPanel.addControl(rotationButton);

// Update camera rotation in the render loop based on isRotationPlaying
scene.onBeforeRenderObservable.add(() => {
  if (isRotationPlaying) {
    camera.rotation.y += rotationSpeed;
  }
});
