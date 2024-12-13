import styled from 'styled-components'
import { colors } from '../../theme'

const StyledHeader = styled.header`
  grid-area: header;
  padding: 24px;
  border-bottom: 1px solid ${colors.borders};
  background: #0d0d0d;
`

export function Header() {
  return (
    <StyledHeader>
      <h1>PDF To LaTeX Resume</h1>
    </StyledHeader>
  )
}
