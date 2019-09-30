import React from 'react'
import { css } from '@emotion/core'
import {
  ContextProviderComponent, BlogContext
} from '../context/mainContext'
import { fontFamily } from '../theme'
import { Link } from 'gatsby'
import logo from '../images/logo.png'
import logoLight from '../images/logoLight.png'
import logoDank from '../images/logoDank.png'
import "easymde/dist/easymde.min.css"
import 'react-toastify/dist/ReactToastify.css'

function BaseLayout(props) {
  const { theme, window: { height }, isAdmin } = props.context
  const { borderColor, baseFontWeight, highlight } = theme
  let { type: themeType } = theme

  const footerLinkWithTheme = css`
    color: ${highlight};
  `
  const dynamicContainerHeight = css`
    min-height: calc(${height}px - 157px);
  `
  const themedHeader = css`
    border-color: ${borderColor};
  `
  const themedLink = css`
    font-weight: ${baseFontWeight};
  `

  let mainLogo
  if (themeType === 'light') mainLogo = logo
  if (themeType === 'dark') mainLogo = logoLight
  if (themeType === 'dank') mainLogo = logoDank
  return ( 
    <div>
      <div css={[headerStyle, themedHeader]}>
        <div css={[headerContainerStyle, themedHeader]}>
          <Link to="/" css={linkContainer}>
            <img alt='logo' css={logoStyle} src={mainLogo} />
          </Link>
          <div css={menu}>
            <Link to="/" css={linkContainer}>
              <p css={[link, themedLink]}>Blog</p>
            </Link>
            <Link to="/about" css={linkContainer}>
              <p css={[link, themedLink]}>About Me</p>
            </Link>
            <Link to="/profile" css={linkContainer}>
              <p css={[link, themedLink]}>Profile</p>
            </Link>
            {
              isAdmin && (
                <Link to="/admin" css={linkContainer}>
                  <p css={[link, themedLink]}>Admin</p>
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
          <a target="_blank" rel="noopener noreferrer" href="https://www.gatsbyjs.org" css={[footerLinkWithTheme]}>Gatsby</a>
          {` `}&{` `}
          <a target="_blank" rel="noopener noreferrer" href="https://aws-amplify.github.io" css={[footerLinkWithTheme]}>AWS Amplify</a>
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

const link = css`
  margin-bottom: 0px;
  margin-left: 15px;
  padding-top: 5px;
  font-family: ${fontFamily}, sans-serif;

`

const menu = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 9px;
`

const headerStyle = css`
  border-bottom: 1px solid rgba(0, 0, 0, .1);
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