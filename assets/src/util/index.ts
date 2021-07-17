import * as THREE from "three"

export const handleOnWindowResize = (renderer: THREE.Renderer, camera: THREE.Camera, scene: THREE.Scene, opts?: any) => (): void => {
  const aspectRatio = window.innerWidth / window.innerHeight
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()
  }
  else if (camera instanceof THREE.OrthographicCamera) {
    // todo, fix
    camera.left = opts?.left * aspectRatio;
    camera.right = opts?.right * aspectRatio;
  }
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (renderer instanceof THREE.WebGLRenderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  renderer.render(scene, camera)
}