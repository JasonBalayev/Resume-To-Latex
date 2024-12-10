import type { AppProps } from 'next/app'
import Head from 'next/head'
import { GlobalStyle } from '../components/core/GlobalStyle'
import { useEffect, useState } from 'react'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>PDF To LaTeX Resume</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload fonts if you're using any */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}

export default App
