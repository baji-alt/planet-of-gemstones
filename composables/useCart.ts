import { getProduct } from '~/data/products'
import type { Metal, Version } from '~/data/types'

export interface CartItem {
  slug: string
  qty: number
  metal?: Metal
  size?: string
  version?: Version
}

const STORAGE_KEY = 'pog_cart_v1'
const keyOf = (i: Pick<CartItem, 'slug' | 'metal' | 'size' | 'version'>) => `${i.slug}|${i.metal ?? ''}|${i.size ?? ''}|${i.version ?? ''}`

export function useCart() {
  const items = useState<CartItem[]>('cart-items', () => [])
  const open = useState('cart-open', () => false)
  const hydrated = useState('cart-hydrated', () => false)

  if (import.meta.client && !hydrated.value) {
    hydrated.value = true
    // restore after hydration so server and client markup match (badge, drawer)
    onNuxtReady(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) items.value = [...(JSON.parse(raw) as CartItem[]).filter(i => getProduct(i.slug)), ...items.value]
      }
      catch { /* storage unavailable */ }
      watch(items, (v) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) }
        catch { /* ignore */ }
      }, { deep: true })
    })
  }

  const lines = computed(() =>
    items.value
      .map(i => ({ ...i, key: keyOf(i), product: getProduct(i.slug)! }))
      .filter(i => i.product),
  )
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
  const subtotal = computed(() => lines.value.reduce((n, i) => n + i.qty * i.product.price, 0))

  function add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const k = keyOf(item)
    const found = items.value.find(i => keyOf(i) === k)
    if (found) found.qty += qty
    else items.value.push({ ...item, qty })
  }
  function setQty(key: string, qty: number) {
    const idx = items.value.findIndex(i => keyOf(i) === key)
    if (idx < 0) return
    if (qty <= 0) items.value.splice(idx, 1)
    else items.value[idx]!.qty = qty
  }
  const clear = () => { items.value = [] }

  return { items, lines, count, subtotal, open, add, setQty, clear }
}
