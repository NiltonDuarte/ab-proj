export type FeatureEntry = {
  id: string
  name: string
  [key: string]: string | string[] | undefined
}

export type Feature = {
  id: string
  category: 'nutricional' | 'movimento' | 'parceiros' | 'entretenimento'
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
