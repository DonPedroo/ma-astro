
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;

uniform float uVelo;

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;
vec2 newUV = uv;


    vec4 color = texture2D(uGrid,newUV);


    float dist = distance(newUV,vec2(uMouse.x,(1.-uMouse.y)));
    dist = 1.-(smoothstep(0.,3.*uVelo,dist));


    color.rg+=uDeltaMouse*dist;

    float uRelaxation =  0.91;
    color.rg*=uRelaxation;
    color.a = 1.;
    gl_FragColor = color;
}