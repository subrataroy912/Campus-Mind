import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createStompClient, sendChatMessage } from '../services/websocket/stompClient.js'
import useAuth from '../hooks/useAuth.js'
import SocketContext from './socketContext.js'


function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const clientRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      clientRef.current?.deactivate()
      clientRef.current = null
      return undefined
    }

    const client = createStompClient({
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [isAuthenticated])

  const subscribe = useCallback((destination, callback) => {
    if (!clientRef.current?.connected || !destination) {
      return () => {}
    }

    const subscription = clientRef.current.subscribe(destination, (message) => {
      let body = null

      try {
        body = message.body ? JSON.parse(message.body) : null
      } catch {
        body = message.body
      }

      callback(body)
    })

    return () => subscription.unsubscribe()
  }, [])

  const sendMessage = useCallback((messagePayload) => sendChatMessage(clientRef.current, messagePayload), [])

  const value = useMemo(() => ({ isConnected, sendMessage, subscribe }), [isConnected, sendMessage, subscribe])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketProvider
