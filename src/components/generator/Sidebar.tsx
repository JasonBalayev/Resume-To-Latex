// components/generator/Sidebar.tsx

import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { darken } from 'polished'

import { colors } from '../../theme'
import { PrimaryButton } from '../core/Button'

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 48px;
  background: #0d0d0d; /* Updated background color to match the rest of the app */
  color: #f0f0f0; /* Adjusted text color for contrast */
  font-family: 'Roboto', sans-serif;
  /* Removed box-shadow for a flat look consistent with other sections */
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;
`

const StyledLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? 'bold' : '300')};
  color: ${(props) => (props.$active ? colors.primary : '#b3b3b3')};
  font-size: 1rem;
  transition: color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 12px;

  &:before {
    content: '';
    width: 3px;
    height: ${(props) => (props.$active ? '100%' : '0')};
    background-color: ${colors.primary};
    position: absolute;
    left: 0;
    top: 0;
    transition: height 0.3s ease-in-out;
  }

  &:hover:before {
    height: 100%;
  }

  &:hover {
    color: ${colors.primary};
    transform: translateX(4px);
  }
`

const HomeButon = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  border: none;
  padding: 1em 3em;
  font-size: 1em;
  font-weight: bold;
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

const StyledMakeButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  border: none;
  padding: 1em 3em;
  font-size: 1em;
  font-weight: bold;
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

export function Sidebar() {
  const router = useRouter()
  const { section: currSection = 'basics' } = router.query

  const sectionLinks = [
    { label: 'Templates', section: 'templates' },
    { label: 'Profile', section: 'basics' },
    { label: 'Education', section: 'education' },
    { label: 'Work Experience', section: 'work' },
    { label: 'Skills', section: 'skills' },
    { label: 'Projects', section: 'projects' },
    { label: 'Awards', section: 'awards' }
  ]

  return (
    <Aside>
      <Nav>
        {sectionLinks.map(({ label, section }) => (
          <StyledLink
            key={section}
            href={`/generator?section=${section}`}
            $active={section === currSection}
          >
            {label}
          </StyledLink>
        ))}
      </Nav>
      <StyledMakeButton type="submit" form="resume-form">
        MAKE
      </StyledMakeButton>
      <HomeButon
        onClick={() => {
          router.push('/')
        }}
      >
        Go Home
      </HomeButon>
    </Aside>
  )
}
