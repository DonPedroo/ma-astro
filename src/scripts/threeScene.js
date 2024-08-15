// src/scripts/threeScene.js
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

export class ThreeScene {
  constructor() {
    this.initScene();
    this.animate();
  }

  initScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Find the div with ID "gl"
    const glDiv = document.getElementById('gl');

    // Ensure the div exists before appending the canvas
    if (glDiv) {
      glDiv.appendChild(this.renderer.domElement);
    } else {
      console.error('Div with ID "gl" not found');
    }
    this.geometry = new BoxGeometry();
    this.material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  getScene() {
    return this.scene;
  }
}
