import domToImage from 'dom-to-image'
import { useStore } from '@/store'

function removeContainer() {
  const container = document.getElementById('export-container')
  if (container) {
    container.remove()
  }
}

function filterElements(node: HTMLElement): HTMLElement {
  const store = useStore()

  if (store.chat.selectChatRecords === undefined) {
    return node
  }

  Array.from(node.children).forEach((item) => {
    if (item.nodeType !== 1) {
      return
    }

    const element = item as HTMLElement

    // 删除未选中的聊天记录
    if (
      element.className.includes('chat-record') &&
      element.dataset.id &&
      store.chat.selectChatRecords &&
      !store.chat.selectChatRecords.includes(element.dataset.id)
    ) {
      element.remove()
    }

    // 删除聊天记录的时间
    if (element.className.includes('chat-date')) {
      element.remove()
    }
  })

  return node
}

export async function exportToPng(node: HTMLDivElement) {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.id = 'export-container'

  const element = filterElements(node.cloneNode(true) as HTMLDivElement)
  container.appendChild(element)
  document.body.appendChild(container)

  domToImage
    .toPng(element, {
      style: {
        backgroundColor: '#fff',
        borderRadius: '10px',
      },
      quality: 1,
      filter: (node) => {
        if ((node as HTMLElement).classList?.contains('record-select')) {
          return false
        } else {
          return true
        }
      },
    })
    .then(function (dataUrl: string) {
      const link = document.createElement('a')
      link.download = 'chat-export.png'
      link.href = dataUrl
      link.click()
      removeContainer()
    })
    .catch(() => {
      removeContainer()
    })
}

export function useExport() {
  return {
    exportToPng,
  }
}
