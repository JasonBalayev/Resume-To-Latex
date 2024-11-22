import dynamic from 'next/dynamic'
import styled, { keyframes } from 'styled-components'
import { useAtom } from 'jotai'
import { resumeAtom } from '../atoms/resume'

import { Form } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'

const Preview = dynamic(
  async () => (await import('../components/generator/Preview')).Preview,
  { ssr: false }
)

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

// Spinner
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header header'
    'sidebar form preview';
  height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
  animation: ${fadeIn} 0.5s ease-in;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);

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
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(13, 13, 13, 0.9); /* Slightly darker background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f0f0f0;
  font-size: 1.5em;
  z-index: 1000;
`

const Spinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.1);
  border-left-color: #e94560;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1.5rem;
`

export default function GeneratorPage() {
  const [resume] = useAtom(resumeAtom)

  return (
    <Main>
      {resume.isLoading && (
        <LoadingOverlay>
          <Spinner />
          <div>Generating your resume...</div>
        </LoadingOverlay>
      )}
      <Header />
      <Sidebar />
      <Form />
      <Preview />
    </Main>
  )
}