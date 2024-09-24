// src/scripts/threeScene.js
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh,PlaneGeometry,ShaderMaterial,Vector4,Color,LinearSRGBColorSpace,TextureLoader,LinearFilter,Uniform,Clock,Vector2 } from 'three';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import { EffectComposer,EffectPass, RenderPass, Effect,BlendFunction } from 'postprocessing';
import effectFragment from "./shader/effectFragment.glsl";
import grungeFragment from "./shader/effectGrunge.glsl";
import { ThreeGPGPU } from "./gpgpu";
import { ThreeGlItemManager } from "./threeGlItemManager";
import { gsap } from "gsap";
import { CustomEase } from 'gsap/CustomEase';

CustomEase.create('custom', 'M0,0 C0.16,0.67 0,1.01 1,1');
gsap.registerPlugin(CustomEase);



export class CustomEffect extends Effect {

	constructor() {

		super("CustomEffect", effectFragment, {

			blendFunction: BlendFunction.Normal,
			uniforms: new Map([
        ["u_mouse", new Uniform(new Vector2(-10,-10) )],
        ["uvRate", new Uniform(new Vector2(1,1) )],
        ["u_velo", new Uniform()],
        ["rval", new Uniform(.4)],
        ["gval", new Uniform(.6)],
        ["bval", new Uniform(.9)],
        ["disc_radius", new Uniform(.09)],
        ["border_size", new Uniform(.19)],

        ["dist_m", new Uniform(.002)],
        ["buvelo_ms", new Uniform(3.525)],
        ["u_tex", new Uniform(0.0)],

        
			])

		});

	}

}

export class GrungeEffect extends Effect {

	constructor() {

		super("GrungeEffect", grungeFragment, {

			blendFunction: BlendFunction.Normal,
			uniforms: new Map([
        ["u_time", new Uniform(0.0)],
        ["u_progress", new Uniform(0.0)],
        ["u_tex", new Uniform(0.0)],
        ["u_resolution", new Uniform(new Vector4(0.0))]


			])

		});

	}

}

export class ThreeScene {
  constructor(context) {
    this.context = context
    this.backgrounds =this.context.backgrounds;
    this.clock = new Clock();





    this.time = 0
    this.initScene();
    this.items = new ThreeGlItemManager(this.context,this)

    this.addCustomEffect()

    this.animate();
    this.resize()
    this.initUniforms()

    console.log("three js created !")

    

  }

 
initDetailed() {

  console.log("init Detailed GL")



  this.items.init()

    if(this.context.sceneInstance) {

        for (const item of this.items.items) {
        gsap.to(item.mesh.material.uniforms.u_progress, {value: 1, duration: 1, ease: "custom"}, "<")

    }

  





}

}

killDetailed() {
  
  console.log("kill Detailed GL")


  // this.items.items.forEach(item => {
  //   gsap.killTweensOf(item.mesh.position);
  // });

  this.items.items.forEach(item => {
    item.cleanup();
  });

      this.items.items = [];


}
  

  initUniforms() {



    this.backgroundMaterial.uniforms.u_current.value = {
      type: this.backgrounds[this.context.startPage].type,
      color: new Color(this.backgrounds[this.context.startPage].gl.color),
      texture: this.backgrounds[this.context.startPage].gl.texture,
  };

  this.backgroundMaterial.uniforms.u_next.value = {
    type: this.backgrounds[this.context.startPage+1].type,
    color: new Color(this.backgrounds[this.context.startPage+1].color),
    texture: this.backgrounds[this.context.startPage+1].gl.texture,
};

  }





  initScene() {

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, this.context.width / this.context.height, 0.1, 1000);
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false
    });    
    
    this.renderer.outputColorSpace = LinearSRGBColorSpace;

    this.renderer.setSize(this.context.width, this.context.height);

    this.gpgpu = new ThreeGPGPU(this.context, this.renderer);

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


    const textureLoader = new TextureLoader();
    textureLoader.load('/images/chain-gl.webp', (chainTexture) => {
      chainTexture.minFilter = LinearFilter;
      chainTexture.magFilter = LinearFilter;
    
      this.backgroundMaterial.uniforms.u_chain.value = chainTexture;
    });
  

    this.backgroundMaterial = new ShaderMaterial({
        extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
        uniforms: {
            u_time: { value: 0 },
            u_progress: { value: 0 },
            u_progress2: { value: 0 },
            u_shift: { value: 0 },
            u_resolution: { value: new Vector4(0,0,0,0) },
            u_transition_type: { value: 1 },
            u_chain: { value: null }, // Placeholder for chain texture
            u_chainProgress: { value: 0 }, 
            
            
            u_current: { 
              value: {
                type: 0, // Set a default type (e.g., 0 for empty)
                color: new Color(0x000000), // Default to black color
                texture: null,

                  
              }
          },
          u_next: { 
              value: {
                type: 0, // Set a default type (e.g., 0 for empty)
                color: new Color(0x000000), // Default to black color
                texture: null,

                 
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


  // this.grungePass.uniforms.get('u_resolution').value.x = this.context.width;
  // this.grungePass.uniforms.get('u_resolution').value.y = this.context.height;
  // this.grungePass.uniforms.get('u_resolution').value.z = a1;
  // this.grungePass.uniforms.get('u_resolution').value.w = a2;



  this.camera.updateProjectionMatrix();
}





addCustomEffect() {

 
  this.composer = new EffectComposer(this.renderer);
  const renderPass = new RenderPass(this.scene, this.camera);
  this.composer.addPass(renderPass);

  this.customPass = new CustomEffect();
  this.customEff = new EffectPass(this.camera, this.customPass);
  this.composer.addPass(this.customEff);

}

animate() {
  requestAnimationFrame(this.animate.bind(this));
  this.time = this.clock.getElapsedTime(); // Continuous increasing time

  this.composer.render(this.time);

  if (this.gpgpu) {

 
  if (this.gpgpu.gpgpuRenderer) {
    this.gpgpu.gpgpuRenderer.compute()
    this.customPass.uniforms.get('u_tex').value = this.gpgpu.getTexture()
  }

}

}


  getScene() {
    return this.scene;
  }
}
