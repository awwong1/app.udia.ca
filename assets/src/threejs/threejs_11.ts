import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Lesson 11: Textures
 * https://threejs-journey.xyz/lessons/11
 * 
 * Physically Based Rendering (PBR): follow real-life directions to get realistic results
 * https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
 * https://marmoset.co/posts/physically-based-rendering-and-you-can-too/
 * @returns void
 */
const main = () => {
  /**
   * Textures
   */
  // old fashioned way of doing it
  // const image = new Image()
  // const texture = new THREE.Texture(image)
  // image.addEventListener('load', () => {
  //   texture.needsUpdate = true
  // })
  // image.src = '/threejs/11/color.jpg'

  const loadingManager = new THREE.LoadingManager()
  // loadingManager.onStart = () => { console.log('loading started') }
  // loadingManager.onLoad = () => { console.log('loading finished') }
  // loadingManager.onProgress = () => { console.log('loading progressing') }
  // loadingManager.onError = () => { console.log('error occurred') }
  const textureLoader = new THREE.TextureLoader(loadingManager)
  // const colorTexture = textureLoader.load('/threejs/door/checkerboard-1024x1024.png')
  // const colorTexture = textureLoader.load('/threejs/door/checkerboard-8x8.png')
  const colorTexture = textureLoader.load('/threejs/door/minecraft.png')
  // const colorTexture = textureLoader.load('/threejs/door/color.jpg')
  const alphaTexture = textureLoader.load('/threejs/door/alpha.jpg')
  const heightTexture = textureLoader.load('/threejs/door/height.png')
  const normalTexture = textureLoader.load('/threejs/door/normal.jpg')
  const ambientOcclusionTexture = textureLoader.load('/threejs/door/ambientOcclusion.jpg')
  const metalnessTexture = textureLoader.load('/threejs/door/metalness.jpg')
  const roughnessTexture = textureLoader.load('/threejs/door/roughness.jpg')

  // colorTexture.repeat.x = 2
  // colorTexture.repeat.y = 3
  // colorTexture.wrapS = THREE.MirroredRepeatWrapping
  // colorTexture.wrapT = THREE.RepeatWrapping

  // colorTexture.offset.x = 0.5
  // colorTexture.offset.y = 0.5

  // colorTexture.rotation = Math.PI * 0.25
  // colorTexture.center.x = 0.5
  // colorTexture.center.y = 0.5

  // when using Nearest Filter, mipmaps are not necessary
  colorTexture.generateMipmaps = false
  colorTexture.minFilter = THREE.NearestFilter
  colorTexture.magFilter = THREE.NearestFilter

  /**
   * File size:
   * - jpg: lossy compression but usually lighter
   * - png: lossless compression but usually heavier
   * - basis?
   */

  /**
   * Image dimensions:
   * each pixel of the texture will have to be stored on the GPU regardless of the file size
   * reduce the number of pixels as much as possible
   * Mipmapping prefers power of 2 textures
   */

  /**
   * Textures support transparency but can't do this in jpg
   * normal texture should not use lossy compression (use png)
   * sometimes we can combine different data into one texture using the red, green, blue, and alpha channels separately
   */

  /**
   * poliigon.com
   * 3dtextures.me
   * arroway-textures.ch
   */

  const canvas = <HTMLCanvasElement | null>document.getElementById('canvas')
  if (canvas === null) return
  const scene = new THREE.Scene()

  // UV Unwrapping
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
  // const geometry = new THREE.SphereBufferGeometry(1, 32, 32)
  // const geometry = new THREE.ConeBufferGeometry(1, 1, 32)
  // const geometry = new THREE.TorusBufferGeometry(1, 0.35, 32, 100)
  const material = new THREE.MeshBasicMaterial({ map: colorTexture })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const axesHelper = new THREE.AxesHelper(5) // unit
  scene.add(axesHelper)

  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 500)
  scene.add(camera)
  camera.position.set(5, 5, 5)

  // cannot use the #canvas element due to css grid wrapper overlay
  const wrapper: HTMLElement = <HTMLElement>document.querySelector('#wrapper')
  if (!wrapper) return
  const controls = new OrbitControls(camera, wrapper)
  controls.enableDamping = true

  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000
    mesh.rotation.y = elapsedTime * Math.PI * 0.0001
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  window.requestAnimationFrame(tick)
}

if (document.readyState === 'complete') {
  main()
} else {
  window.addEventListener('load', main)
}