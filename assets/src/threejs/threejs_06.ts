import * as THREE from 'three'
import gsap from 'gsap'
import { handleOnWindowResize } from '../util'

/**
 * Lesson 6: Animations
 * https://threejs-journey.xyz/lessons/6
 * @returns void
 */
const main = () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return

  // Scene
  const scene = new THREE.Scene()

  // Object
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x663399 })
  )
  scene.add(mesh)

  const axesHelper = new THREE.AxesHelper(5) // unit
  scene.add(axesHelper)

  // Camera
  const fov = 75
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect)
  scene.add(camera)
  camera.position.z = 3
  camera.lookAt(mesh.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener('resize', handleOnWindowResize(renderer, camera, scene), false)

  /**
   * Solution using Date.now
   */
  let time = Date.now()
  const dateNowTick = () => {
    // consistent animation speed using timestamp
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    console.log(deltaTime)

    // update the object
    // mesh.position.z -= 0.01
    mesh.rotation.x += 0.001 * deltaTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(dateNowTick)
  }
  // dateNowTick()

  /**
   * Solution using ThreeJS Clock
   */
  const clock = new THREE.Clock()
  const clockTick = () => {
    const elapsedTime = clock.getElapsedTime()

    mesh.rotation.y = elapsedTime * 2 * Math.PI
    mesh.position.x = -Math.tan(elapsedTime)
    mesh.position.y = Math.tan(elapsedTime)

    camera.position.x = Math.cos(elapsedTime)
    camera.position.y = Math.sin(elapsedTime)
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(clockTick)
  }
  clockTick()

  /**
   * Solution using Greensock (GSAP)
   */
  gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
  gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })
  const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  // tick()
}

if (document.readyState === "complete") {
  main()
} else {
  window.addEventListener("load", main)
}