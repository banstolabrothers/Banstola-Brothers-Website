export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uProgress;
  uniform vec3 uColor;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  void main() {
    float n = noise(vUv * 5.0);
    float edge = 0.185;
    float dissolve = smoothstep(1.0 - uProgress - edge, 1.0 - uProgress + edge, n);
    float alpha = 1.0 - dissolve;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
