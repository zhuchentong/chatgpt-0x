import { fileURLToPath } from 'node:url'
import type { AliasOptions, ResolveOptions } from 'vite'

type ViteResolveOptions = ResolveOptions & { alias?: AliasOptions | undefined }

export function defineViteResolve(
  options: ViteResolveOptions = {},
): Record<'resolve', ViteResolveOptions> {
  return {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('../src', import.meta.url)),
        '@': fileURLToPath(new URL('../src', import.meta.url)),
      },
      ...options,
    },
  }
}
