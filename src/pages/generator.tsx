// pages/generator.tsx

import dynamic from 'next/dynamic'
import styled, { keyframes } from 'styled-components'

import { Form } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'

// Dynamically import Preview component to optimize performance
const Preview = dynamic(
  async () => (await import('../components/generator/Preview')).Preview,
  { ssr: false }
)

// Define a fade-in animation for smoother transitions
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Styled Main container with enhanced grid layout and dark theme
const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header header'
    'sidebar form preview';
  height: 100vh;
  background-color: #121212; /* Dark background */
  color: #e0e0e0; /* Light text for contrast */
  animation: ${fadeIn} 0.5s ease-in;

  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      'header header'
      'sidebar form'
      'preview preview';
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'form'
      'preview';
  }

  /* Add subtle shadow around the main container */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
`

// Optional: Styled components for Header, Sidebar, Form, Preview if needed
// Ensure these components are updated similarly to match the dark theme

export default function GeneratorPage() {
  return (
    <Main>
      <Header />
      <Sidebar />
      <Form />
      <Preview />
    </Main>
  )
}
