// void main()
// {
//     vec2 uv = gl_FragCoord.xy/resolution.xy;

//     vec4 color = texture(uGrid,uv);

//     color.r = 1.;
//     color.a = 1.;

//     // vec4 test = vec4(1.,.3,.1,1.);
    
//     gl_FragColor = color;
// }


uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uVelo;


void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    vec4 color = texture2D(uGrid,uv);
        // vec4 color = vec4(1.,1.,1.,1.);


    float dist = distance(uv,vec2(uMouse.x,(1.-uMouse.y)));
    dist = 1.-(smoothstep(0.,3.*uVelo,dist));


    color.rg+=uDeltaMouse*dist;

    float uRelaxation =  0.965;
    color.rg*=uRelaxation;
    color.a = 1.;
    gl_FragColor = color;
}