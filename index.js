import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Texture,
  PhotoDome,
  VideoDome,
  Animation,
  UniversalCamera,
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

import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'

// Enable GLTF/GLB loader for loading controller models from WebXR Input registry
import '@babylonjs/loaders/glTF'

// Without this next import, an error message like this occurs loading controller models:
//  Build of NodeMaterial failed" error when loading controller model
//  Uncaught (in promise) Build of NodeMaterial failed: input rgba from block
//  FragmentOutput[FragmentOutputBlock] is not connected and is not optional.
import '@babylonjs/core/Materials/Node/Blocks'

import losAngeles from "./assets/forFacebook-8K-LA.jpg";
import athens from "./assets/Athens-8K.jpg";
import lakeTahao from "./assets/LakeTahao-10K.jpg";
import lakeTahao8k360video from "./assets/LakeTahao-8K-short-360.mp4";


const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const scene = new Scene(engine);
//var xrHelper = scene.createDefaultXRExperienceAsync();
//var vrHelper = scene.createDefaultVRExperience();
var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false}); 
//new HemisphericLight("hemiLight", new Vector3(0, 1, 0));

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
var dome = new PhotoDome(
  "sphere",
  losAngeles,
  {
    resolution: 64,
    size: 1000,
    //halfDomeMode: true,
    useDirectMapping: false
  },
  scene
);
dome.imageMode = PhotoDome.MODE_MONOSCOPIC;

// Create the VideoDome
// var videoDome = new VideoDome(
//   "videoSphere",
//   lakeTahao8k360video,
//   {
//     resolution: 64,
//     size: 1000,
//     clickToPlay: true,
//     useDirectMapping: false
//   },
//   scene
// );
//videoDome.imageMode = VideoDome.MODE_TOPBOTTOM;
vrHelper.enableInteractions();

// Create a GUI texture
const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
  "UI"
);

// Create a stack panel to hold the buttons
const stackPanel = new StackPanel();
stackPanel.width = "300px";
stackPanel.horizontalAlignment =
  Control.HORIZONTAL_ALIGNMENT_RIGHT;
stackPanel.verticalAlignment =
  Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture.addControl(stackPanel);

// Create the buttons
const button1 = Button.CreateSimpleButton(
  "button1",
  "Los Angeles"
);
button1.width = "200px";
button1.height = "100px";
button1.paddingBottom ="30px";
button1.cornerRadius="10";
button1.shadowColor="black";
button1.shadowOffsetX="2";
button1.shadowOffsetY="2";
button1.shadowBlur="30";
button1.color = "white";
button1.thickness = 2;
button1.background = "gray";
button1.alpha = "0.5";
button1.onPointerUpObservable.add(() => {
  button1.thickness = 2;
  button2.thickness = 0;
  button3.thickness = 0;
  button4.thickness = 0;
  transition(losAngeles);
});
stackPanel.addControl(button1);

const button2 = Button.CreateSimpleButton(
  "button2",
  "Athens, Greece"
);
button2.width = "200px";
button2.height = "100px";
button2.paddingBottom ="30px";
button2.cornerRadius="10";
button2.shadowColor="black";
button2.shadowOffsetX="2";
button2.shadowOffsetY="2";
button2.shadowBlur="30";
button2.color = "white";
button2.thickness = 0;
button2.background = "gray";
button2.alpha = "0.5";
button2.onPointerUpObservable.add(() => {
  button1.thickness = 0;
  button2.thickness = 2;
  button3.thickness = 0;
  button4.thickness = 0;
  transition(athens);
});
stackPanel.addControl(button2);

const button3 = Button.CreateSimpleButton(
  "button3",
  "Lake Tahoe"
);
button3.width = "200px";
button3.height = "100px";
button3.paddingBottom ="30px";
button3.cornerRadius="10";
button3.shadowColor="black";
button3.shadowOffsetX="2";
button3.shadowOffsetY="2";
button3.shadowBlur="30";
button3.color = "white";
button3.thickness = 0;
button3.background = "gray";
button3.alpha = "0.5";
button3.onPointerUpObservable.add(() => {
  button1.thickness = 0;
  button2.thickness = 0;
  button3.thickness = 2;
  button4.thickness = 0;
  transition(lakeTahao);
});
stackPanel.addControl(button3);

