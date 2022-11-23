const { Header } = require('@carbon/react')
import type { AppProps } from 'next/app'

import '../styles/globals.scss'
import styles from '../styles/App.module.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header className={styles.header} aria-label="Header">Senti Water</Header>
      <Component {...pageProps} />
    </>
  )
}
