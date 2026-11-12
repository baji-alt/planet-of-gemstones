// Workaround: on Windows, Nuxt 3.21 can emit `typeof import('../../node_modules/vue/index')`
// in .nuxt/types/*.d.ts. That path has no type declarations, so every Vue auto-import
// (ref, watch, computed…) silently becomes `any`. Point those back at the 'vue' package.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = '.nuxt/types'
let fixed = 0
for (const f of readdirSync(dir).filter(f => f.endsWith('.d.ts'))) {
  const p = join(dir, f)
  const src = readFileSync(p, 'utf8')
  const out = src.replace(/(['"])(?:\.\.\/)+node_modules\/vue\/index\1/g, '$1vue$1')
  if (out !== src) {
    writeFileSync(p, out)
    fixed++
  }
}
console.log(`[fix-vue-types] patched ${fixed} file(s)`)
