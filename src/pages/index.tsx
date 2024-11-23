import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled, { keyframes } from 'styled-components'
import { darken } from 'polished'

import { Logo } from '../components/core/Logo'
import { PrimaryButton, Button } from '../components/core/Button'
import { json } from 'stream/consumers'

//Makes the API call to the function defined in the handler function of pages/api/generate-source.
async function getJSON(file: File): Promise<any> {
  try {
    const pdfArrayBuffer = await file.arrayBuffer();
    const base64PDF = btoa(
      new Uint8Array(pdfArrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    const response = await fetch('/api/generate-source', {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfToLatex: true,
        pdfFile: base64PDF,
        latexTemplate: '', // Optionally add your LaTeX template here
      }),
    });

    if (!response.ok) {
      console.log(response)
      throw new Error(`Error: ${response.statusText}`);
    }
    const { jsonResult } = await response.json();
    console.log(jsonResult)
    console.log(typeof(jsonResult))
    return JSON.parse(jsonResult)
  } catch (error) {
    console.error('Error fetching JSON:', error);
    throw error; // Propagate the error for further handling
  }
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 75px;
  background: linear-gradient(135deg, #1a1a1d 0%, #0d0d0d 100%);
  animation: ${fadeIn} 0.5s ease-in;
  overflow: hidden;
  cursor: none;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f0f0f0;
  padding: 0 20px;
  text-align: center;

  h1 {
    font-size: 3em;
    margin-bottom: 0.2em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.5em;
    max-width: 600px;
    margin-bottom: 2em;
    line-height: 1.5;
    color: #cccccc;
  }
`

const Cursor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background-color: rgba(233, 69, 96, 0.8);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, background-color 0.15s ease;
  z-index: 9999;

  &.hovered {
    transform: translate(-50%, -50%) scale(2);
    background-color: rgba(233, 69, 96, 1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;

  @media screen and (min-width: 500px) {
    flex-direction: row;
  }
`

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #333, ${darken(0.1, '#333')});
  color: #fff;
  border: none;
  padding: 1em 3em;
  font-size: 1em;
  font-weight: 500;
  border-radius: 12px;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${darken(0.15, '#333')};
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`

const StyledPrimaryButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  border: none;
  padding: 1em 3em;
  font-size: 1em;
  font-weight: 500;
  border-radius: 12px;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 6px 12px rgba(233, 69, 96, 0.2);

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

const HiddenInput = styled.input`
  display: none;
`




export default function Home() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasSession(!!localStorage.getItem('jsonResume'))
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const startNewSession = () => {
    window.localStorage.clear()
    window.location.href = '/generator' // Force a full page reload
  }

  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        //gets the uploaded file
        const file = e.target.files[0]; 
        //call to new getJSON method
        const jsonResult = await getJSON(file);
  
        const sectionNames = Object.keys(jsonResult);
        console.log(jsonResult)
        jsonResult.headings = sectionNames;
        jsonResult.sections = ['profile', 'education', 'work', 'skills', 'projects', 'awards'];
  
        localStorage.setItem('jsonResume', JSON.stringify(jsonResult));
        router.push('/generator');
      } catch (error) {
        console.error('Error processing the file:', error);
        alert('Failed to process the file. Please try again.');
      }
    }
  };
  
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <Wrapper>
      <Main>
        <h1>PDF To LaTeX Resume</h1>
        <p>Create a professional resume in minutes.</p>
        <ButtonGroup>
          <StyledPrimaryButton
            onClick={startNewSession}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Make New Resume
          </StyledPrimaryButton>
          {hasSession && (
            <Link href="/generator" passHref>
              <StyledButton
                as="a"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Continue Session
              </StyledButton>
            </Link>
          )}
          <StyledButton
            as="label"
            htmlFor="import-json"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Import JSON
          </StyledButton>
          <HiddenInput
            id="import-json"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
          />
        </ButtonGroup>
      </Main>
      <Cursor
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        className={isHovered ? 'hovered' : ''}
      />
    </Wrapper>
  )
}