uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float uScroll;
uniform float uScrollDelta;
uniform float uAmplitude;

varying vec2 vUv;
varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 tempUV = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;

  if (quadAspect < textureAspect) {
    tempUV *= vec2(quadAspect / textureAspect, 1.0);
  } else {
    tempUV *= vec2(1.0, textureAspect / quadAspect);
  }

  tempUV += vec2(0.5);
  return tempUV;
}

void main() {
  vec2 correctUV = getUV(vUv, uTextureSize, vSize);
  vec2 displacedUv = correctUV + texture2D(uDisplacement, correctUV).rg * 0.01 * uAmplitude * uScrollDelta;
  vec4 color = texture2D(uTexture, displacedUv);

  gl_FragColor = color;
}
