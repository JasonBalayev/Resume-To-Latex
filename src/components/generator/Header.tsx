import Link from 'next/link'
import styled from 'styled-components'

import { Logo } from '../core/Logo'

const StyledHeader = styled.header`
  grid-area: header;
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d0d0d;
  border-bottom: 1px solid #333;
  color: #f0f0f0;
`

export function Header() {
  return (
    <StyledHeader>
      <Link href="/">
        <Logo scale={0.65} />
      </Link>
    </StyledHeader>
  )
}

// import Link from 'next/link'
// import styled from 'styled-components'

// import { Logo } from '../core/Logo'
// import { colors } from '../../theme'

// const StyledHeader = styled.header`
//   grid-area: header;
//   width: 100%;
//   height: 10vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border-bottom: 1px solid ${colors.borders};
// `
// export function Header() {
//   return (
//     <StyledHeader>
//       <Link href="/">
//         <Logo scale={0.65} />
//       </Link>
//     </StyledHeader>
//   )
// }
