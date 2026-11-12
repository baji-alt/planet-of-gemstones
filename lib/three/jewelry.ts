import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { rng } from '../random'

export type MetalKind = 'gold' | 'silver'
export type Clarity = 'clear' | 'milky' | 'opaque'

export interface StoneLook {
  hex: string
  highlight: string
  clarity: Clarity
  slug?: string
}

export const DIAMOND: StoneLook = { hex: '#FFFFFF', highlight: '#FFFFFF', clarity: 'clear', slug: 'diamond' }

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * Round brilliant cut built from facets (table, star, bezel, upper girdle,
 * girdle, lower girdle, pavilion). Non-indexed so every facet is flat-shaded,
 * which is what produces the crisp "fire" of a real cut stone.
 */
export function brilliantGeometry(): THREE.BufferGeometry {
  const v = (r: number, y: number, deg: number) => {
    const a = (deg * Math.PI) / 180
    return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
  }
  const tableY = 0.36
  const T = new THREE.Vector3(0, tableY, 0)
  const tab = Array.from({ length: 8 }, (_, i) => v(0.56, tableY, i * 45))
  const mid = Array.from({ length: 8 }, (_, i) => v(0.83, 0.22, i * 45 + 22.5))
  const gt = Array.from({ length: 16 }, (_, i) => v(1, 0.025, i * 22.5))
  const gb = Array.from({ length: 16 }, (_, i) => v(1, -0.025, i * 22.5))
  const pm = Array.from({ length: 8 }, (_, i) => v(0.47, -0.5, i * 45))
  const culet = new THREE.Vector3(0, -0.88, 0)

  const tris: THREE.Vector3[][] = []
  const m8 = (i: number) => (i + 8) % 8
  const m16 = (i: number) => (i + 16) % 16
  for (let i = 0; i < 8; i++) {
    tris.push([T, tab[i]!, tab[m8(i + 1)]!]) // table
    tris.push([tab[i]!, mid[i]!, tab[m8(i + 1)]!]) // star
    tris.push([tab[i]!, mid[m8(i - 1)]!, gt[2 * i]!]) // bezel (kite, 2 tris)
    tris.push([tab[i]!, gt[2 * i]!, mid[i]!])
    tris.push([mid[i]!, gt[2 * i]!, gt[m16(2 * i + 1)]!]) // upper girdle
    tris.push([mid[i]!, gt[m16(2 * i + 1)]!, gt[m16(2 * i + 2)]!])
    tris.push([pm[i]!, gb[m16(2 * i - 1)]!, gb[2 * i]!]) // lower girdle
    tris.push([pm[i]!, gb[2 * i]!, gb[m16(2 * i + 1)]!])
    tris.push([pm[i]!, gb[m16(2 * i + 1)]!, pm[m8(i + 1)]!])
    tris.push([pm[i]!, pm[m8(i + 1)]!, culet]) // pavilion main
  }
  for (let i = 0; i < 16; i++) {
    tris.push([gt[i]!, gb[i]!, gb[m16(i + 1)]!]) // girdle band
    tris.push([gt[i]!, gb[m16(i + 1)]!, gt[m16(i + 1)]!])
  }

  const pos: number[] = []
  const n = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  for (const [a, b, d] of tris) {
    ab.subVectors(b!, a!)
    ac.subVectors(d!, a!)
    n.crossVectors(ab, ac)
    c.copy(a!).add(b!).add(d!).divideScalar(3)
    // outward winding: normal must point away from the stone's centre
    const flip = n.dot(c) < 0 // origin lies inside the (convex) stone
    const tri = flip ? [a!, d!, b!] : [a!, b!, d!]
    for (const p of tri) pos.push(p.x, p.y, p.z)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

/** A smooth, irregular, tumbled pebble. */
export function tumbledGeometry(seed: number, detail = 3): THREE.BufferGeometry {
  const r = rng(seed)
  const base = new THREE.IcosahedronGeometry(0.5, detail)
  base.deleteAttribute('normal')
  base.deleteAttribute('uv')
  const g = mergeVertices(base)
  const k = Array.from({ length: 9 }, () => r() * 6.28)
  const sx = 0.85 + r() * 0.35
  const sy = 0.65 + r() * 0.2
  const sz = 0.75 + r() * 0.3
  const p = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize()
    const bump
      = 0.09 * Math.sin(v.x * 2.1 + k[0]!) * Math.sin(v.y * 1.7 + k[1]!)
      + 0.06 * Math.sin(v.z * 3.3 + k[2]!) * Math.cos(v.x * 2.6 + k[3]!)
      + 0.035 * Math.sin(v.y * 4.9 + k[4]!) * Math.sin(v.z * 4.1 + k[5]!)
    const len = 0.5 * (1 + bump)
    p.setXYZ(i, v.x * len * sx, v.y * len * sy, v.z * len * sz)
  }
  g.computeVertexNormals()
  base.dispose()
  return g
}

/** Domed oval cabochon (flat back). */
export function cabochonGeometry(w = 1, h = 0.75, dome = 0.42): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(0.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2)
  g.scale(w, dome * 2, h)
  return g
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

export function metalMaterial(kind: MetalKind) {
  return new THREE.MeshPhysicalMaterial({
    color: kind === 'gold' ? new THREE.Color('#E8C377') : new THREE.Color('#E4E6EA'),
    metalness: 1,
    roughness: kind === 'gold' ? 0.16 : 0.12,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.25,
  })
}

export function setMetal(mat: THREE.MeshPhysicalMaterial, kind: MetalKind) {
  mat.color.set(kind === 'gold' ? '#E8C377' : '#E4E6EA')
  mat.roughness = kind === 'gold' ? 0.16 : 0.12
  mat.needsUpdate = true
}

/** Physically based gem material: transmission, IOR ~2.4, dispersion, iridescence. */
export function gemMaterial(look: StoneLook) {
  const m = new THREE.MeshPhysicalMaterial()
  applyStoneLook(m, look)
  return m
}

export function applyStoneLook(m: THREE.MeshPhysicalMaterial, look: StoneLook) {
  const col = new THREE.Color(look.hex)
  const hi = new THREE.Color(look.highlight)
  m.flatShading = false
  m.iridescence = 0
  m.sheen = 0
  m.transparent = false
  m.opacity = 1
  m.emissive.set(0x000000)
  m.emissiveIntensity = 0
  if (look.clarity === 'clear') {
    const white = look.slug === 'diamond'
    m.color.copy(white ? new THREE.Color('#FFFFFF') : hi.clone().lerp(col, 0.25))
    m.metalness = 0
    m.roughness = 0
    m.transmission = 1
    m.thickness = 1.2
    m.ior = 2.4
    m.dispersion = white ? 6 : 3
    m.attenuationColor.copy(white ? new THREE.Color('#FFFFFF') : col)
    m.attenuationDistance = white ? 100 : 0.65
    m.specularIntensity = 1
    m.specularColor.set('#ffffff')
    m.iridescence = white ? 0.35 : 0.15
    m.iridescenceIOR = 1.6
    m.iridescenceThicknessMinimum = 120
    m.iridescenceThicknessMaximum = 420
    m.clearcoat = 1
    m.clearcoatRoughness = 0
    m.envMapIntensity = 2.2
  }
  else if (look.clarity === 'milky') {
    m.color.copy(col.clone().lerp(hi, 0.12))
    m.metalness = 0
    m.roughness = 0.14
    m.transmission = 0.22
    m.thickness = 1.5
    m.ior = 1.55
    m.dispersion = 0
    m.attenuationColor.copy(col)
    m.attenuationDistance = 0.5
    m.specularIntensity = 0.9
    m.clearcoat = 1
    m.clearcoatRoughness = 0.04
    m.sheen = 0.3
    m.sheenColor.copy(hi)
    m.sheenRoughness = 0.4
    if (look.slug === 'moonstone' || look.slug === 'opal') {
      // adularescence / play of colour
      m.iridescence = 1
      m.iridescenceIOR = 1.8
      m.iridescenceThicknessMinimum = look.slug === 'opal' ? 200 : 250
      m.iridescenceThicknessMaximum = look.slug === 'opal' ? 900 : 500
      m.emissive.copy(hi)
      m.emissiveIntensity = 0.06
    }
    m.envMapIntensity = 1.4
  }
  else {
    m.color.copy(col)
    m.metalness = 0
    m.roughness = 0.16
    m.transmission = 0
    m.ior = 1.6
    m.dispersion = 0
    m.specularIntensity = 0.7
    m.clearcoat = 1
    m.clearcoatRoughness = 0.06
    m.sheen = look.slug === 'tigers-eye' ? 0.45 : 0.15
    m.sheenColor.copy(hi)
    m.sheenRoughness = 0.3
    m.envMapIntensity = 1.2
  }
  m.needsUpdate = true
}

// ---------------------------------------------------------------------------
// Jewelry builders
// ---------------------------------------------------------------------------

export interface Jewel {
  group: THREE.Group
  setMetal: (k: MetalKind) => void
  setStone: (look: StoneLook) => void
}

/** A ring, either a prong-set solitaire (faceted) or a men's signet (cabochon). */
export function buildRing(opts: { metal: MetalKind, stone: StoneLook, style?: 'solitaire' | 'signet' }): Jewel {
  const group = new THREE.Group()
  const metal = metalMaterial(opts.metal)
  const stoneMat = gemMaterial(opts.stone)
  const signet = opts.style === 'signet'

  // band: lathe a comfort-fit profile around the finger axis
  const profile: THREE.Vector2[] = []
  const thick = signet ? 0.17 : 0.1
  const width = signet ? 0.32 : 0.2
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2
    profile.push(new THREE.Vector2(1 + thick * 0.5 + Math.cos(a) * thick * 0.5, Math.sin(a) * width * 0.5))
  }
  const band = new THREE.Mesh(new THREE.LatheGeometry(profile, 160), metal)
  band.rotation.x = Math.PI / 2 // finger axis along Z
  group.add(band)

  const head = new THREE.Group()
  head.position.y = 1.12
  group.add(head)

  let gem: THREE.Mesh
  let curStone = opts.stone
  const buildGem = (look: StoneLook) => {
    const faceted = look.clarity === 'clear' && !signet
    const geo = faceted ? brilliantGeometry() : cabochonGeometry(signet ? 0.95 : 0.7, signet ? 0.72 : 0.55, signet ? 0.32 : 0.45)
    const mesh = new THREE.Mesh(geo, stoneMat)
    if (faceted) {
      mesh.scale.setScalar(0.42)
      mesh.position.y = 0.36
    }
    else {
      mesh.position.y = signet ? 0.17 : 0.12
    }
    return mesh
  }

  if (signet) {
    // flat oval plate the cabochon sits on, plus a thin bezel
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.42, 0.18, 64), metal)
    plate.scale.z = 0.78
    plate.position.y = 0.06
    head.add(plate)
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 12, 96), metal)
    bezel.rotation.x = Math.PI / 2
    bezel.scale.y = 0.78
    bezel.position.y = 0.17
    head.add(bezel)
  }
  else {
    // basket + 6 prongs
    const basket = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 10, 64), metal)
    basket.rotation.x = Math.PI / 2
    basket.position.y = 0.2
    head.add(basket)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const prong = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.5, 4, 8), metal)
      prong.position.set(Math.cos(a) * 0.36, 0.3, Math.sin(a) * 0.36)
      prong.rotation.z = -Math.cos(a) * 0.18
      prong.rotation.x = Math.sin(a) * 0.18
      head.add(prong)
    }
    const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.08, 0.2, 24), metal)
    shoulder.position.y = 0.0
    head.add(shoulder)
  }
  gem = buildGem(opts.stone)
  head.add(gem)

  return {
    group,
    setMetal: k => setMetal(metal, k),
    setStone: (look) => {
      const facetedBefore = curStone.clarity === 'clear'
      curStone = look
      applyStoneLook(stoneMat, look)
      if (!signet && facetedBefore !== (look.clarity === 'clear')) {
        head.remove(gem)
        gem.geometry.dispose()
        gem = buildGem(look)
        head.add(gem)
      }
    },
  }
}

