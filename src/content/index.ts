import site from './site.json'
import experiences from './experiences.json'
import routes from './features/routes.json'
import books from './features/books.json'
import breakfasts from './features/breakfasts.json'
import workouts from './features/home-workouts.json'
import challenges from './features/challenges.json'
import nutrition from './features/nutrition.json'
import partnerships from './features/partnerships.json'
import coupons from './features/coupons.json'
import type { Feature } from './types'

export const pageContent = site
export const experienceContent = experiences
export const featureContent = [nutrition, workouts, challenges, partnerships, coupons, breakfasts, routes, books] as unknown as Feature[]
