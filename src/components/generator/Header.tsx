import Link from 'next/link'
import styled from 'styled-components'

import { Logo } from '../core/Logo'

const StyledHeader = styled.header`
  grid-area: header;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d0d0d;
  border-bottom: 1px solid #333;
  color: #f0f0f0;
`

export function Header() {
  // return (
  //   <StyledHeader>
  //     <Link href="/">
  //       <Logo scale={0.65} />
  //     </Link>
  //   </StyledHeader>
  // )
}