/** Gold link chain bracelet with tumbled natural stones. */
export function buildBracelet(opts: { metal: MetalKind, stones: StoneLook[], seed?: number }): Jewel {
  const group = new THREE.Group()
  const metal = metalMaterial(opts.metal)
  const R = 1.25
  const linkCount = 72
  const linkGeo = new THREE.TorusGeometry(0.055, 0.014, 8, 20)
  linkGeo.scale(1.6, 1, 1)
  const links = new THREE.InstancedMesh(linkGeo, metal, linkCount)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const s = new THREE.Vector3(1, 1, 1)
  const p = new THREE.Vector3()
  for (let i = 0; i < linkCount; i++) {
    const a = (i / linkCount) * Math.PI * 2
    p.set(Math.cos(a) * R, Math.sin(a) * R, 0)
    e.set(i % 2 ? Math.PI / 2 : 0, 0, a + Math.PI / 2)
    q.setFromEuler(e)
    m.compose(p, q, s)
    links.setMatrixAt(i, m)
  }
  group.add(links)

  // Stones hang as tumbled charms from small jump rings, fanning outward
  // like the bracelets laid on fabric in the brand's photos.
  const stoneMeshes: THREE.Mesh[] = []
  const count = 22
  const r = rng(opts.seed ?? 7)
  const ringGeo = new THREE.TorusGeometry(0.035, 0.01, 6, 16)
  const jump = new THREE.InstancedMesh(ringGeo, metal, count)
  const geos = Array.from({ length: 5 }, () => tumbledGeometry(Math.floor(r() * 1e6), 2))
  for (let i = 0; i < count; i++) {
    const look = opts.stones[i % opts.stones.length]!
    const a = (i / count) * Math.PI * 2 + (r() - 0.5) * 0.08
    const dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0)
    // jump ring
    p.copy(dir).multiplyScalar(R + 0.05)
    q.setFromEuler(new THREE.Euler(Math.PI / 2, 0, a))
    m.compose(p, q, s)
    jump.setMatrixAt(i, m)
    // charm stone
    const mesh = new THREE.Mesh(geos[i % geos.length]!, gemMaterial({ ...look, clarity: look.clarity === 'clear' ? 'milky' : look.clarity }))
    const size = 0.24 + r() * 0.1
    mesh.scale.set(size, size * (1.15 + r() * 0.3), size)
    mesh.position.copy(dir).multiplyScalar(R + 0.1 + size * 0.55)
    mesh.position.z = (r() - 0.5) * 0.08
    mesh.rotation.set(r() * 0.6, r() * 0.6, a - Math.PI / 2 + (r() - 0.5) * 0.5)
    group.add(mesh)
    stoneMeshes.push(mesh)
  }
  group.add(jump)
  // small zodiac charm disc
  const charm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32), metal)
  charm.rotation.x = Math.PI / 2
  charm.position.set(0, -R - 0.16, 0)
  group.add(charm)

  return {
    group,
    setMetal: k => setMetal(metal, k),
    setStone: (look) => {
      stoneMeshes.forEach(sm => applyStoneLook(sm.material as THREE.MeshPhysicalMaterial, { ...look, clarity: look.clarity === 'clear' ? 'milky' : look.clarity }))
    },
  }
}

