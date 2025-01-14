import styled, { keyframes } from 'styled-components'
import { useAtom } from 'jotai'
import { resumeAtom } from '../atoms/resume'
import { Form } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'

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
    height: auto;
    min-height: 100vh;
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

const PreviewContainer = styled.div`
  grid-area: preview;
  overflow-y: auto;
  padding: 2rem;
  background: #0f0f0f;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const DownloadButton = styled.button`
  width: 220px;
  background-color: #e94560;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #d63d57;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const PDFPreviewFrame = styled.iframe`
  width: 100%;
  height: 800px;
  border: 1px solid #333;
  border-radius: 4px;
  background: white;
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(13, 13, 13, 0.9);
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

  const handleDownload = () => {
    if (resume.url) {
      window.open(resume.url, '_blank')
    }
  }

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
      <PreviewContainer>
        <DownloadButton
          onClick={handleDownload}
          disabled={!resume.url || resume.isLoading}
        >
          {resume.url ? 'Download PDF' : 'Must Make before downloading'}
        </DownloadButton>
        {resume.url && (
          <PDFPreviewFrame src={resume.url} title="Resume Preview" />
        )}
        {resume.isError && (
          <div style={{ color: '#e94560', textAlign: 'center' }}>
            Error generating resume. Please try again.
          </div>
        )}
      </PreviewContainer>
    </Main>
  )
}
