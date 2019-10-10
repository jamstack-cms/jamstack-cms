import React from 'react'
import { css } from '@emotion/core'
import {
  ContextProviderComponent, BlogContext
} from '../context/mainContext'
import { Link } from 'gatsby'
import logo from '../images/logo.png'
import logoLight from '../images/logoLight.png'
import logoDank from '../images/logoDank.png'
import "easymde/dist/easymde.min.css"
import 'react-toastify/dist/ReactToastify.css'

function BaseLayout(props) {
  const { theme, window: { height }, isAdmin } = props.context
  const { borderColor } = theme
  let { type: themeType } = theme

  const dynamicContainerHeight = css`
    min-height: calc(${height}px - 157px);
  `

  let mainLogo
  if (themeType === 'light') mainLogo = logo
  if (themeType === 'dark') mainLogo = logoLight
  if (themeType === 'dank') mainLogo = logoDank
  return ( 
    <div>
      <div css={[headerStyle]}>
        <div css={[headerContainerStyle]}>
          <Link to="/" css={linkContainer}>
            <img alt='logo' css={logoStyle} src={mainLogo} />
          </Link>
          <div css={menu}>
            <Link to="/" css={linkContainer}>
              <p css={[link(theme)]}>Blog</p>
            </Link>
            <Link to="/about" css={linkContainer}>
              <p css={[link(theme)]}>About Me</p>
            </Link>
            <Link to="/profile" css={linkContainer}>
              <p css={[link(theme)]}>Profile</p>
            </Link>
            {
              isAdmin && (
                <Link to="/admin" css={linkContainer}>
                  <p css={[link(theme)]}>Admin</p>
                </Link>
              )
            }
          </div>
        </div>
      </div>
      <main css={[dynamicContainerHeight]}>{props.children}</main>
      <footer css={footerContainer}>
        <div css={footer}>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a target="_blank" rel="noopener noreferrer" href="https://www.gatsbyjs.org" css={[footerLink(theme)]}>Gatsby</a>
          {` `}&{` `}
          <a target="_blank" rel="noopener noreferrer" href="https://aws-amplify.github.io" css={[footerLink(theme)]}>AWS Amplify</a>
        </div>
      </footer>
    </div>
  )
}

function BaseLayoutWithContext(props) {
  return (
    <ContextProviderComponent>
      <BlogContext.Consumer>
        {
          context => <BaseLayout {...props} context={context} />
        }
      </BlogContext.Consumer>
    </ContextProviderComponent>
  )
}

const footerLink = ({ highlight }) => `
  color: ${highlight};
`

const logoStyle = css`
  width: 200px;
  margin: 14px 0px 0px;
`

const linkContainer = css`
  box-shadow: none;
  color: black;
  opacity: 1;
  &:hover {
    opacity: .8;
  }
`

const link = ({ fontFamily, baseFontWeight }) => css`
  margin-bottom: 0px;
  margin-top: 0px;
  margin-left: 15px;
  padding-top: 5px;
  font-family: ${fontFamily}, sans-serif;
  font-weight: ${baseFontWeight};
`

const menu = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 9px;
`

const headerStyle = css`
`

const headerContainerStyle = css`
  display: flex;
  width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 6px;
  @media (max-width: 1200px) {
    width: 100%;
    padding: 9px 20px 0px;
  }
`

const footerContainer = css`
  width: 100%;
`

const footer = css`
  width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 20px;
  @media (max-width: 1200px) {
    width: 100%;
    padding: 9px 20px 0px;
  }
`

export default BaseLayoutWithContext