/** Oval bezel-set pendant with bail, or a faceted drop for necklaces. */
export function buildPendant(opts: { metal: MetalKind, stone: StoneLook, drop?: boolean }): Jewel {
  const group = new THREE.Group()
  const metal = metalMaterial(opts.metal)
  const stoneMat = gemMaterial(opts.stone)
  let stone: THREE.Mesh
  if (opts.drop) {
    stone = new THREE.Mesh(brilliantGeometry(), stoneMat)
    stone.rotation.x = Math.PI / 2 // table faces the viewer
    stone.scale.setScalar(0.62)
    stone.position.y = 0.1
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.12, 24), metal)
    cap.position.y = 0.72
    group.add(cap)
  }
  else {
    stone = new THREE.Mesh(cabochonGeometry(1, 1.38, 0.5), stoneMat)
    stone.rotation.x = Math.PI / 2
    stone.position.z = 0.04
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 14, 96), metal)
    bezel.scale.y = 1.38
    group.add(bezel)
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 64), metal)
    back.rotation.x = Math.PI / 2
    back.scale.z = 1.38
    back.position.z = -0.03
    group.add(back)
  }
  group.add(stone)
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 12, 40), metal)
  bail.rotation.y = Math.PI / 2
  bail.position.y = opts.drop ? 0.88 : 0.82
  group.add(bail)
  // a little chain running up
  const chainGeo = new THREE.TorusGeometry(0.05, 0.012, 6, 16)
  chainGeo.scale(1.5, 1, 1)
  const n = 14
  const chain = new THREE.InstancedMesh(chainGeo, metal, n * 2)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3(1, 1, 1)
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < n; i++) {
      const dir = side ? 1 : -1
      const pos = new THREE.Vector3(dir * (0.05 + i * 0.07), (opts.drop ? 0.95 : 0.9) + i * 0.13, -0.02)
      q.setFromEuler(new THREE.Euler(i % 2 ? Math.PI / 2 : 0, 0, Math.PI / 2 - dir * 0.5))
      m.compose(pos, q, s)
      chain.setMatrixAt(side * n + i, m)
    }
  }
  group.add(chain)
  group.position.y = -0.4
  const outer = new THREE.Group()
  outer.add(group)
  return {
    group: outer,
    setMetal: k => setMetal(metal, k),
    setStone: look => applyStoneLook(stoneMat, look),
  }
}

