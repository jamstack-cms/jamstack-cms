import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"
import { ContextProviderComponent, BlogContext } from '../context/mainContext'
import logo from '../images/logo.png'
import "easymde/dist/easymde.min.css"
import { highlight } from '../theme'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify';

toast.configure( {
  progressStyle: {
    background: 'black',
  }
})

class Layout extends React.Component {
  render() {
    const { theme, children } = this.props
    const { isAdmin, window: { height } } = this.props.context
    const dynamicContainerHeight = css`
      min-height: calc(${height}px - 157px);
    `
    const footerLinkWithTheme = css`
      color: ${highlight};
    `
    return (
      <div css={container}>
        <div css={headerStyle}>
          <div css={headerContainerStyle}>
            <Link to="/" css={linkContainer}>
              <img css={logoStyle} src={logo} />
            </Link>
            <div css={menu}>
              <Link to="/" css={linkContainer}>
                <p css={link(theme)}>Blog</p>
              </Link>
              <Link to="/about" css={linkContainer}>
                <p css={link(theme)}>About Me</p>
              </Link>
              <Link to="/settings" css={linkContainer}>
                <p css={link(theme)}>Settings</p>
              </Link>
              <Link to="/profile" css={linkContainer}>
                <p css={link(theme)}>Profile</p>
              </Link>
              {
                isAdmin && (
                  <Link to="/admin" css={linkContainer}>
                    <p css={link(theme)}>Admin</p>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
        <main css={[mainContent, dynamicContainerHeight]}>{children}</main>
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
}

const LayoutWithContext = props => (
  <ContextProviderComponent>
    <BlogContext.Consumer>
      {
        context => <Layout {...props} context={context} />
      }
    </BlogContext.Consumer>
  </ContextProviderComponent>
)

const logoStyle = css`
  width: 200px;
  margin: 14px 0px 0px;
`

const container = css`
  
`

const linkContainer = css`
  box-shadow: none;
  color: black;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
`

const link = ({ fontFamily }) => css`
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

const mainContent = css`
  margin: auto;
  width: 680px;
  padding-top: 35px;
  padding-bottom: 25px;
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

export default LayoutWithContext