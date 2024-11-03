import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import styled from 'styled-components'
import { resumeAtom } from '../../atoms/resume'
import { PrimaryButton } from '../core/Button'
import { darken } from 'polished'

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const Output = styled.output`
  grid-area: preview;
  background: #0d0d0d;
  overflow-y: auto;
  color: #f0f0f0;
  padding: 2rem;

  /* Adjust the left border to match other lines in color and thickness */
  border-left: 1px solid #333;

  /* Adjust scrollbar styling for dark theme */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
`

const ResumeDocument = styled(Document)`
  width: 100%;
`

const ResumePage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0 10rem 0;

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }
`

const ExportButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  border: none;
  padding: 1em 2.5em; /* Padding for a substantial look */
  font-size: 1em;
  font-weight: bold;
  border-radius: 12px; /* Rounded corners */
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 6px 12px rgba(233, 69, 96, 0.2);
  margin-bottom: 1rem; /* Space below the button */

  &:hover {
    background: ${darken(0.15, '#e94560')};
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(233, 69, 96, 0.3);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(233, 69, 96, 0.2);
  }
`

export function Preview() {
  const [resume] = useAtom(resumeAtom)
  const [, setPageCount] = useState(1)
  const [pageNumber] = useState(1)
  const [scale] = useState(
    typeof window !== 'undefined' && window.innerWidth > 1440 ? 1.75 : 1
  )

  const handleDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setPageCount(pdf.numPages)
  }, [])

  return (
    <Output>
      <ExportButton onClick={() => window.open(resume.url)}>
        Export as PDF
      </ExportButton>
      <PdfContainer>
        <ResumeDocument
          file={resume.url || '/blank.pdf'}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading=""
        >
          <ResumePage
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading=""
          />
        </ResumeDocument>
      </PdfContainer>
    </Output>
  )
}
