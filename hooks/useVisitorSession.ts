import { useLocalStorage } from '@uidotdev/usehooks'
import { v4 as uuidv4 } from 'uuid'

export const useVisitorSession = () => {
  const [value, setValue] = useLocalStorage('lastSessionId', uuidv4())

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.removeItem('lastSessionId')
  //   }
  //   window.addEventListener('beforeunload', handleBeforeUnload)
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [value])

  return {
    value: value,
  }
}
