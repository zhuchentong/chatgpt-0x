<script lang="ts" setup>
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { ChatRole } from '@/config/enum.config'

const props = defineProps<{
  content: string
  role: ChatRole
}>()

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang"></span><span class="code-block-header__copy"></span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(
        hljs.highlight(code, { language: lang }).value,
        lang,
      )
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
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

const wrapClass = computed(() => {
  return [props.role === ChatRole.User ? 'bg-red' : 'bg-[#f4f6f8]']
})
</script>

<style lang="less" scoped>
.message-container {
  padding: 10px;
  border-radius: 10px;
  &.user {
    background-color: #d2f9d1;
    color: #000;
  }
  &.assistant {
    color: #000;
    background-color: #f4f6f8;
  }
}
</style>

<style lang="less">
.markdown-body {
  background-color: transparent!important;
  font-size: 14px;

  p {
    white-space: pre-wrap;
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  pre code,
  pre tt {
    line-height: 1.65;
  }

  .highlight pre,
  pre {
    background-color: #fff!important;
  }

  code.hljs {
    padding: 0;
  }

  .code-block {
    &-wrapper {
      position: relative;
      padding-top: 24px;
    }

    &-header {
      position: absolute;
      top: 5px;
      right: 0;
      width: 100%;
      padding: 0 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #b3b3b3!important;

      &__copy {
        cursor: pointer;
        margin-left: 0.5rem;
        user-select: none;

        &:hover {
          color: #65a665!important;
        }
      }
    }
  }
}

html.dark {
  .message-reply {
    .whitespace-pre-wrap {
      white-space: pre-wrap;
      color: var(--n-text-color);
    }
  }

  .highlight pre,
  pre {
    background-color: #282c34;
  }
}
</style>

<template>
  <div
    class="message-container"
    :class="{
      user: role === ChatRole.User,
      assistant: role === ChatRole.Assistant,
    }">
    <div class="leading-relaxed break-words">
      <div>
        <div
          v-if="role === ChatRole.User"
          class="whitespace-pre-wrap"
          v-text="content" />
        <div
          v-else
          class="markdown-body"
          v-html="text" />
      </div>
    </div>
  </div>
</template>
