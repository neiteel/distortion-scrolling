varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
varying vec2 vSize;

void main() {
  vec3 newPosition = position;
  vSize = uResolution;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
}
