// Injects Cloudinary delivery transformations into an absolute Cloudinary URL.
//
// Why this exists: `@nuxt/image`'s Cloudinary provider only transforms images when
// given a bare public ID — when handed a full `https://res.cloudinary.com/.../upload/...`
// URL (which is what the backend and app.config store), it passes it through untouched.
// That shipped a 5.7 MB GIF and a 1.8 MB PNG raw. We inject the transforms manually,
// right after the `/upload/` segment, so delivery goes through `f_auto,q_auto` (+ sizing).
//
// `transforms` defaults to format + quality auto; pass sizing (e.g. 'w_480') per use site.
export function optimizeCloudinary(
  url?: string | null,
  transforms = 'f_auto,q_auto'
): string {
  if (!url) return ''

  const marker = '/upload/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url

  const head = url.slice(0, idx + marker.length)
  const tail = url.slice(idx + marker.length)

  // Don't double-inject if a transform is already present on the URL.
  const firstSegment = tail.split('/')[0] || ''
  if (/(^|,)(f_|q_|w_|h_|c_|dpr_)/.test(firstSegment)) return url

  return `${head}${transforms}/${tail}`
}

// Detects a GIF by its file extension (ignoring any query string).
export function isGif(url?: string | null): boolean {
  if (!url) return false
  const path = url.split('?')[0] ?? ''
  return path.toLowerCase().endsWith('.gif')
}

// Picks the right Cloudinary transform string for a project image by format + slot.
//
// Cloudinary rejects animated GIFs above ~50 MP of total frame pixels (an upscale to
// w_1152 pushes a real GIF to ~84 MP → HTTP 400 → broken image). So GIFs are capped at
// w_800 and skip `f_auto`/`q_auto` (which would flatten the animation); static images
// keep the full `f_auto,q_auto` pipeline. Feed the result to `optimizeCloudinary(url, …)`.
export function cloudinaryTransformFor(
  url: string | null | undefined,
  size: 'full' | 'thumb'
): string {
  const gif = isGif(url)

  if (size === 'thumb') {
    return gif ? 'w_192,h_128,c_fill' : 'f_auto,q_auto,w_192,h_128,c_fill'
  }

  return gif ? 'w_800' : 'f_auto,q_auto,w_1152'
}
