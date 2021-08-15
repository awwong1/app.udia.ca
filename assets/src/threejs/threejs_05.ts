import * as THREE from 'three'
import { handleOnWindowResize } from '../util'

/**
 * Lesson 5: Transform Objects
 * https://threejs-journey.xyz/lessons/5
 * @returns void
 */
const main = () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return

  // Scene
  const scene = new THREE.Scene()

  const group = new THREE.Group()
  scene.add(group)

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  group.add(cube1)

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x663399 })
  )
  cube2.position.x = -1.5
  group.add(cube2)

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x993366 })
  )
  cube3.position.x = 1.5
  group.add(cube3)

  group.position.y = 1
  group.scale.set(1.5, 1, 1)
  group.rotation.z = Math.PI / 2

  // Axes helper: (useful for debugging position)
  const axesHelper = new THREE.AxesHelper(5) // unit
  scene.add(axesHelper)

  // Camera
  const fov = 75
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect)
  scene.add(camera)
  camera.position.set(1, 1, 5)

  // distance between mesh and camera
  console.log(cube2.position.distanceTo(camera.position));

  // Rotates the object such that the -z faces the target provided
  camera.lookAt(group.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.render(scene, camera)

  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene), false)

}

if (document.readyState === "complete") {
  main()
} else {
  window.addEventListener("load", main)
}