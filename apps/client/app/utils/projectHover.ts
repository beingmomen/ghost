// Shared hover language for project cards — the same zoom + arrow reveal + amber tint
// applied on `/projects` (large layout) and the landing "أبرز المشاريع" section, so the
// two stay in sync from one definition instead of duplicated inline classes.
//
// The scale classes are written out in full (not built dynamically) so Tailwind's JIT
// keeps them — `scale-[1.03]` / `scale-[1.05]` are arbitrary values.

export type ProjectHoverScale = '103' | '105'

export interface ProjectHoverClasses {
  card: string
  image: string
  arrow: string
}

// `imageScale`: '103' for the large `/projects` images, '105' for the small home thumbnails.
export function projectHover(
  opts: { imageScale?: ProjectHoverScale } = {}
): ProjectHoverClasses {
  const scaleClass = opts.imageScale === '103'
    ? 'group-hover:scale-[1.03]'
    : 'group-hover:scale-[1.05]'

  return {
    // On the hovered card itself (uses `hover:`, not `group-hover:`). A faint amber
    // wash + border so the tint reads on both the bordered landing card and the naked
    // `/projects` card.
    card: 'transition-colors duration-300 hover:border-primary/40 hover:bg-primary/5',
    // On the image inside the `.group` card.
    image: `transition-transform duration-500 ${scaleClass}`,
    // On the reveal arrow inside the `.group` card (RTL: points left = forward).
    arrow:
      'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-200'
  }
}
