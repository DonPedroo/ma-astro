uniform float u_time;
uniform float u_progress;
uniform float u_progress2;

uniform vec4 u_resolution;
uniform float u_shift;

// uniform sampler2D u_chain;

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

// vec4 chain = texture2D(u_chain, vec2(newUV.x, newUV.y - mix(-1.0, 1., u_progress2)));

       vec2 readyUV = vec2(newUV.x+u_shift, newUV.y);

    vec4 t1;
    if (u_current.type == 3) { 
        t1 = vec4(u_current.color, 1.0);
    } else {

        t1 = texture2D(u_current.texture, mirrored(readyUV));


    }


    vec4 t2;
    if (u_next.type == 3) { 
        t2 = vec4(u_next.color, 1.0);
    } else {

        t2 = texture2D(u_next.texture, mirrored(readyUV));
    }

    gl_FragColor = mix(t1, t2,  step( vUv.y,u_progress));
    gl_FragColor = mix(gl_FragColor, darkOverlayColor, u_shift);

    // gl_FragColor = gl_FragColor+chain;


//  vec4 test = texture2D(u_current.texture,mirrored(fract(readyUV*2.4)));

    gl_FragColor = gl_FragColor*vec4(.4,1.,.1,1.);

    // gl_FragColor = vec4(vUv,.1,1.);










}
