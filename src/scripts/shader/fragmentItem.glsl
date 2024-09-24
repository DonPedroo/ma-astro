uniform float u_time;
uniform float u_progress;
uniform sampler2D u_texture;
// uniform vec4 u_resolution;
uniform vec3 u_color;
uniform int u_type;
uniform int u_reveal;
varying vec2 vUv;


void main()	{

    vec4 color;

   

     if (u_type == 1) { 
        color = texture2D(u_texture,vUv);
 
    }
      else if (u_type == 2) { 
        color = texture2D(u_texture,fract(vUv*2.4));
 
    }
     else {
        color = vec4(u_color, 1.0);
    }

    if (u_reveal == 1) {
        color = mix(color, vec4(color.rgb,.0),  step( vUv.x,(1.-u_progress)));

        // color = vec4(color.rgb,1.);
    } 

    gl_FragColor = vec4(color);

    // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);



}