uniform vec2 u_mouse;
// uniform vec2 uvRate;
// uniform float u_velo;
// uniform float rval;
// uniform float gval;
// uniform float bval;
// uniform float disc_radius; 
// uniform float border_size;
uniform sampler2D u_tex;

// this uniforms are for mouse cursor circle if enabled
// uniform float dist_m; 
// uniform float buvelo_ms;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

// // first we need to calculate correct proportions
// // we need to reasign uv coordinates to a new value
// // since it is not possible to modify preset uv
// vec2 _uv = uv;
// // calculating proportions here:
// _uv = ((uv - 0.5)*uvRate)+0.5;
// // we need another uv for the rgb shift effect, we do not
// // need it to be proportional, but we still have to
// // asign new uv uniform
// vec2 newUV = uv;	
// // mosue
// float dist = distance(vec2(u_mouse.x, ((1. -u_mouse.y) -0.5)*uvRate.y +0.5), _uv);
// // active area
// float c = smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
// // 3 colors separated
// float r = texture2D(inputBuffer, newUV.xy += c * (u_velo * rval)).x;
// float g = texture2D(inputBuffer, newUV.xy += c * (u_velo * gval)).y;
// float b = texture2D(inputBuffer, newUV.xy += c * (u_velo * bval)).z;
// // colors combined back
// vec4 color = vec4(r, g, b, 1.);

// // //this is mouse cursor
// // if (dist<dist_m+(uVelo / buvelo_ms)) {
// // 	color = vec4(1.000,0.833,0.224,1.);
// // }

// outputColor = vec4(color);

    vec4 displacement = texture2D(u_tex,uv);
    vec2 finalUvs = uv + displacement.rg*0.1;
    vec4 finalImage = texture2D(inputBuffer,finalUvs);
outputColor = finalImage+vec4(displacement.r*.1);


}