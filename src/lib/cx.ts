import { extendTailwindMerge } from 'tailwind-merge'

// A step of `pb-safe-area-*` (`pb-safe-area-6`).
const isInteger = (value: string) => /^\d+$/.test(value)

// Teach tailwind-merge the custom names it can't infer from Tailwind's defaults: theme tokens from
// `tokens.css` and `@utility` classes from `global.css`. An unknown class conflicts with nothing,
// and one that looks like a known group (`bg-topo-brand` reads as a color) overrides the wrong one.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      font: ['display', 'body'],
      shadow: ['card', 'raised', 'lifted', 'focus'],
      ease: ['out-quint'],
      animate: [
        'fade-in',
        'fade-out',
        'lift-in',
        'lift-out',
        'sheet-in',
        'sheet-out',
        'view-in',
        'view-back',
      ],
    },
    classGroups: {
      'bg-image': ['bg-topo-brand'],
      duration: ['duration-slide'],
      pb: ['pb-safe-area', { 'pb-safe-area': [isInteger] }],
      rounded: ['rounded-inherit'],
    },
  },
})

/**
 * Joins class names, skipping falsy values. Conflicting Tailwind utilities resolve to the last one,
 * so a `className` passed to a component overrides its defaults.
 */
export function cx(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes)
}
