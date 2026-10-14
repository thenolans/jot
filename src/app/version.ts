/** The app's version, from the release tag that deployed it without its `v`; `dev` outside a release build. */
export const appVersion =
  import.meta.env.VITE_APP_VERSION?.replace(/^v/, '') || 'dev'
