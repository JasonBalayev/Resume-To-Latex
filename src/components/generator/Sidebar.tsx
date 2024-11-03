import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { darken } from 'polished';

import { colors } from '../../theme';
import { PrimaryButton } from '../core/Button';

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 48px; /* Increased padding to shift sidebar content */
  background: ${colors.background}; /* Updated background color */
  color: ${colors.foreground};
  font-family: 'Roboto', sans-serif; /* Updated font */
  box-shadow: 2px 0px 12px rgba(0, 0, 0, 0.1); /* Add shadow for depth */
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;
`;

const StyledLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? 'bold' : '300')}; /* Bold for active link */
  color: ${(props) => (props.$active ? colors.primary : '#b3b3b3')}; /* Softer inactive color */
  font-size: 1rem; /* Updated font size */
  transition: color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  position: relative; /* Needed for indicator positioning */
  padding-left: 12px; /* Space for the indicator */

  &:before {
    content: '';
    width: 3px; /* Width of the vertical bar */
    height: ${(props) => (props.$active ? '100%' : '0')}; /* Full height when active */
    background-color: ${colors.primary}; /* Primary color for the bar */
    position: absolute;
    left: 0; /* Aligns the bar to the left of the text */
    top: 0;
    transition: height 0.3s ease-in-out; /* Smooth transition for height */
  }

  &:hover:before {
    height: 100%; /* Expand on hover */
  }

  &:hover {
    color: ${colors.primary}; /* Red color on hover */
    transform: translateX(4px); /* Slight movement for interaction feedback */
  }
`;


const StyledMakeButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #e94560, ${darken(0.1, '#e94560')});
  color: #fff;
  border: none;
  padding: 1em 3em; /* Larger padding for a substantial look */
  font-size: 1em;
  font-weight: bold; /* Bold font for consistency */
  border-radius: 12px; /* Rounded corners for a modern look */
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
`;

export function Sidebar() {
  const router = useRouter();
  const { section: currSection = 'basics' } = router.query;

  const sectionLinks = [
    { label: 'Templates', section: 'templates' },
    { label: 'Profile', section: 'basics' },
    { label: 'Education', section: 'education' },
    { label: 'Work Experience', section: 'work' },
    { label: 'Skills', section: 'skills' },
    { label: 'Projects', section: 'projects' },
    { label: 'Awards', section: 'awards' }
  ];

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

     
      <StyledMakeButton form="resume-form">MAKE</StyledMakeButton>
    </Aside>
  );
}
