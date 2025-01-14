import { useAtom } from 'jotai'
import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import styled from 'styled-components'
import { resumeAtom } from '../../atoms/resume'
import { PrimaryButton } from '../core/Button'
import { darken } from 'polished'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Output = styled.output`
  grid-area: preview;
  background: #0d0d0d;
  overflow-y: auto;
  color: #f0f0f0;
  padding: 2rem;
  border-left: 1px solid #333;
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ExportButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  padding: 1em 2.5em;
  font-size: 1em;
  font-weight: bold;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: none;

  &:hover {
    background: ${darken(0.15, '#e94560')};
    transform: translateY(-2px);
  }
`

const StyledPage = styled(Page)`
  canvas {
    max-width: 95% !important;
    height: auto !important;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
`

export function Preview() {
  const [resume] = useAtom(resumeAtom)
  const [scale] = useState(
    typeof window !== 'undefined' && window.innerWidth > 1440 ? 1.75 : 1
  )

  return (
    <Output>
      <PdfContainer>
        <ExportButton onClick={() => window.open(resume.url)}>
          Download PDF
        </ExportButton>
        <Document file={resume.url}>
          <StyledPage
            pageNumber={1}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </PdfContainer>
    </Output>
  )
}
