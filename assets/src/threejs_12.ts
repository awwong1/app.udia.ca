import * as THREE from 'three'
import { handleOnWindowResize } from './util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Lesson 12: Materials
 * https://threejs-journey.xyz/lessons/12
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
  const loadingManager = new THREE.LoadingManager()
  // loadingManager.onStart = () => { console.log('loading started') }
  // loadingManager.onLoad = () => { console.log('loading finished') }
  // loadingManager.onProgress = () => { console.log('loading progressing') }
  // loadingManager.onError = () => { console.log('error occurred') }
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const doorColorTexture = textureLoader.load('/threejs/door/color.jpg')
  const doorAlphaTexture = textureLoader.load('/threejs/door/alpha.jpg')
  const doorHeightTexture = textureLoader.load('/threejs/door/height.png')
  const doorNormalTexture = textureLoader.load('/threejs/door/normal.jpg')
  const doorAmbientOcclusionTexture = textureLoader.load('/threejs/door/ambientOcclusion.jpg')
  const doorMetalnessTexture = textureLoader.load('/threejs/door/metalness.jpg')
  const doorRoughnessTexture = textureLoader.load('/threejs/door/roughness.jpg')
  const matcapTexture = textureLoader.load('/threejs/matcaps/8.png')
  const gradientTexture = textureLoader.load('/threejs/gradients/5.jpg')

  const canvas = <HTMLCanvasElement | null>document.getElementById('canvas')
  if (canvas === null) return
  const scene = new THREE.Scene()

  // Mesh Basic Material
  // const material = new THREE.MeshBasicMaterial()
  // material.map = doorColorTexture
  // material.color = new THREE.Color('rebeccapurple')
  // material.wireframe = true
  // material.transparent = true
  // material.opacity = 0.5
  // material.alphaMap = doorAlphaTexture
  // material.side = THREE.FrontSide
  // material.side = THREE.BackSide
  // material.side = THREE.DoubleSide

  // Mesh Normal Material
  // const material = new THREE.MeshNormalMaterial()
  // material.flatShading = true

  // Matcap Material
  // https://github.com/nidorx/matcaps
  // const material = new THREE.MeshMatcapMaterial()
  // material.matcap = matcapTexture

  // Mesh Depth Material
  // const material = new THREE.MeshDepthMaterial()

  // Light reactive materials begin here
  // const material = new THREE.MeshLambertMaterial()
  // const material = new THREE.MeshPhongMaterial() // less efficient than lambert material

  // const material = new THREE.MeshToonMaterial()
  // material.gradientMap = gradientTexture
  // gradientTexture.minFilter = THREE.NearestFilter
  // gradientTexture.magFilter = THREE.NearestFilter
  // gradientTexture.generateMipmaps = false

  const material = new THREE.MeshStandardMaterial()
  material.metalness = 0.45
  material.roughness = 0.65
  material.map = doorColorTexture

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.x = 2
  pointLight.position.y = 3
  pointLight.position.x = 4
  scene.add(pointLight)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
  )
  sphere.position.x = -1.5
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
  )
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 64, 128),
    material
  )
  torus.position.x = 1.5
  scene.add(sphere, plane, torus)

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

  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
  torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

  material.aoMap = doorAmbientOcclusionTexture
  material.aoMapIntensity = 1
  material.displacementMap = doorHeightTexture

  material.displacementScale = 0.05
  material.metalnessMap = doorMetalnessTexture
  material.roughnessMap = doorRoughnessTexture
  material.metalness = 0
  material.roughness = 1
  material.normalMap = doorNormalTexture
  material.normalScale.set(0.5, 0.5)
  material.transparent = true
  material.alphaMap = doorAlphaTexture

  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000
    sphere.rotation.y = elapsedTime * Math.PI * 0.0001
    plane.rotation.y = elapsedTime * Math.PI * 0.0001
    torus.rotation.y = elapsedTime * Math.PI * 0.0001

    sphere.rotation.x = elapsedTime * Math.PI * 0.00015
    plane.rotation.x = elapsedTime * Math.PI * 0.00015
    torus.rotation.x = elapsedTime * Math.PI * 0.00015

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