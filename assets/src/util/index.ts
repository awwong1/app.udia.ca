import * as THREE from "three"

export const handleOnWindowResize = (renderer: THREE.Renderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) => () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
}