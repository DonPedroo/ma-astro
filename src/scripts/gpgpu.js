import {Uniform,Vector2} from 'three';

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import fragmentGPGPU from "./shader/fragmentGPGPU.glsl";
export class ThreeGPGPU {
    constructor(context, renderer) {
      this.context = context
      this.renderer = renderer
      this.size = Math.ceil(this.context.width/8)

      this.createGPGPURenderer()
      this.createDataTexture()
      this.createVariable()
      this.setRendererDependencies()
      this.initiateRenderer()

    }

    createGPGPURenderer() {
        this.gpgpuRenderer = new GPUComputationRenderer(
          this.size, //the size of the grid we want to create, in the example the size is 27
          this.size,
          this.renderer //the WebGLRenderer we are using for our scene
        )
      }
      createDataTexture() {
        this.dataTexture = this.gpgpuRenderer.createTexture()
      }
      
      createVariable() {
      
        // console.log("this.dataTexture",this.dataTexture)
        this.variable = this.gpgpuRenderer.addVariable('uGrid', fragmentGPGPU, this.dataTexture)
        this.variable.material.uniforms.uGridSize = new Uniform(this.size)
        this.variable.material.uniforms.uMouse = new Uniform(new Vector2(0, 0))
        this.variable.material.uniforms.uDeltaMouse = new Uniform(new Vector2(0, 0))
        this.variable.material.uniforms.uVelo = new Uniform()
      
        console.log("this.variable.material.uniforms",this.variable.material.uniforms)
      }
      
      setRendererDependencies() {
        this.gpgpuRenderer.setVariableDependencies(this.variable, [this.variable])
      }
      
      initiateRenderer() {
        this.gpgpuRenderer.init()
      }
      
      getTexture() {
        return this.gpgpuRenderer.getCurrentRenderTarget(this.variable).textures[0]
      }
}
  
      