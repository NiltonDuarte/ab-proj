export type FeatureEntry = {
  id: string
  name: string
  [key: string]: string | string[] | undefined
}

export type Feature = {
  id: string
  category: 'movimento' | 'bem-estar' | 'vantagens'
  icon: string
  label: string
  title: string
  description: string
  detail: string
  emptyState: string
  action: string
  joinedAction?: string
  disclaimer?: string
  items: FeatureEntry[]
}
