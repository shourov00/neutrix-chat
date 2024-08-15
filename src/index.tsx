import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/src/App'
import QueryClientProvider from '@/src/QueryClientProvider'
/**
 * Immediately-invoked function expression (IIFE) to initialize and render the React application.
 * This script is designed to be included in an HTML page and will mount a React application
 * into a dynamically created div element.
 */
;(function () {
  /**
   * Retrieves the source URL of the currently executing script.
   *
   * @returns {string} - The URL of the currently executing script.
   * @throws Will throw an error if no script is currently being executed.
   */
  console.log('rabbi', process.env.SERVER_API_ENDPOINT)
  const getCurrentScriptSrc = (): string => {
    const currentScript = document.currentScript as HTMLScriptElement
    if (!currentScript) {
      throw new Error('No script is currently being executed.')
    }
    return currentScript.src
  }

  const getQueryParams = (url: string): Record<string, string> => {
    const params: Record<string, string> = {}
    const queryString = url.split('?')[1]
    if (!queryString) {
      return params
    }
    const queryArray = queryString.split('&')

    queryArray.forEach((param) => {
      const [key, value] = param.split('=')
      params[key] = decodeURIComponent(value)
    })

    return params
  }

  const scriptSrc = getCurrentScriptSrc()
  const queryParams = getQueryParams(scriptSrc)
  const siteId =
    process.env.ENVIRONMENT !== 'local' ? queryParams.siteId : '123123123'

  if (process.env.ENVIRONMENT !== 'local' && !siteId) {
    throw new Error('siteId not found')
  }

  const widgetContainer = document.createElement('div')
  widgetContainer.id = 'root'
  widgetContainer.style.zIndex = '9999'
  document.body.appendChild(widgetContainer)

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  )
  root.render(
    <React.StrictMode>
      <QueryClientProvider>
        <App siteId={siteId} />
      </QueryClientProvider>
    </React.StrictMode>,
  )
})()
