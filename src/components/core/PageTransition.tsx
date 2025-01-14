import { motion } from 'framer-motion'
import styled from 'styled-components'

const TransitionWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #121212;
  z-index: 999;
`

export const PageTransition = () => (
  <TransitionWrapper
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    exit={{ opacity: 1 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  />
)

export {}
