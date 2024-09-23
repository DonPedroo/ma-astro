// src/scripts/threeScene.js
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh,PlaneGeometry,ShaderMaterial,Vector4,Color,LinearSRGBColorSpace,TextureLoader,LinearFilter,Uniform,Clock,Vector2,Vector3 } from 'three';
import fragment from "./shader/fragmentItem.glsl";
import vertex from "./shader/vertexItem.glsl";
import Item from './threeGlItem.js'; 

export class ThreeGlItemManager {
    constructor(context,scene) {
      this.context = context
      this.scene = scene
      this.items = [];
      // console.log("ThreeGlItemManager init",this.context,this.scene)
     
    }

    init() {

      this.addObjects()
      this.createItems()

    }


    addObjects() {
      
      this.geometry = new PlaneGeometry(1, 1, 1, 1);
      this.material = new ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        // side: DoubleSide,
        uniforms: {
          u_time: { value: 0 },
          u_texture: { value: null },
          u_color:  { value: new Color(0x000000)},
          u_type: { value: 1 },
          u_reveal: { value: 0 },
          u_progress: { value: 0 },
          u_textureResolution: { value: new Vector2(1,1) },
          u_resolution: { value: new Vector2(1,1) },
        },
        // wireframe: true,
        // transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment
      });

  
    }

    createMesh(o) {

      // console.log("createMesh >>", o);
      let material = this.material.clone();

      material.uniforms.u_type.value = (o.type === 'image' || o.type === 'video') ? 1 : 0;

      if (o.type === 'image') {
        let loader = new TextureLoader();
        loader.load(o.background, function(texture) {
          material.uniforms.u_texture.value = texture;
          material.needsUpdate = true;
          material.uniforms.u_textureResolution.value = new Vector2(texture.image.width, texture.image.height);
          material.uniforms.u_resolution.value = new Vector2(o.width, o.height);
      }.bind(this));
      } else if (o.type === 'video') {
        let video = document.createElement('video');
        video.src = o.background;
        video.loop = true;
        video.muted = true;
        video.load(); 
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('preload', 'auto');
        video.pause();
        video.classList.add('hidden');
        document.body.appendChild(video);
    
        let videoTexture = new VideoTexture(video);
        material.uniforms.u_texture.value = videoTexture;
      } else if (o.type === 'color') {
        // If type is color, set color value
        let color = new Color(o.background);
        material.uniforms.u_color.value = new Vector3(color.r, color.g, color.b);
        if (o.flag === 'reveal') {

          material.uniforms.u_reveal.value = 1
          material.transparent = true;
        }
      }
  
      let mesh = new Mesh(this.geometry, material);
      mesh.scale.x = (o.width/window.innerWidth)*(window.innerWidth/window.innerHeight);
      // mesh.scale.y = (o.height/window.innerHeight);
      mesh.scale.y = 1


      mesh.position.x = (((o.left - this.currentScroll) + (o.width / 2)) / this.w - 0.5) * (this.asp)


      // console.log("scale x", mesh.scale.x, "scale y", mesh.scale.y);
      return mesh;

    }


    createItems() {


      
      const el = document.querySelectorAll('[data-slider-gl]');
    
      el.forEach(el => {
        const item = {
          element: el, 
          
        };
        this.items.push(new Item(item, this));
      });

      console.log("ThreeItems this.items",this.items)

    
    }
    


}  