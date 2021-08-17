import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

/**
 * Lesson 14: Lights
 * https://threejs-journey.xyz/lessons/14
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
  // https://threejs.org/docs/?q=ambi#api/en/lights/AmbientLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const alFolder = gui.addFolder("ambientLight")
  alFolder.add(ambientLight, "intensity").min(0).max(1).step(0.01)
  alFolder.addColor(ambientLight, "color").onChange((c) => ambientLight.color = c)

  // https://threejs.org/docs/#api/en/lights/DirectionalLight
  const directionalLight = new THREE.DirectionalLight(0x663399, 0.3)
  scene.add(directionalLight)
  directionalLight.position.set(1, 0.25, 0)
  const dlFolder = gui.addFolder("directionalLight")
  dlFolder.add(directionalLight, "intensity").min(0).max(1).step(0.01)
  dlFolder.addColor(directionalLight, "color").onChange((c) => directionalLight.color = c)
  dlFolder.add(directionalLight.position, 'x', -3, 3, 0.01)
  dlFolder.add(directionalLight.position, 'y', -3, 3, 0.01)
  dlFolder.add(directionalLight.position, 'z', -3, 3, 0.01)

  // https://threejs.org/docs/?q=Light#api/en/lights/HemisphereLight
  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
  scene.add(hemisphereLight)
  const hlFolder = gui.addFolder("hemisphereLight")
  hlFolder.add(hemisphereLight, "intensity").min(0).max(1).step(0.01)
  hlFolder.addColor(hemisphereLight, 'color').onChange((c) => hemisphereLight.color = c)
  hlFolder.addColor(hemisphereLight, 'groundColor').onChange((c) => hemisphereLight.groundColor = c)

  // https://threejs.org/docs/?q=Light#api/en/lights/PointLight
  const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
  pointLight.position.set(2, 0, 1)
  scene.add(pointLight)
  const plFolder = gui.addFolder("pointLight")
  plFolder.add(pointLight, "intensity").min(0).max(1).step(0.01)
  plFolder.add(pointLight, "distance").min(0).max(10).step(0.1)
  plFolder.add(pointLight, "decay").min(0).max(10).step(0.1)
  plFolder.addColor(pointLight, "color").onChange((c) => pointLight.color = c)
  plFolder.add(pointLight.position, 'x', -3, 3, 0.01)
  plFolder.add(pointLight.position, 'y', -3, 3, 0.01)
  plFolder.add(pointLight.position, 'z', -3, 3, 0.01)

  // https://threejs.org/docs/?q=Light#api/en/lights/RectAreaLight
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt( 0, 0, 0 );
  scene.add(rectAreaLight)
  const rlFolder = gui.addFolder("rectAreaLight")
  rlFolder.add(rectAreaLight, "intensity").min(0).max(10).step(0.01)
  rlFolder.addColor(rectAreaLight, "color").onChange((c) => rectAreaLight.color = c)
  rlFolder.add(rectAreaLight, "width").min(0).max(3).step(0.01)
  rlFolder.add(rectAreaLight, "height").min(0).max(3).step(0.01)
  const rlPosFolder = rlFolder.addFolder("position")
  rlPosFolder.add(rectAreaLight.position, 'x', -3, 3, 0.01)
  rlPosFolder.add(rectAreaLight.position, 'y', -3, 3, 0.01)
  rlPosFolder.add(rectAreaLight.position, 'z', -3, 3, 0.01)
  const rlRotFolder = rlFolder.addFolder("rotation")
  rlRotFolder.add(rectAreaLight.rotation, 'x', -3, 3, 0.01)
  rlRotFolder.add(rectAreaLight.rotation, 'y', -3, 3, 0.01)
  rlRotFolder.add(rectAreaLight.rotation, 'z', -3, 3, 0.01)

  // https://threejs.org/docs/?q=Light#api/en/lights/SpotLight
  const spotLight =  new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
  spotLight.position.set(0, 2, 3)
  scene.add(spotLight)
  const slFolder = gui.addFolder("spotLight")
  slFolder.add(spotLight, "intensity").min(0).max(10).step(0.01)
  slFolder.addColor(spotLight, "color").onChange((c) => spotLight.color = c)
  slFolder.add(spotLight, "distance").min(0).max(10).step(0.1)
  slFolder.add(spotLight, "angle").min(0).max(Math.PI/2).step(0.01)
  slFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01)
  slFolder.add(spotLight, "decay").min(0).max(3).step(0.1)
  const slPosFolder = slFolder.addFolder('position')
  slPosFolder.add(spotLight.position, 'x', -3, 3, 0.01)
  slPosFolder.add(spotLight.position, 'y', -3, 3, 0.01)
  slPosFolder.add(spotLight.position, 'z', -3, 3, 0.01)
  // spotlight's target is separate from the spotLight itself as an object 3D
  scene.add(spotLight.target)
  const sltFolder = slFolder.addFolder('target')
  sltFolder.add(spotLight.target.position, 'x', -3, 3, 0.01)
  sltFolder.add(spotLight.target.position, 'y', -3, 3, 0.01)
  sltFolder.add(spotLight.target.position, 'z', -3, 3, 0.01)

  // lights are performance intensive, try to use as few lights as possible

  /**
   * Helpers
   */
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
  scene.add(hemisphereLightHelper)
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
  scene.add(directionalLightHelper)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  scene.add(pointLightHelper)
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)
  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
  scene.add(rectAreaLightHelper)


  /**
   * Objects
   */
  // Material
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.4

  // Objects
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  )
  sphere.position.x = - 1.5

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
  )

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
  )
  torus.position.x = 1.5

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
  )
  plane.rotation.x = - Math.PI * 0.5
  plane.position.y = - 0.65

  scene.add(sphere, cube, torus, plane)

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

  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  /**
   * Animate
   */
  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    spotLightHelper.update()

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
