
//_____Louise McCarthy
//_____121112018______

import * as THREE from '../libs/three.module.js';
import { OrbitControls } from '../libs/OrbitControls.js';
import { GUI } from '../libs/dat.gui.module.js';
import { GLTFLoader } from "../libs/GLTFLoader.js";
import Stats from '../libs/stats.module.js';


let aspectRatio = (window.innerWidth / window.innerHeight);
let scene, camera, renderer, controls;
const group = new THREE.Group();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio( listener );
const posSound = new THREE.PositionalAudio ( listener );

const cube = new THREE.Mesh(
   //new THREE.BoxGeometry(),
   //new THREE.MeshBasicMaterial({color:0xf0f099, wireframe:true})
)


let container = document.getElementById('container');
let stat = new Stats();
stat.showPanel(0);
var video = document.getElementById('video');
video.load();
let gui = new GUI();






//____________________________________________________________________________________________________________


container.appendChild(stat.dom);
var videoCanvasContext, videoTexture;
var width = window.innerWidth;
var height = window.innerHeight;

function createControlPanel() {
  const cntlPanel = gui.addFolder('Control Panel');
  const playVideo = { play: function () { video.play(); } };
  cntlPanel.add(playVideo, 'play');
  const pauseVideo = { pause: function () { video.pause(); } };
  cntlPanel.add(pauseVideo, 'pause');
  const stopVideo = { stop: function () { video.pause(); video.currentTime = 0; } };
  cntlPanel.add(stopVideo, 'stop');
  // const resetVideo = cntlPanel.add(this, 'resetVideo');
  cntlPanel.open();
  // container.appendChild(gui.domElement);
}



//____________________________________________________________________________________________________________
// Create Scene

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('grey');
  scene.add(cube);
}

//____________________________________________________________________________________________________________
//Lighting

//Ambient
function createLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
 

// Directional light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(7, 5, 5);
scene.add(directionalLight);


//Spotlight
var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 10, -1);
  spotLight.shadowCameraNear = 20;
  spotLight.shadowCameraFar = 50;
  spotLight.castShadow = true;
  scene.add(spotLight);
  //console message
  console.log('Lighting has been created.');
}

//____________________________________________________________________________________________________________
//Animate
 
 function animate() {
   // window.requestAnimationFrame(animate);
   stat.begin();
 
   if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
     videoCanvasContext.drawImage( video, 0, 0 );
     if ( videoTexture ) videoTexture.needsUpdate = true;
   } else {console.log("no video")};
 
   renderer.render(scene, camera);
   renderer.setAnimationLoop(animate);
   stat.end();
 }
 
 //____________________________________________________________________________________________________________
 //Video Screen


 function createTV(){
   var videoCanvas = document.createElement('canvas');
   videoCanvas.width = width/2;
   videoCanvas.height = height/2;
   videoCanvasContext = videoCanvas.getContext('2d');

   // background color if no video present
   videoCanvasContext.fillStyle = '#000900';
   videoCanvasContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
   videoTexture = new THREE.VideoTexture(video);
   videoTexture.generateMipmaps = false;
   videoTexture.minFilter = THREE.LinearFilter;
   videoTexture.magFilter = THREE.LinearFilter;

  // videoTexture.encoding = THREE.sRGBEncoding;
   videoTexture.format = THREE.RGBAFormat;
   var tvMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
   var tvGeometry = new THREE.PlaneGeometry(width/12, height/12);
   var tvMesh = new THREE.Mesh(tvGeometry, tvMaterial);
   tvMesh.position.set(0, 5.1, -4.9);
   tvMesh.scale.set(0.078, 0.078, 0.09);
   tvMesh.rotation.set( 0, Math.PI / -500, 0);
   scene.add(tvMesh);
 
 }
 
//  objectC.scene.position.set( 0, 5.08, -4.971 );
//  objectC.scene.scale.set( .85, .85, .85 );
//  objectC.scene.rotation.set( 0, Math.PI/2, 0 );
// Mesh.position.set(0, 0, -100);
//    tvMesh.scale.set(0.184, 0.084, 0.01);
//    tvMesh.rotation.set( 0, Math.PI / 1, 0 );
//    scene.add(tvMesh);
 


// Create Content
function createCamera() {
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.y = 3;
  camera.position.z = 9;
  controls = new OrbitControls(camera, renderer.domElement);
  camera.add( listener );
}

// General sound in the scene that is not tied to a position (obj/location)
function createAmbientSound(){
   const audioLoader = new THREE.AudioLoader();
   audioLoader.load('../assets/gentle-ocean-waves-birdsong-and-gull-7109.mp3', function (buffer) {
   sound.setBuffer(buffer);
   sound.setLoop(true);
   sound.setVolume(0.25);
   sound.play();
});
}



//____________________________________________________________________________________________________________
// VR Controllers 

