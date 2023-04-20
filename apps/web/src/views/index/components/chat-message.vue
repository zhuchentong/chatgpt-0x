<!-- eslint-disable vue/no-v-html -->
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

<style lang="less" scoped>
.message-container {
  padding: 10px;
  border-radius: 10px;
  &.user {
    background-color: #a1db94;
    color: #000;
  }
  &.assistant {
    background-color: v-bind('colorSchemes.backgroundColor');
  }
}

:deep(.markdown-body) {
  background-color: transparent !important;
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
    background-color: v-bind('colorSchemes.preBackgroundColor');
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
      color: #b3b3b3;

      span {
        user-select: none;
      }

      &__copy {
        cursor: pointer;
        margin-left: 0.5rem;
        user-select: none;

        &:hover {
          color: #65a665;
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useMessage } from 'naive-ui'
import { ChatRole } from '@/config/enum.config'

const props = defineProps<{
  content: string
  role: ChatRole
}>()
const el = useCurrentElement()
const message = useMessage()
const theme = useColorMode()
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
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

const debouncedFn = useDebounceFn(() => {
  copyCodeBlock()
}, 1000)

watch(
  () => props.content,
  () => {
    debouncedFn()
  },
)

onMounted(() => {
  copyCodeBlock()
})

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
    message.info('已复制到粘贴板')
  }
}

function copyCodeBlock() {
  const codeBlockWrapper = el.value.querySelectorAll('.code-block-wrapper')
  codeBlockWrapper.forEach((wrapper) => {
    const copyBtn = wrapper.querySelector('.code-block-header__copy')
    const codeBlock = wrapper.querySelector('.code-block-body')
    if (copyBtn && codeBlock) {
      copyBtn.addEventListener('click', () => {
        copyText(codeBlock.textContent ?? '')
      })
    }
  })
}

const text = computed(() => {
  const value = props.content ?? ''
  return mdi.render(value)
})

const colorSchemes = computed(() => {
  switch (theme.value) {
    case 'light':
      return {
        backgroundColor: '#f4f6f8',
        preBackgroundColor: '#fff',
      }
    case 'dark':
    default:
      return {
        backgroundColor: '#1e1e20',
        preBackgroundColor: '#282c34',
      }
  }
})
</script>
