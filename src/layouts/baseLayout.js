import React from 'react'
import { css } from '@emotion/core'
import {
  ContextProviderComponent, BlogContext
} from '../context/mainContext'
import { fontFamily, highlight } from '../theme'
import { Link } from 'gatsby'
import logo from '../images/logo.png'
import "easymde/dist/easymde.min.css"
import 'react-toastify/dist/ReactToastify.css'

import { toast } from 'react-toastify';

toast.configure( {
  progressStyle: {
    background: 'rgba(0, 0, 0, .2)',
  }
})

function BaseLayout(props) {
  const { isAdmin } = props.context
  const footerLinkWithTheme = css`
    color: ${highlight};
  `
  const { window: { height } } = props.context
  const dynamicContainerHeight = css`
    min-height: calc(${height}px - 157px);
  `
  return (
    <div>
      <div css={headerStyle}>
        <div css={headerContainerStyle}>
          <Link to="/" css={linkContainer}>
            <img css={logoStyle} src={logo} />
          </Link>
          <div css={menu}>
            <Link to="/" css={linkContainer}>
              <p css={link}>Blog</p>
            </Link>
            <Link to="/about" css={linkContainer}>
              <p css={link}>About Me</p>
            </Link>
            <Link to="/settings" css={linkContainer}>
              <p css={link}>Settings</p>
            </Link>
            <Link to="/profile" css={linkContainer}>
              <p css={link}>Profile</p>
            </Link>
            {
              isAdmin && (
                <Link to="/admin" css={linkContainer}>
                  <p css={link}>Admin</p>
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
          <a target="_blank" href="https://www.gatsbyjs.org" css={[footerLinkWithTheme]}>Gatsby</a>
          {` `}&{` `}
          <a target="_blank" href="https://aws-amplify.github.io" css={[footerLinkWithTheme]}>AWS Amplify</a>
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
  opacity: .8;
  &:hover {
    opacity: 1;
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
  background-color: white;
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
  background-color: white;
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