/** `navigator.userAgentData` (Chromium only), which TypeScript's DOM types don't include yet. */
type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform: string }
}

/** The OS name: `userAgentData.platform` (`macOS`, `iOS`) where supported, else the deprecated `navigator.platform` (`MacIntel`, `iPhone`). */
const platform =
  typeof navigator === 'undefined'
    ? ''
    : (navigator as NavigatorWithUserAgentData).userAgentData?.platform ||
      navigator.platform

/** Whether the device is a Mac, iPhone or iPad, whose shortcuts use ⌘ where others use Ctrl. */
export const isApple = /mac|iphone|ipad|ios/i.test(platform)

/** The modifier key shortcuts use, as shown to the user. */
export const modKeyLabel = isApple ? '⌘' : 'Ctrl '
