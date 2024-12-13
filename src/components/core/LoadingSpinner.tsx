import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const SpinnerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #121212;
  z-index: 9999;
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(233, 69, 96, 0.3);
  border-top-color: #e94560;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export const LoadingSpinner = () => (
  <SpinnerWrapper>
    <Spinner />
  </SpinnerWrapper>
)

// Add empty export to make it a module
export {} 