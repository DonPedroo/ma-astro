// src/scripts/threeScene.js
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh,PlaneGeometry,ShaderMaterial,Vector4,Color,LinearSRGBColorSpace } from 'three';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";




export class ThreeScene {
  constructor(context) {
    this.context = context
    this.backgrounds =this.context.backgrounds;
    this.initScene();
    this.animate();
    this.resize()
    this.initUniforms()

  }

 

  

  initUniforms() {

    console.log("this.context.startPage",this.context.startPage)


    this.backgroundMaterial.uniforms.u_current.value = {
      type: this.backgrounds[this.context.startPage].type,
      color: new Color(this.backgrounds[this.context.startPage].gl.color),
      texture: this.backgrounds[this.context.startPage].gl.texture,
  };

  this.backgroundMaterial.uniforms.u_next.value = {
    type: this.backgrounds[this.context.startPage].type,
    color: new Color(this.backgrounds[this.context.startPage].color),
    texture: this.backgrounds[this.context.startPage].gl.texture,
};

  }





  initScene() {

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, this.context.width / this.context.height, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.outputColorSpace = LinearSRGBColorSpace;

    this.renderer.setSize(this.context.width, this.context.height);
    const glDiv = document.getElementById('gl');

    // Ensure the div exists before appending the canvas
    if (glDiv) {
      glDiv.appendChild(this.renderer.domElement);
    } else {
      console.error('Div with ID "gl" not found');
    }

    this.camera.position.z = 5;

    this.addObjects()

  }


  addObjects() {


    this.backgroundMaterial = new ShaderMaterial({
        extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
        uniforms: {
            u_time: { value: 0 },
            u_progress: { value: 0 },
            u_progress2: { value: 0 },
            u_shift: { value: 0 },
            u_resolution: { value: new Vector4(0,0,0,0) },
            u_transition_type: { value: 1 },
            // u_chain: { value: this.displacementTexture },
            
            u_current: { 
              value: {
                type: 0, // Set a default type (e.g., 0 for empty)
                color: new Color(0x000000), // Default to black color
                texture: null,

                  // type: this.detailed.type,
                  // color: new Color(this.detailed.color),
                  // texture: this.detailed.texture,
                  
              }
          },
          u_next: { 
              value: {
                type: 0, // Set a default type (e.g., 0 for empty)
                color: new Color(0x000000), // Default to black color
                texture: null,

                  // type: this.detailed.type,
                  // color: new Color(this.detailed.color),
                  // texture: this.detailed.texture,
              }
          }

        },
        vertexShader: vertex,
        fragmentShader: fragment
    });


    this.backgroundGeometry = new PlaneGeometry(1, 1, 1, 1);
    this.backgroundPlane = new Mesh(this.backgroundGeometry, this.backgroundMaterial);
    this.scene.add(this.backgroundPlane);

    
}

resize() {





  this.renderer.setSize(this.context.width, this.context.height);
  this.camera.aspect = this.context.width / this.context.height;


  const dist  = this.camera.position.z;
  const height = 1;
  this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));




this.backgroundPlane.scale.x = this.camera.aspect;
this.backgroundPlane.scale.y = 1;







  this.imageAspect = 1920/1080;
  let a1; let a2;


  if(this.context.width/this.context.height>this.imageAspect) {


    a1 = 1;
    a2 = (this.context.height/this.context.width) * this.imageAspect;


         } else{
 
    a1 = (this.context.width/this.context.height) / this.imageAspect
    a2 = 1;


  }



  this.backgroundMaterial.uniforms.u_resolution.value.x = this.context.width;
  this.backgroundMaterial.uniforms.u_resolution.value.y = this.context.height;
  this.backgroundMaterial.uniforms.u_resolution.value.z = a1;
  this.backgroundMaterial.uniforms.u_resolution.value.w = a2;


  this.camera.updateProjectionMatrix();
}


  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);

  }



  getScene() {
    return this.scene;
  }
}