/** A single loose tumbled stone. */
export function buildLooseStone(opts: { stone: StoneLook, seed?: number }): Jewel {
  const mat = gemMaterial({ ...opts.stone, clarity: opts.stone.clarity === 'clear' ? 'milky' : opts.stone.clarity })
  const mesh = new THREE.Mesh(tumbledGeometry(opts.seed ?? 3, 5), mat)
  mesh.scale.setScalar(2.4)
  const group = new THREE.Group()
  group.add(mesh)
  return {
    group,
    setMetal: () => {},
    setStone: look => applyStoneLook(mat, { ...look, clarity: look.clarity === 'clear' ? 'milky' : look.clarity }),
  }
}

/** Twinkling 4-point star sprites (soft additive), used for sparkle + starfields. */
export function starTexture(size = 64) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const h = size / 2
  const grad = g.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.15, 'rgba(255,240,210,0.8)')
  grad.addColorStop(0.5, 'rgba(255,220,160,0.08)')
  grad.addColorStop(1, 'rgba(255,220,160,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  g.globalCompositeOperation = 'lighter'
  g.fillStyle = 'rgba(255,245,220,0.9)'
  g.beginPath()
  g.moveTo(h, 0)
  g.quadraticCurveTo(h, h, size, h)
  g.quadraticCurveTo(h, h, h, size)
  g.quadraticCurveTo(h, h, 0, h)
  g.quadraticCurveTo(h, h, h, 0)
  g.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function buildStarfield(count: number, radius: number, seed = 11) {
  const r = rng(seed)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const gold = new THREE.Color('#E6CB86')
  const white = new THREE.Color('#FFF6EA')
  const blush = new THREE.Color('#EAD9D2')
  const tmp = new THREE.Color()
  for (let i = 0; i < count; i++) {
    const u = r() * 2 - 1
    const th = r() * Math.PI * 2
    const rad = radius * (0.45 + r() * 0.55)
    const s = Math.sqrt(1 - u * u)
    pos.set([Math.cos(th) * s * rad, u * rad * 0.7, Math.sin(th) * s * rad - radius * 0.35], i * 3)
    const pick = r()
    tmp.copy(pick < 0.5 ? white : pick < 0.85 ? gold : blush)
    col.set([tmp.r, tmp.g, tmp.b], i * 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.09,
    map: starTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
  return new THREE.Points(geo, mat)
}

export function loadDracoGLB(url: string): Promise<THREE.Group> {
  return Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/loaders/DRACOLoader.js'),
  ]).then(([{ GLTFLoader }, { DRACOLoader }]) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)
    return loader.loadAsync(url).then((gltf) => {
      draco.dispose()
      return gltf.scene
    })
  })
}

