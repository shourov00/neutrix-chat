import { useCallback, useEffect, useRef, useState } from 'react'

interface UseWebSocketProps {
  onMessage: (data: any) => void
  onOpen?: () => void
  onClose?: () => void
}

const URL = process.env.CHAT_WEBSOCKET_API_ENDPOINT

const useWebSocket = ({ onMessage, onOpen, onClose }: UseWebSocketProps) => {
  const socket = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN && URL) {
      socket.current = new WebSocket(URL)
      socket.current.addEventListener('open', () => {
        setIsConnected(true)
        onOpen?.()
      })
      socket.current.addEventListener('close', () => {
        setIsConnected(false)
        onClose?.()
      })
      socket.current.addEventListener('message', (event) => {
        onMessage(JSON.parse(event.data))
      })
    }
  }, [onMessage, onOpen, onClose])

  const sendMessage = useCallback((message: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message))
    }
  }, [])

  const disconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close()
    }
  }, [isConnected])

  useEffect(() => {
    return () => {
      socket.current?.close()
    }
  }, [])

  return { isConnected, connect, sendMessage, disconnect }
}

export default useWebSocket
