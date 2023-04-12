import { ChatGPTAPI, SendMessageOptions } from "chatgpt";

let chatgptAPI: ChatGPTAPI;

/**
 * 获取API实例
 * @returns
 */
function useChatGPTAPI() {
  const { OPENAI_APIKEY, OPENAI_APIURL } = useRuntimeConfig();

  if (!chatgptAPI) {
    chatgptAPI = new ChatGPTAPI({
      apiKey: OPENAI_APIKEY,
      apiBaseUrl: OPENAI_APIURL,
      completionParams: {
        model: "gpt-3.5-turbo",
      },
    });
  }

  return chatgptAPI;
}

/**
 * 发送消息
 */
function sendMessage(message: string, options: SendMessageOptions) {
  const api = useChatGPTAPI();
  return api.sendMessage(message, options);
}

export function useChatGPT() {
  return {
    sendMessage,
  };
}