const button4 = Button.CreateSimpleButton(
  "button4",
  "360 Video"
);
button4.width = "200px";
button4.height = "100px";
button4.paddingBottom ="30px";
button4.cornerRadius="10";
button4.shadowColor="black";
button4.shadowOffsetX="2";
button4.shadowOffsetY="2";
button4.shadowBlur="30";
button4.color = "white";
button4.thickness = 0;
button4.background = "gray";
button4.alpha = "0.5";
button4.onPointerUpObservable.add(() => {
  button1.thickness = 0;
  button2.thickness = 0;
  button3.thickness = 0;
  button4.thickness = 2
  transitionVideo(lakeTahao);
});
stackPanel.addControl(button4);

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

const transitionVideo = (video) => {
  let anim = scene.beginDirectAnimation(
    dome.mesh,
    [fadeOutAnimation],
    0,
    120,
    false
  );
  anim.onAnimationEnd = () => loadNewVideoTexture(video);
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
        resolution: 128,
        size: 1000,
        useDirectMapping: false
      },
      scene
    );
    
    dome.mesh.material.alpha = 0;
    dome.imageMode = PhotoDome.MODE_TOPBOTTOM;
    scene.beginDirectAnimation(
      dome.mesh,
      [fadeInAnimation],
      0,
      120,
      false
    );
  });
};

const loadNewVideoTexture = (video) => {
  const newTexture = new Texture(video, scene);
  newTexture.onLoadObservable.add(() => {
    dome.dispose();

    // Create a new dome with the new texture
    // dome = new PhotoDome(
    //   "sphere",
    //   image,
    //   {
    //     resolution: 128,
    //     size: 1000,
    //     useDirectMapping: false
    //   },
    //   scene
    // );
    // Create the VideoDome
    dome = new VideoDome(
      "videoSphere",
      lakeTahao8k360video,
      {
        resolution: 64,
        size: 1000,
        clickToPlay: true,
        useDirectMapping: false
      },
      scene
    );
    
    dome.mesh.material.alpha = 0;
    dome.imageMode = PhotoDome.MODE_TOPBOTTOM;
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
//Assume `scene` is your Babylon.js scene

// Create the zoom in button
// var zoomInButton = Button.CreateSimpleButton(
//   "zoomInButton",
//   "Zoom In"
// );
// zoomInButton.paddingTopInPixels = 50;
// zoomInButton.width = "100px";
// zoomInButton.height = "90px";
// zoomInButton.color = "white";
// zoomInButton.background = "blue";
// zoomInButton.onPointerUpObservable.add(() => {
//   camera.fov = Math.max(0.1, camera.fov - 0.1);
// });
// stackPanel.addControl(zoomInButton);

// Create the zoom out button
// var zoomOutButton = Button.CreateSimpleButton(
//   "zoomOutButton",
//   "Zoom Out"
// );
// zoomOutButton.width = "100px";
// zoomOutButton.height = "40px";
// zoomOutButton.color = "white";
// zoomOutButton.background = "blue";
// zoomOutButton.onPointerUpObservable.add(() => {
//   camera.fov = Math.min(Math.PI / 2, camera.fov + 0.1);
// });
// stackPanel.addControl(zoomOutButton);

// Create a rotation animation
// let isRotationPlaying = true;
// let rotationSpeed = 0.00001; // Adjust as needed for faster/slower rotation

// Create the rotation button
// const rotationButton = Button.CreateSimpleButton(
//   "rotationButton",
//   "Pause"
// );
// rotationButton.width = "100px";
// rotationButton.height = "40px";
// rotationButton.color = "white";
// rotationButton.background = "purple";
// rotationButton.onPointerUpObservable.add(() => {
//   isRotationPlaying = !isRotationPlaying;
//   rotationButton.textBlock.text = isRotationPlaying
//     ? "Pause"
//     : "Play";
// });
// stackPanel.addControl(rotationButton);

// Update camera rotation in the render loop based on isRotationPlaying
// scene.onBeforeRenderObservable.add(() => {
//   //dome.imageMode = PhotoDome.MODE_SIDEBYSIDE;
//   // if (isRotationPlaying) {
//   //   camera.rotation.y += rotationSpeed;
//   // }
// });
