import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * Lesson 15: Shadows
 * https://threejs-journey.xyz/lessons/15
 * 
 * Only three types of lights support the shadows.
 * PointLight, DirectionalLight, and SpotLight
 */
const main = () => {
  // Debug
  const gui = new dat.GUI()

  // Canvas
  const canvas = <HTMLCanvasElement | null>document.getElementById('canvas')
  if (canvas === null) return

  // Scene
  const scene = new THREE.Scene()

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  const alFolder = gui.addFolder("ambientLight")
  alFolder.add(ambientLight, "intensity").min(0).max(1).step(0.01)
  alFolder.addColor(ambientLight, "color").onChange((c) => ambientLight.color = c)

  const directionalLight = new THREE.DirectionalLight(0x663399, 0.3)
  scene.add(directionalLight)
  directionalLight.position.set(2, 2, -1)
  // must manually set the light that will cast a shadow
  directionalLight.castShadow = true
  const dlFolder = gui.addFolder("directionalLight")
  dlFolder.add(directionalLight, "intensity").min(0).max(1).step(0.01)
  dlFolder.addColor(directionalLight, "color").onChange((c) => directionalLight.color = c)
  dlFolder.add(directionalLight.position, 'x', -3, 3, 0.01)
  dlFolder.add(directionalLight.position, 'y', -3, 3, 0.01)
  dlFolder.add(directionalLight.position, 'z', -3, 3, 0.01)

  // keep width and height a power of 2 for mipmapping
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 7
  directionalLight.shadow.camera.top = 1
  directionalLight.shadow.camera.right = 1
  directionalLight.shadow.camera.bottom = - 1
  directionalLight.shadow.camera.left = -1
  directionalLight.shadow.radius = 10

  const spotLight = new THREE.SpotLight(0x663399, 0.3, 10, Math.PI * 0.3)
  spotLight.castShadow = true
  const slFolder = gui.addFolder("spotLight")
  slFolder.add(spotLight, "intensity").min(0).max(1).step(0.01)
  slFolder.addColor(spotLight, "color").onChange((c) => spotLight.color = c)
  slFolder.add(spotLight.position, 'x', -3, 3, 0.01)
  slFolder.add(spotLight.position, 'y', -3, 3, 0.01)
  slFolder.add(spotLight.position, 'z', -3, 3, 0.01)
  spotLight.position.set(0, 2, 2)
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 6
  spotLight.shadow.camera.fov = 30
  spotLight.shadow.radius = 10
  scene.add(spotLight)
  scene.add(spotLight.target)

  const pointLight = new THREE.PointLight(0x663399, 0.3)
  pointLight.castShadow = true
  const plFolder = gui.addFolder("pointLight")
  plFolder.add(pointLight, "intensity").min(0).max(1).step(0.01)
  plFolder.addColor(pointLight, "color").onChange((c) => pointLight.color = c)
  plFolder.add(pointLight.position, 'x', -3, 3, 0.01)
  plFolder.add(pointLight.position, 'y', -3, 3, 0.01)
  plFolder.add(pointLight.position, 'z', -3, 3, 0.01)
  pointLight.position.set(-1, 1, 0)
  pointLight.shadow.mapSize.width = 1024
  pointLight.shadow.mapSize.height = 1024
  pointLight.shadow.camera.near = 0.1
  pointLight.shadow.camera.far = 4
  scene.add(pointLight)

  /**
   * Helpers
   */
  const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  scene.add(directionalLightCameraHelper)
  directionalLightCameraHelper.visible = false
  dlFolder.add(directionalLightCameraHelper, 'visible', false)

  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
  scene.add(spotLightCameraHelper)
  spotLightCameraHelper.visible = false
  slFolder.add(spotLightCameraHelper, 'visible', false)

  const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
  scene.add(pointLightCameraHelper)
  pointLightCameraHelper.visible = false
  plFolder.add(pointLightCameraHelper, 'visible', false)

  /**
   * Materials
   */
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7
  const matFolder = gui.addFolder('material')
  matFolder.add(material, 'metalness').min(0).max(1).step(0.001)
  matFolder.add(material, 'roughness').min(0).max(1).step(0.001)

  // Objects
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  )
  // manual set sphere to cast a shadow
  sphere.castShadow = true

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
  )
  plane.rotation.x = - Math.PI * 0.5
  plane.position.y = - 0.65
  // manually set the plane to receive the shadow
  plane.receiveShadow = true

  // scene.add(sphere, cube, torus, plane)
  scene.add(sphere, plane)

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2
  scene.add(camera)

  // cannot use the #canvas element due to css grid wrapper overlay
  const wrapper: HTMLElement = <HTMLElement>document.querySelector('#wrapper')
  if (!wrapper) return
  const controls = new OrbitControls(camera, wrapper)
  controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  renderer.shadowMap.enabled = true
  // renderer.shadowMap.enabled = false

  // There are four different shadow map algorithms
  // THREE.BasicShadowMap - very efficient but bad quality
  // THREE.PCFShadowMap - less efficient but smoother edges (default)
  // THREE.PCFSoftShadowMap = less efficient but even smoother edges
  // THREE.VSMSoftShadowMap - very inefficient, more constraints, may have unexpected results

  // renderer.shadowMap.type = THREE.BasicShadowMap
  renderer.shadowMap.type = THREE.PCFShadowMap
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // renderer.shadowMap.type = THREE.VSMShadowMap

  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  /**
   * Animate
   */
  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    // cube.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    // cube.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }
  window.requestAnimationFrame(tick)
}

if (document.readyState === 'complete') {
  main()
} else {
  window.addEventListener('load', main)
}
