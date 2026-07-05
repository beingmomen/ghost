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
