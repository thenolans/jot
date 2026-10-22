import type { ComponentType } from 'react'

import AvocadoIcon from './AvocadoIcon'
import DabberIcon from './DabberIcon'
import FramerIcon from './FramerIcon'
import TomeOfScoringIcon from './TomeOfScoringIcon'

export type AppBrand = {
  /** The app's main color: its icon and name. */
  color: string
  /** The tint behind its icon. */
  soft: string
  /** The second color in its icon and the dot after its name. */
  mid: string
}

export type OtherApp = {
  name: string
  description: string
  href: string
  Icon: ComponentType<{ className?: string; detailClassName?: string }>
  /**
   * The app's own colors, kept here rather than in the tokens since nothing else in Jot
   * should use them. Each holds a CSS color, with `light-dark()` where it changes with the theme.
   */
  brand: AppBrand
}

export const otherApps: OtherApp[] = [
  {
    name: 'avocado',
    description: 'Recipes & meal planning',
    href: 'https://avocado.thenolans.io',
    Icon: AvocadoIcon,
    brand: {
      color: 'light-dark(#2c6349, #8cc0a8)',
      soft: 'light-dark(#dfeee6, #22503b)',
      mid: '#5fa381',
    },
  },
  {
    name: 'framer',
    description: 'Custom framing orders',
    href: 'https://framer.thenolans.io',
    Icon: FramerIcon,
    brand: {
      color: 'light-dark(#9a6e14, #e0c173)',
      soft: 'light-dark(#f2e7ce, #3d3115)',
      mid: '#c29a48',
    },
  },
  {
    name: 'dabber',
    description: 'Bingo card maker',
    href: 'https://dabber.thenolans.io',
    Icon: DabberIcon,
    brand: {
      color: 'light-dark(#185d64, #6dbfc5)',
      soft: 'light-dark(#cfecee, #144b51)',
      mid: '#3fa0a8',
    },
  },
  {
    name: 'tome of scoring',
    description: 'Board game scorekeeping',
    href: 'https://tos.thenolans.io',
    Icon: TomeOfScoringIcon,
    brand: {
      color: 'light-dark(#8f4a14, #eaa855)',
      soft: 'light-dark(#fae3c7, #703b14)',
      mid: '#dc8830',
    },
  },
]
