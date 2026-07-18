// Top-level site sections. Single source of truth for the nav union — used by
// the header (active state) and the layouts.
export type Section =
  | 'styles'
  | 'patterns'
  | 'components'
  | 'templates'
  | 'documentation'
  | 'support'
  | 'ai-skills'
  | 'changelog';
