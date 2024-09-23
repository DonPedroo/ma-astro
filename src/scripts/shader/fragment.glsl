uniform float u_time;
uniform float u_progress;
uniform float u_chainProgress;

uniform vec4 u_resolution;
uniform float u_shift;

uniform sampler2D u_chain;
uniform sampler2D u_grunge;

struct Background {
    int type;
    vec3 color;
    sampler2D texture;
};
uniform Background u_current;
uniform Background u_next;
varying vec2 vUv;

vec2 mirrored(vec2 v) {

	vec2 m = mod(v,2.);
	return mix(m,2.-m,step(1.,m));

}


void main() {
    vec4 darkOverlayColor = vec4(0.0, 0.0, 0.0, 1.0);



vec2 newUV = (vUv - vec2(0.5))*u_resolution.zw + vec2(0.5);


       vec2 readyUV = vec2(newUV.x, newUV.y);
vec4 grungeMask;
    vec4 t1;
    if (u_current.type == 4) { 
        t1 = vec4(u_current.color, 1.0);
    }
     else if (u_current.type == 3) { 

        
        t1 = texture2D(u_current.texture, mirrored(fract(readyUV*2.4)));
                // t1 = texture2D(u_grunge, mirrored(readyUV));

                grungeMask = mix(vec4(1.0),vec4(0.,0.,0.,1.), step( vUv.y,u_progress));

    }
    
     else {

        t1 = texture2D(u_current.texture, mirrored(readyUV));


    }


    vec4 t2;
    if (u_next.type == 4) { 
        t2 = vec4(u_next.color, 1.0);
    }
    else if (u_next.type == 3) { 
        t2 = texture2D(u_next.texture, mirrored(fract(readyUV*2.4)));
                // t2 = texture2D(u_grunge, mirrored(readyUV));
                grungeMask = mix(vec4(0.,0.,0.,1.),vec4(1.0), step( vUv.y,u_progress));

    }
     else {

        t2 = texture2D(u_next.texture, mirrored(readyUV));
    }

    gl_FragColor = mix(t1, t2,  step( vUv.y,u_progress));
    gl_FragColor = mix(gl_FragColor, darkOverlayColor, u_shift);






   vec2 chainUV = vec2(newUV.x,newUV.y- mix(-1.0, 1., u_chainProgress*.99));
    vec2 chainColorUV = vec2(chainUV.x * 0.5, chainUV.y);
    vec4 chainColor = texture2D(u_chain, chainColorUV);

    // Sample the second half of the texture (chain mask part)
    vec2 chainMaskUV = vec2(0.5 + chainUV.x * 0.5, chainUV.y);
    vec4 chainMask = texture2D(u_chain, chainMaskUV);

    chainMask*=grungeMask;

    // Apply the chain mask to the chain color (using red channel of the mask)
    vec4 chainFinalColor = mix( gl_FragColor,  chainColor, chainMask.r);

    // Output the final color
    gl_FragColor = chainFinalColor;


    // vec4 tedt = texture2D(u_grunge, newUV);

    // gl_FragColor = grungeMask;




}
