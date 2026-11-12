// Copies the Draco decoder from three/examples into /public/draco so GLB
// models compressed with Draco (gltf-transform / gltf-pipeline) decode locally.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
const src = 'node_modules/three/examples/jsm/libs/draco/gltf'
const dest = 'public/draco'
if (existsSync(src)) {
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log('[draco] decoder copied to public/draco')
}
