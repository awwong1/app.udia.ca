import * as THREE from 'three'
import { handleOnWindowResize } from './util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Lesson 7: Cameras
 * https://threejs-journey.xyz/lessons/7
 * @returns void
 */
const main = () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return
  const scene = new THREE.Scene()
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x663399 })
  )
  scene.add(mesh)
  const axesHelper = new THREE.AxesHelper(5) // unit
  scene.add(axesHelper)

  // Camera Docs: https://threejs.org/docs/#api/en/cameras/Camera
  // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 500)
  // https://threejs.org/docs/#api/en/cameras/OrthographicCamera
  // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 500)
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
  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  // controls.update()

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