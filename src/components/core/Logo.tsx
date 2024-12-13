import styled from 'styled-components'

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export function Logo() {
  return (
    <LogoWrapper>
      <h1>PDF To LaTeX Resume</h1>
    </LogoWrapper>
  )
}
