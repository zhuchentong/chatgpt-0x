import domToImage from 'dom-to-image'
import { useStore } from '@/store'

export async function exportToPng(element: HTMLDivElement) {
  const store = useStore()
  domToImage
    .toPng(element, {
      style: {
        backgroundColor: '#fff',
        borderRadius: '10px',
      },
      quality: 1,
      filter: (node) => {
        if (node.nodeType !== 1) {
          return true
        }

        const element = node as HTMLElement

        if (
          element.classList.contains('chat-record') &&
          element.dataset.id &&
          store.chat.selectChatRecords &&
          !store.chat.selectChatRecords.includes(element.dataset.id)
        ) {
          return false
        }

        return true
      },
    })
    .then(function (dataUrl: string) {
      const link = document.createElement('a')
      link.download = 'chat-export.png'
      link.href = dataUrl
      link.click()
    })
}

export function useExport() {
  return {
    exportToPng,
  }
}
