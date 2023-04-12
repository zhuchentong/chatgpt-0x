<script lang="ts" setup>
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'

const props = defineProps<{
  content: string
}>()
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang"></span><span class="code-block-header__copy"></span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    return hljs.highlightAuto(code).value
    // const validLang = !!(language && hljs.getLanguage(language))
    // if (validLang) {
    //   const lang = language ?? ''
    //   return hljs.highlight(code, { language: lang }).value,
    // }

    // return highlightBlock(, '')
  },
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, {
  blockClass: 'katexmath-block rounded-md p-[10px]',
  errorColor: '#cc0000',
})

const text = computed(() => {
  const value = props.content ?? ''
  return mdi.render(value)
})
</script>

<template>
  <div>
    <div
      ref="textRef"
      class="leading-relaxed break-words">
      <div>
        <div
          v-if="true"
          class="markdown-body"
          v-html="text" />
        <div
          v-else
          class="whitespace-pre-wrap"
          v-text="content" />
      </div>
    </div>
  </div>
</template>