function createVRControllers() {
	function onSelectStart() {
		this.userData.isSelecting = true;
	}

	function onSelectEnd() {
		this.userData.isSelecting = false;
	}

	controller1 = renderer.xr.getController(0);
	controller1.addEventListener("selectstart", onSelectStart);
	controller1.addEventListener("selectend", onSelectEnd);
	controller1.addEventListener("connected", function (event) {
		this.add(buildController(event.data));
	});
	controller1.addEventListener("disconnected", function () {
		this.remove(this.children[0]);
	});
	scene.add(controller1);

	controller2 = renderer.xr.getController(1);
	controller2.addEventListener("selectstart", onSelectStart);
	controller2.addEventListener("selectend", onSelectEnd);
	controller2.addEventListener("connected", function (event) {
		this.add(buildController(event.data));
	});
	controller2.addEventListener("disconnected", function () {
		this.remove(this.children[0]);
	});
	scene.add(controller2);

	const controllerModelFactory = new XRControllerModelFactory();
	controllerGrip1 = renderer.xr.getControllerGrip(0);
	controllerGrip1.add(
		controllerModelFactory.createControllerModel(controllerGrip1),
	);
	scene.add(controllerGrip1);

	controllerGrip2 = renderer.xr.getControllerGrip(1);
	controllerGrip2.add(
		controllerModelFactory.createControllerModel(controllerGrip2),
	);
	scene.add(controllerGrip2);
	window.addEventListener("resize", onWindowResize, false);

	function buildController(data) {
		let geometry, material;
		switch (data.targetRayMode) {
			case "tracked-pointer":
				geometry = new THREE.BufferGeometry();
				geometry.setAttribute(
					"position",
					new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3),
				);
				geometry.setAttribute(
					"color",
					new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3),
				);
				material = new THREE.LineBasicMaterial({
					vertexColors: true,
					blending: THREE.AdditiveBlending,
				});
				return new THREE.Line(geometry, material);
			case "gaze":
				geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(
					0,
					0,
					-1,
				);
				material = new THREE.MeshBasicMaterial({
					opacity: 0.5,
					transparent: true,
				});
				return new THREE.Mesh(geometry, material);
		}
	}
}


//____________________________________________________________________________________________________________
//Load model


function loadModel() {
	const loader = new GLTFLoader();
	loader.load( '../assetsA/vle23.glb', function ( gltf ) {
	gltf.scene.position.set( 0, 0, 0 );
	scene.add( gltf.scene );


    // LOAD AVATAR 1
    loader.load( '../assetsA/instructor.glb', function ( objectA ) {
        objectA.scene.position.set( 0, 0, 0 );
        scene.add( objectA.scene );
     }
      );
    
    // LOAD AVATAR 2
    loader.load( '../assetsA/Driver.glb', function ( objectB ) {
        objectB.scene.position.set( 0, 0, 0 );
        scene.add( objectB.scene );
    }
        );

    // LOAD PROJECTOR
    loader.load( '../assetsA/projector.glb', function ( objectC ) {
      objectC.scene.position.set( 0, 4.95, -4.971 );
      objectC.scene.scale.set( .85, 1., .8 );
      objectC.scene.rotation.set( 0, Math.PI/2, 0 );
      scene.add( objectC.scene );
  }
      );
        



}, undefined, function ( error ) {
	console.error( error );
} );
}

//____________________________________________________________________________________________________________


// Sound tied to an object or a location in the scene.
//Reference distance is 10 units. Units can be configured.
//Load sound and position it to the car  (obj)
function createPositionSound(){
   const audioLoader2 = new THREE.AudioLoader();
   audioLoader2.load ('../assetsA/Applause.mp3', function (buffer) {
     posSound.setBuffer( buffer)
     posSound.setRefDistance( 10 )
   });
  cube.add(posSound);
}


//////////////////////////////////
// Renderer, Utils, Animate, Init
function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1.0);
  document.body.appendChild(renderer.domElement);
}




//____________________________________________________________________________________________________________
//GUI and Controls

function createControls(){
  document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 32) { //space bar
        video.play();
      console.log("play");
    } else if (keyCode == 80) { // p key
        video.pause();
      console.log("pause");
    } else if (keyCode == 83) { // s key
                video.pause();
                video.currentTime = 0;
      console.log("stop");
    } else if (keyCode == 82) { // r key
                video.currentTime = 0;
                // controls.update();
                stat.update();
      console.log("reset");
    } 
}}



function createUtils(){

// Axes Helper
  //const axesHelper = new THREE.AxesHelper(5);
  //scene.add(axesHelper);

// GUI
// The library is dat.GUI and has been loaded at the top
// Adding folders to group these
//The creating controls, (play, stop) tying these to java objects. There are Passed into functions when triggered. 

const gui = new GUI();



  const soundFolder = gui.addFolder("Positional Audio");
  const playObj = { play:function(){ posSound.play() }};
  const stopObj = { stop:function(){ posSound.stop() }};

  soundFolder.add(stopObj,'stop');
  soundFolder.add(playObj,'play');


  //Note the Panner is a slider not a button
  // using dot syntax to 
  //opens as derected, collapsable
  soundFolder.add(cube.position, "x", -5, 5, .001).name("Panner");
  soundFolder.open()
  const allAudioFolder = gui.addFolder("All Audio");

  const muteObj = { stop:function(){
    //Need to determine if sound is actully playing or not.
    //double bars is a Boolean operator for if/or
    //ternary operator.  quite efficent. Always put the one that is most likely true first.
    //If any of these are true then => this. Otherwise => This. 
    //A form of search for various conditionality. V compact.
    posSound.isPlaying || sound.isPlaying ? listener.setMasterVolume(0) : 
  listener.setMasterVolume(1) }};
  allAudioFolder.add(muteObj,'stop').name("Mute All");
  allAudioFolder.open()
}



//____________________________________________________________________________________________________________








//____________________________________________________________________________________________________________



//RESIZE WINDOW BASED ON BROWZER
function resizeWindow() {
  // determine dims of browser window
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update dims of renderer accordingly
  renderer.setSize(width, height);

  // Then update the camera's aspect ratio
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

//____________________________________________________________________________________________________________


//unmute function??

// function animate() {
//   window.requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
function init() {
  createScene();
  createRenderer();
  createCamera();
//   createGeometry();
  createAmbientSound();
  loadModel();
  addEventListener("resize", resizeWindow );
	resizeWindow();
  createControlPanel();
  createLight();
  createControls();
  createTV(); 
  createPositionSound();
  createUtils();
  animate();
}
init();