uniform float u_progress;
uniform float u_time;
uniform vec4 u_resolution;


uniform sampler2D u_tex;

uniform float noise_amount;


#define M_PI 3.1415926535897932384626433832795
#define SPEED 6.2
#define MEAN 0
#define VARIANCE .66

// gaussain noise
float gaussian(float z, float u, float o) {
    return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
}

// multiply  blending mode fu
vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {



      vec2 newUV = (uv - vec2(0.5))*u_resolution.zw + vec2(0.5);

   // vec2 warpedUV = warp(uv,vec2(-.075));

    // Sample the texture with the distorted UVs
    vec4 color = texture2D(u_tex, fract(newUV*2.4));


    // Output the final color
   //  outputColor = color;
	   //  outputColor = color;


    float t = u_time * float(SPEED);
    float seed = dot(uv, vec2(12.9898, 78.233));
    float noise = fract(sin(seed) * 43758.5453 + t);

vec3 colorBlended = blendMultiply(color.rgb,vec3(noise), .35);

outputColor = vec4(colorBlended,1.);
// outputColor = vec4(vec3(noise),1.);
outputColor = vec4(vec3(mix(color.rgb*1.5,color.rgb,vec3(noise))),1.);

}
