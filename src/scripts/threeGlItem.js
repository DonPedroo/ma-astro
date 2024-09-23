// Item
class Item {
    constructor(el, context) {

      this.context = context;
      this.scroll = 0;
      this.DOM = el.element;
      this.type = this.DOM.getAttribute('data-type'); 
      this.background = this.DOM.getAttribute('data-bg'); 
      this.flag = this.DOM.getAttribute('data-param');
  

      this.currentScroll = 0;
      this.animated = false;
      this.isBeingAnimatedNow = false;
      this.shouldRollBack = false;
      this.shouldUnRoll = false;
      this.positions = [];
  
      // set the initial values
      this.getSize();
      this.mesh = context.createMesh({
        width: this.width,
        height: this.height,
        type: this.type, 
        background: this.background,
        flag: this.flag
      });
      console.log("this.context",this.context.scene.scene)
      this.context.scene.scene.add(this.mesh);

      this.mesh.position.x = (((this.left) + (this.width / 2)) / this.windowWidth - 0.5) * (this.windowWidth / this.windowHeight);


    //   console.log('item',this.mesh,this.context.context.scene);
      // use the IntersectionObserver API to check when the element is inside the viewport
      // only then the element translation will be updated
      this.intersectionRatio;
      let options = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      };
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          this.positions.push(entry.boundingClientRect.y);
          let compareArray = this.positions.slice(
            this.positions.length - 2,
            this.positions.length
          );
          let down = compareArray[0] > compareArray[1] ? true : false;
  
          this.isVisible = entry.intersectionRatio > 0.0;
  
          this.shouldRollBack = false;
          this.shouldUnRoll = false;
          if (
            entry.intersectionRatio < 0.5 &&
            entry.boundingClientRect.y > 0 &&
            this.isVisible &&
            !down
          ) {
            this.shouldRollBack = true;
          }
  
          if (
            entry.intersectionRatio > 0.5 &&
            entry.boundingClientRect.y > 0 &&
            this.isVisible
          ) {
            this.shouldUnRoll = true;
          }
          // console.log(this.isVisible,'vis');
          this.mesh.visible = this.isVisible;
        });
      }, options);
      this.observer.observe(this.DOM);

    }
  
    getSize(s) {

      const bounds = this.DOM.getBoundingClientRect();
      const fromTop = bounds.top;
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      const withoutHeight = fromTop - this.windowHeight;
      const withHeight = fromTop + bounds.height;
      this.insideTop = withoutHeight;
      this.insideRealTop = fromTop;
      this.insideBottom = withHeight;
      this.width = bounds.width;
      this.height = bounds.height;
      this.left = bounds.left;

      if (s) {
        this.left +=s
      }
      

    }

    cleanup() {
        // Dispose of the material
        if (this.mesh.material) {
          this.mesh.material.dispose();
        }
      
        // Dispose of the geometry
        if (this.mesh.geometry) {
          this.mesh.geometry.dispose();
        }
      
        // Dispose of textures if any
        if (this.mesh.material.map) {
          this.mesh.material.map.dispose();
        }
      
        // Remove mesh from the scene
        if (this.context && this.context.context.scene) {
          this.context.context.scene.remove(this.mesh);
        }
      }
      

  }
  
  export default Item;