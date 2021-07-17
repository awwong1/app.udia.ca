import * as THREE from 'three'
import { Path } from 'three'
import { handleOnWindowResize } from './util'

/**
 * Cursor
 * @returns 
 */
const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (event) => {
  // raw pixel values within the viewport
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5
})

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
  const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 25)
  // https://threejs.org/docs/#api/en/cameras/OrthographicCamera
  // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
  scene.add(camera)
  camera.position.set(0, 0, 3)

  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene, { left: -1, right: 1 }), false)

  const tick: FrameRequestCallback = (curTime) => {
    const elapsedTime = curTime / 1000
    mesh.rotation.y = elapsedTime * Math.PI * 0.0001
    camera.position.set(
      Math.sin(cursor.x * Math.PI * 2) * 3,
      -1 * cursor.y * 5,
      Math.cos(cursor.x * Math.PI * 2) * 3
    )
    camera.lookAt(mesh.position)
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