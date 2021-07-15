import * as THREE from 'three'

function main(): void {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas")
  if (canvas === null) return

  // Scene
  const scene = new THREE.Scene()

  // Red cube
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Camera
  const fov = 75
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect)
  scene.add(camera)
  camera.position.z = 3

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.render(scene, camera)

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
  }
  window.addEventListener('resize', onWindowResize, false)

}

if (document.readyState === "complete") {
  main()
} else {
  window.addEventListener("load", main)
}