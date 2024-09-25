uniform vec2 u_mouseDir;
uniform sampler2D u_tex; 

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Get displacement from texture
    vec4 displacement = texture2D(u_tex, uv);
    float dispMag = length(displacement.rg);

    // Invert the x component of the mouse direction to align with texture coordinates
    vec2 adjustedMouseDir = vec2(-u_mouseDir.x, u_mouseDir.y);

    // Adjust displacement to align with mouse direction
    vec2 finalDisplacement = adjustedMouseDir * dispMag;
    vec2 finalUvs = uv + finalDisplacement * 0.3;

    // --- RGB Shift Effect Implementation ---

    // Separate UVs for each color channel
    vec2 redUvs = finalUvs;
    vec2 greenUvs = finalUvs;
    vec2 blueUvs = finalUvs;    

    // The shift follows the displacement direction but with reduced intensity
    vec2 shift = displacement.rg * 0.01;

    // Displacement strength based on the magnitude of displacement
    float displacementStrength = length(displacement.rg);
    displacementStrength = clamp(displacementStrength, 0.0, 2.0);

    // Apply different strengths to each color channel
    float redStrength = 1.0 + displacementStrength * 30.25;
    redUvs += shift * redStrength;    

    float greenStrength = 1.0 + displacementStrength * 20.0;
    greenUvs += shift * greenStrength;

    float blueStrength = 1.0 + displacementStrength * 10.5;
    blueUvs += shift * blueStrength;

    // Sample the input texture at shifted UVs for each color channel
    float red = texture2D(inputBuffer, redUvs).r;
    float green = texture2D(inputBuffer, greenUvs).g;
    float blue = texture2D(inputBuffer, blueUvs).b;

    // Compose the final color
    vec4 finalImage = vec4(red, green, blue, 1.0);

    // Optionally, add a subtle brightness effect based on the displacement
    // outputColor = finalImage + vec4(displacement.r * 0.1);

        outputColor = finalImage;
        // outputColor = displacement;

}
