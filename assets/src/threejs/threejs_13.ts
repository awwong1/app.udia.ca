import * as THREE from 'three'
import { handleOnWindowResize } from '../util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Lesson 13: 3D Text
 * https://threejs-journey.xyz/lessons/13
 * @returns void
 */
const main = () => {
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const matcapTexture = textureLoader.load('/threejs/matcaps/8.png')

  const canvas = <HTMLCanvasElement | null>document.getElementById('canvas')
  if (canvas === null) return

  const scene = new THREE.Scene()

  // Can convert fonts using tools like 
  // http://gero3.github.io/facetype.js/
  // https://threejs.org/docs/?q=font#api/en/loaders/FontLoader
  const fontLoader = new THREE.FontLoader()
  fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
      const textGeometry = new THREE.TextGeometry(
        'UDIA',
        {
          font,
          size: 0.5,
          height: 0.2, curveSegments: 2,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.02,
          bevelOffset: -0.01,
          bevelSegments: 1
        }
      )

      const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
      })
      const text = new THREE.Mesh(textGeometry, material)
      scene.add(text)

      // how to center the text? Multiple solutions
      // Bounding Box; needs to be computed prior to access
      // textGeometry.computeBoundingBox()
      // console.log(textGeometry.boundingBox)
      // if (textGeometry.boundingBox) {
      //   textGeometry.translate(
      //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // bevelSize
      //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
      //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // bevelThickness
      //   )  
      // }

      // or just call `center()`
      textGeometry.center()

      console.time('donuts')
      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

      for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.x = scale
        donut.scale.y = scale
        donut.scale.z = scale

        scene.add(donut)
      }

      console.timeEnd('donuts')
    }
  )

  // const axesHelper = new THREE.AxesHelper(5) // unit
  // scene.add(axesHelper)

  const fov = 75
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect)
  scene.add(camera)
  camera.position.z = 3

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
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  window.requestAnimationFrame(tick)
}

if (document.readyState === 'complete') {
  main()
} else {
  window.addEventListener('load', main)
}