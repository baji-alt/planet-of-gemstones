# 3D models

Drop Draco-compressed `.glb` files here and reference them from `data/products.ts`
via the `model` field, e.g. `model: '/models/gemini-bracelet.glb'`.

Compress with:

```bash
npx @gltf-transform/cli optimize input.glb output.glb --compress draco --texture-compress webp
```

The Draco decoder is copied to `/public/draco/` on `npm install` (see `scripts/copy-draco.mjs`).
Products without a model use the procedural jewel built in `lib/three/jewelry.ts`.
