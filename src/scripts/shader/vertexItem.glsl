uniform float time;
uniform float progress;
uniform vec4 resolution;

uniform vec2 u_textureResolution;
uniform vec2 u_resolution;

varying vec2 vUv;
uniform sampler2D texture1;

const float pi = 3.1415925;

vec2 resizeUvCover(vec2 uv, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
}

void main() {
    vUv = resizeUvCover(uv, u_textureResolution, u_resolution);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
