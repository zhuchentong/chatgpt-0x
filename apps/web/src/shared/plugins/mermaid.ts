import type { PluginWithOptions } from 'markdown-it'
import type mdi from 'markdown-it'
import mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'
import { useStore } from '@/store'

export type MdiWithMermaid = ReturnType<typeof mdi>

type Config = MermaidConfig & {
  id?: string
}

const MermaidPlugin: PluginWithOptions<Config> = (
  md: MdiWithMermaid,
  options,
) => {
  const defaultFenceRenderer = md.renderer.rules.fence
  const id =
    options?.id || `mermaid_item_${Math.random().toString(36).slice(2)}`

  const container = document.getElementById('mermaid-container')
  const element = document.createElement('div')
  element.id = id
  element.classList.add('mermaid_item')
  container?.appendChild(element)

  const store = useStore()

  if (!defaultFenceRenderer) {
    throw new Error('no default fence renderer configured for Mermaid!')
  }

  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'true',
    theme: 'default',
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
    },
    ...options,
  })

  // modify `fence` rule
  md.renderer.rules.fence = function (tokens, idx, opts, env, self) {
    const token = tokens[idx]
    if (token.tag === 'code' && token.info.startsWith('mermaid')) {
      // const re = new RegExp(/mermaid\s*?({.*)/);
      // const result = token.info.match(re);
      // const _mermaidOpts = result ? result[1].trim() : "{}";
      const key = `mermaid_${Math.random().toString(36).slice(2)}`

      try {
        mermaid.parse(token.content).then((valid) => {
          if (valid) {
            mermaid.render(id, token.content).then(({ svg }) => {
              nextTick(() => {
                const element = document.getElementById(key)

                if (element) {
                  element.innerHTML = svg
                }
              })
            })
          }
        })

        const width = store.app.desktop ? '600px' : '200px'
        return `<div id="${key}" class="mermaid" style="min-width: ${width};text-align:center;">${token.content}</div>`
      } catch (e) {
        // console.group(
        //   `Mermaid rendering error: ${
        //     e instanceof Error ? e.message : String(e)
        //   }`,
        // )
        // console.warn('failed to render mermaid configuration:')
        // console.info(token.content)
        // console.groupEnd()
        return `<div>${token.content}</div>`

        // return `<div class="mermaid-error" style="display: flex; flex-direction: row; width: 100%; border-radius: 0.75rem; rgba(60, 60, 60, .1); padding: 0.5rem;">
        //           <div style="display: flex; flex-direction: column; margin-right: 2rem">
        //           <div style="display: flex;  flex-direction: row">
        //           <div style="display: flex; flex-grow: 0;">
        //           <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="width:64px; height: 64px" class="fill-gray-900 dark:fill-gray-100">
        //           <path d="m472.57 191.49c-11.266-27.137-36.863-18.945-36.863-18.945-4.6094-7.6797-19.457-23.551-19.457-23.551-16.383-16.383-35.328-8.7031-35.328-8.7031-22.016 2.0469-25.09 28.16-25.09 28.16-11.266 9.2148-7.168 29.695-7.168 29.695-23.551 14.848-49.664 11.266-49.664 11.266-19.457 2.0469-19.969-30.207-19.969-30.207-4.0977-27.137-15.871-28.672-15.871-28.672 9.7266 9.2148 8.1914 17.406 8.1914 17.406-10.754-18.945-37.887-12.801-37.887-12.801-9.2148 1.5352-14.848-14.336-14.848-14.336 1.0234 19.969 18.434 18.945 18.434 18.945 13.824 4.6094 14.848 19.969 14.848 19.969-15.359-11.266-28.672-3.0703-28.672-3.0703 34.816 0.51172 22.527 24.574 22.527 24.574-4.0977 7.168-3.0703 13.824-3.0703 13.824 1.0234 12.801 20.992 28.16 20.992 28.16-7.168-2.5586-24.574 0.51172-24.574 0.51172-16.383 1.0234-25.602-12.289-26.113-12.801 7.6797 21.504 31.23 18.434 31.23 18.434 15.871 2.0469 19.969 9.7266 19.969 9.7266-19.457-0.51172-33.793 16.895-33.793 16.895 28.672-22.016 61.953 4.0977 61.953 4.0977 23.551 12.801 45.055-9.2148 45.055-9.2148 5.6328-4.6094 14.336-3.5859 18.945-2.5586 1.5352 0.51172 2.5586 1.0234 4.0977 1.5352 4.6094 3.5859 10.754 2.5586 10.754 2.5586-1.5352 9.7266-6.1445 22.016-18.945 20.992 0-8.1914-9.7266 0-9.7266 0-30.207-5.6328-63.488 26.625-63.488 26.625s-12.801 17.406-49.664 11.777c-23.039-3.5859-47.105-18.945-61.441-29.695-4.0977-9.2148-10.238-28.16-9.2148-55.809 1.5352-40.449-33.793-70.656-33.793-70.656s-12.801-10.238-19.969-10.238c0 0 11.266 13.824 9.7266 42.496 0 0 2.0469 21.504 3.5859 25.09 0 0-41.473-30.719-78.848-10.238 0 0 48.641 23.551 67.07 51.711 11.266 17.406 33.281 26.113 48.641 29.695 37.887 60.414 111.62 62.977 111.62 62.977 90.113 7.6797 103.43-19.969 103.43-19.969 22.016-5.1211 10.238-12.801 10.238-12.801l5.6328-7.168s8.7031 16.383 7.168 22.527-3.5859 8.1914-3.5859 8.1914-11.777 4.6094-18.434 8.7031c-1.5352 0.51172-2.0469 2.5586-1.5352 4.0977 1.0234 2.0469 3.0703 4.0977 9.2148 4.0977 1.5352 0 2.5586-0.51172 4.0977-1.5352 2.5586-2.0469 8.7031-6.6562 13.824-6.6562 0 0 2.0469 0 1.0234 1.5352l-3.5859 3.5859s-0.51172 2.5586 1.5352 2.5586c0 0 2.0469-1.5352 3.5859-3.0703 0 0 1.5352-1.0234 3.5859-1.5352 1.5352-0.51172 3.0703-1.5352 3.5859-3.0703 0 0 2.5586 2.5586 4.0977 2.5586 1.5352 0 5.1211 3.0703 5.1211 3.0703s3.0703 1.5352 3.0703-0.51172c0 0-2.0469-2.5586-4.0977-4.0977-2.0469-1.5352 0-1.5352 0-1.5352s4.0977 0 8.1914 1.5352l7.168 5.1211c1.0234 0.51172 2.0469 1.0234 3.0703 1.0234 8.7031 0.51172 10.238-3.5859 10.238-5.6328 0-1.0234-0.51172-1.5352-1.0234-2.0469-3.0703-1.5352-12.289-5.6328-20.992-9.2148 0 0-7.6797-1.5352-3.5859-21.504l4.0977-18.434s3.0703-11.777 2.5586-17.406c0 0 0.51172-4.6094 1.0234-6.1445l4.6094-21.504c0.51172-0.51172 1.0234-1.0234 1.5352-1.5352l0.51172-0.51172v-0.51172-0.51172c0.51172-0.51172 0.51172-1.0234 0.51172-1.5352v-0.51172-0.51172-0.51172-0.51172-0.51172-0.51172-0.51172-0.51172-3.0703-1.0234c9.2148-9.7266 13.312-25.09 13.312-25.09 0.51172 24.062-16.895 52.223-17.406 52.734 31.742-31.742 22.527-76.801 22.527-76.801 16.383 12.801 1.5352 48.129 1.5352 49.152 27.648-33.281-7.6797-72.191-7.6797-72.191 2.5586 0.51172 19.457 23.039 20.48 24.574-11.266-17.922-24.062-32.77-24.062-32.77l2.0469-2.0469c11.777-6.668 28.672 13.812 29.184 14.836zm-104.96 155.65c1.0234-0.51172 2.0469-0.51172 2.5586-0.51172 0 0-1.0234 0.51172-2.5586 0.51172z" fill="currentColor"/>
        //           </svg>
        //           </div>
        //           <div class="error-text" style="display: flex; flex-grow: 0; font-size: 1.4rem; font-weight: 800; color: red">
        //             Mermaid Parsing Error
        //           </div>
        //           </div>
        //           <div style="display: flex; flex-grow: 0.5">
        //               <div class="error-message">
        //                 ${e instanceof Error ? e.message : String(e)}
        //               </div>
        //           </div>
        //           </div> <!-- end error defn -->
        //           <div style="display: flex; flex-direction: column; flex-grow: 1">
        //               <div class="definition-heading" style="font-weight: 600; font-size: 1.4rem;">
        //                 Mermaid Definition
        //               </div>
        //               <div class="definition">
        //                   <pre>${token.content}</pre>
        //               </div>
        //           </div>
        //         </div>`
      }
    }

    return defaultFenceRenderer(tokens, idx, opts, env, self)
  }
}

export default MermaidPlugin
