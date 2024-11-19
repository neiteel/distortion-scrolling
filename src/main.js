import './style.css'
import GUI from 'lil-gui'
import * as THREE from 'three'
import Lenis from 'lenis'
import { lerp } from './math'
import fragmentShader from './shaders/fragment.glsl?raw'
import vertexShader from './shaders/vertex.glsl?raw'

const gui = new GUI()

const lenis = new Lenis()

lenis.on('scroll', ({ scroll }) => {
  const scrollAmount =
    scroll / (document.body.scrollHeight - window.innerHeight)
  material.uniforms.uScroll.value = scrollAmount
})

const width = window.innerWidth
const height = window.innerHeight
const distance = 1000
const FOV = (2 * Math.atan(height / 2 / distance) * 180) / Math.PI
const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, distance)
camera.position.z = distance

const scene = new THREE.Scene()

const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 1.0 },
    uProgress: { value: 0 },
    uTexture: { value: null },
    uTextureSize: { value: new THREE.Vector2(100, 100) },
    uDisplacement: { value: null },
    uScroll: { value: 0 },
    uScrollDelta: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
    uQuadSize: { value: new THREE.Vector2(300, 300) },
    uAmplitude: { value: 0.5 },
  },
})

const textureLoader = new THREE.TextureLoader()
material.uniforms.uTexture.value = textureLoader.load(
  'https://fastly.picsum.photos/id/235/5000/3333.jpg?hmac=i9YaRj_AF62lGVYNlYhdL2gqRDxoUzypXLUXBj8ihCc'
)
material.uniforms.uDisplacement.value = textureLoader.load('displacement.png')

const mesh = new THREE.Mesh(geometry, material)
mesh.scale.set(width, height * 2, 1)
scene.add(mesh)

const setPosition = (scroll) => (mesh.position.y = scroll - height / 2)

const backgroundGui = gui.addFolder('Background')
backgroundGui
  .add(material.uniforms.uAmplitude, 'value', 0, 1)
  .name('uAmplitude')

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(width, height)
renderer.setAnimationLoop(animate)

let smoothScrollDelta = 0
const damping = 0.1
function animate(time) {
  lenis.raf(time)
  setPosition(lenis.scroll)

  const currentDelta = lenis.velocity || 0
  smoothScrollDelta = lerp(smoothScrollDelta, currentDelta, damping)
  material.uniforms.uScrollDelta.value = smoothScrollDelta

  renderer.render(scene, camera)
}
