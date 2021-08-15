import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

/**
 * Lesson 10: Debug UI
 * https://threejs-journey.xyz/lessons/10
 * Relies on https://github.com/dataarts/dat.gui
 * @returns void
 */
const main = () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return
  const scene = new THREE.Scene()

  const meshParameters = { color: 0x663399 }
  const material = new THREE.MeshBasicMaterial(meshParameters)
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
  )
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

  const debugParams = {
    spin: () => {
      console.log('spin')
      gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI * 2 })
    }
  }

  /**
   * Debug drawer
   */
  const gui = new dat.GUI({ closed: true, width: 400 })
  gui.add(mesh.position, 'x', -3, 3, 0.01)
  gui.add(mesh.position, 'y', -3, 3, 0.01)
  // gui.add(mesh.position, 'z', -3, 3, 0.01)
  // chaining equivalent
  gui.add(mesh.position, 'z')
    .min(-3)
    .max(3)
    .step(0.01)

  // boolean
  gui.add(mesh, 'visible')
  gui.add(mesh.material, 'wireframe')

  // color of the mesh
  gui.addColor(meshParameters, 'color')
    .onChange((c) => material.color.set(c))

  // custom functions
  gui.add(debugParams, 'spin')

  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000
    mesh.rotation.y = elapsedTime * Math.PI * 0.0001
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  window.requestAnimationFrame(tick)
}

if (document.readyState === "complete") {
  main()
} else {
  window.addEventListener("load", main)
}