/** Men's zodiac bracelet: polished natural stone beads with a metal spacer. */
export function buildBeadBracelet(opts: { metal: MetalKind, stones: StoneLook[] }): Jewel {
  const group = new THREE.Group()
  const metal = metalMaterial(opts.metal)
  const R = 1.2
  const n = 20
  const geo = new THREE.SphereGeometry(0.17, 32, 20)
  const mats = opts.stones.map(s => gemMaterial({ ...s, clarity: s.clarity === 'clear' ? 'milky' : s.clarity }))
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    if (i === 0) {
      const spacer = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 24), metal)
      spacer.position.set(Math.cos(a) * R, Math.sin(a) * R, 0)
      spacer.rotation.z = a
      group.add(spacer)
      continue
    }
    const bead = new THREE.Mesh(geo, mats[i % mats.length]!)
    bead.position.set(Math.cos(a) * R, Math.sin(a) * R, 0)
    group.add(bead)
  }
  return {
    group,
    setMetal: k => setMetal(metal, k),
    setStone: look => mats.forEach(m => applyStoneLook(m, { ...look, clarity: look.clarity === 'clear' ? 'milky' : look.clarity })),
  }
}

/** Misbaha (prayer beads): 33 beads on a teardrop loop, separators and a tassel. */
export function buildMisbaha(opts: { metal: MetalKind, stone: StoneLook }): Jewel {
  const group = new THREE.Group()
  const metal = metalMaterial(opts.metal)
  const mat = gemMaterial({ ...opts.stone, clarity: opts.stone.clarity === 'clear' ? 'milky' : opts.stone.clarity })
  const n = 33
  const bead = new THREE.SphereGeometry(0.1, 24, 16)
  const beads = new THREE.InstancedMesh(bead, mat, n)
  const m = new THREE.Matrix4()
  const pt = (t: number) => {
    // teardrop loop, open at the bottom where the imam bead sits
    const a = -Math.PI / 2 + 0.28 + t * (Math.PI * 2 - 0.56)
    return new THREE.Vector3(Math.cos(a) * 1.05, Math.sin(a) * 1.3 + 0.25, 0)
  }
  for (let i = 0; i < n; i++) {
    m.makeTranslation(pt(i / (n - 1)))
    beads.setMatrixAt(i, m)
  }
  group.add(beads)
  for (const t of [1 / 3, 2 / 3]) {
    const sep = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 20), metal)
    sep.position.copy(pt(t))
    sep.position.x *= 1.01
    sep.rotation.z = Math.PI / 2
    group.add(sep)
  }
  const imam = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.42, 24), mat)
  imam.position.set(0, -1.2, 0)
  group.add(imam)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 12), metal)
  cap.position.set(0, -1.45, 0)
  group.add(cap)
  const tasselMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#7A1F3D'), roughness: 0.6, sheen: 1, sheenColor: new THREE.Color('#E6CB86') })
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 24, 1, true), tasselMat)
  tassel.position.set(0, -1.78, 0)
  group.add(tassel)
  group.position.y = 0.25
  const outer = new THREE.Group()
  outer.add(group)
  return {
    group: outer,
    setMetal: k => setMetal(metal, k),
    setStone: look => applyStoneLook(mat, { ...look, clarity: look.clarity === 'clear' ? 'milky' : look.clarity }),
  }
}

export interface JewelSpec {
  type: 'bracelet' | 'ring' | 'pendant' | 'necklace' | 'stone' | 'beads'
  metal: MetalKind
  stones: StoneLook[]
  ringStyle?: 'solitaire' | 'signet'
  version?: 'women' | 'men'
  seed?: number
}

/** One entry point used by every viewer: product spec → procedural jewel. */
export function buildJewel(spec: JewelSpec): Jewel {
  const first = spec.stones[0] ?? DIAMOND
  switch (spec.type) {
    case 'bracelet':
      return spec.version === 'men'
        ? buildBeadBracelet({ metal: spec.metal, stones: spec.stones })
        : buildBracelet({ metal: spec.metal, stones: spec.stones, seed: spec.seed })
    case 'ring': return buildRing({ metal: spec.metal, stone: first, style: spec.ringStyle })
    case 'pendant': return buildPendant({ metal: spec.metal, stone: first })
    case 'necklace': return buildPendant({ metal: spec.metal, stone: first, drop: true })
    case 'beads': return buildMisbaha({ metal: spec.metal, stone: first })
    default: return buildLooseStone({ stone: first, seed: spec.seed })
  }
}
