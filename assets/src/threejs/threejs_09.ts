import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Lesson 9: Geometry
 * https://threejs-journey.xyz/lessons/9
 * @returns void
 */
const main = () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return
  const scene = new THREE.Scene()

  const geometry = new THREE.BufferGeometry()

  // Basic triangle of three vertices (x, y ,z)
  // const positionsArray = new Float32Array([
  //   0, 0, 0,
  //   0, 1, 0,
  //   1, 0, 0
  // ])

  // Random triangles
  const count = 5
  const positionsArray = new Float32Array(count * 3 * 3)
  positionsArray.forEach((_val, idx) => {
    positionsArray[idx] = (Math.random() - 0.5) * 4
  })

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
  geometry.setAttribute('position', positionsAttribute)

  const mesh = new THREE.Mesh(
    // new THREE.BoxGeometry(1, 2, 3),
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x663399, wireframe: true })
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