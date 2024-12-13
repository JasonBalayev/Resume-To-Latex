import type { AppProps } from 'next/app'
import { GlobalStyle } from '../components/core/GlobalStyle'
import { useEffect, useState } from 'react'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}

export default App
