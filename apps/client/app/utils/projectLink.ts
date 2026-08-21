// Contextual link resolution for a project card's primary/stretched link — internal
// case-study route when `detailSlug` is set, external `project.url` otherwise. Single
// source of truth consumed by `/projects` and the landing "أبرز المشاريع" section, so
// the two never diverge on this decision.

export interface ProjectLinkResult {
  to: string
  isExternal: boolean
  target?: '_blank'
  rel?: 'noopener noreferrer'
}

export function projectLink(project: { detailSlug?: string, url: string }): ProjectLinkResult {
  if (project.detailSlug) {
    return {
      to: `/projects/${project.detailSlug}`,
      isExternal: false
    }
  }

  return {
    to: project.url,
    isExternal: true,
    target: '_blank',
    rel: 'noopener noreferrer'
  }
}
