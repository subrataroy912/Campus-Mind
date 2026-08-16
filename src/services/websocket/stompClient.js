import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getStoredAccessToken } from '../api/apiClient.js'

const WS_URL = import.meta.env.VITE_WS_URL ?? '/ws'

export function createStompClient({ onConnect, onDisconnect, onStompError } = {}) {
  return new Client({
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: getStoredAccessToken() ? `Bearer ${getStoredAccessToken()}` : '',
    },
    webSocketFactory: () => new SockJS(WS_URL),
    onConnect,
    onDisconnect,
    onStompError,
  })
}

export function sendChatMessage(stompClient, messagePayload) {
  if (!stompClient?.connected) {
    return false
  }

  stompClient.publish({
    destination: '/app/chat.sendMessage',
    body: JSON.stringify(messagePayload),
  })

  return true
}
