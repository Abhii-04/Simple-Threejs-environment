import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Cube texture paths
const cubetexture = [
    '/images/cube/serenity_bk.jpg',
    '/images/cube/serenity_dn.jpg',
    '/images/cube/serenity_ft.jpg',
    '/images/cubeserenity_lf.jpg',
    '/images/cube/serenity_rt.jpg',
    '/images/cube/serenity_up.jpg'
];
let mixer;
const clock = new THREE.Clock();

const scene = new THREE.Scene();


const environment = new THREE.CubeTextureLoader().load(cubetexture);    
scene.background = environment;

// Create the camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(5, 6, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3dcontainer').appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//cube
const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
const cubeMaterials = cubetexture.map(texture => {
    return new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(texture),
        side: THREE.BackSide 
    });
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
scene.add(cube);

//model
const loader = new GLTFLoader();
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/dragon/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        cube.add(model);

        //animations
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    },
    function (loading) {
        console.log((loading.loaded / loading.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error occurred loading the GLTF model', error);
    }
);

// const clip =THREE.AnimationClip.findByName(animations, 'Take 001');
// const action = mixer.clipAction(clip);
// action.play();


// light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
light.castShadow = true;
scene.add(light);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if(mixer){
        const delta = clock.getDelta(); 
        mixer.update(delta * 0.5);
    } 
    controls.update();
    renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


animate();
