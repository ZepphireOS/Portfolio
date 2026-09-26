/** Resolves a `public/` path against Vite's base URL, so images still load if the site is served from a sub-path (e.g. GitHub Pages). */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
