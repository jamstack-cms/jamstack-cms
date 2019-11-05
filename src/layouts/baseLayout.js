import React from 'react'
import { css } from '@emotion/core'
import {
  ContextProviderComponent, BlogContext
} from '../context/mainContext'
import { Link } from 'gatsby'
import { Auth, Hub } from 'aws-amplify'
import logo from '../images/logo.png'
import logoLight from '../images/logoLight.png'
import logoDank from '../images/logoDank.png'
import logoReactive from '../images/logoReactive.png'
import "easymde/dist/easymde.min.css"
import 'react-toastify/dist/ReactToastify.css'

const titleCase = str =>
  str
    .split('-')
    .map(str => {
      const word = str.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')

class BaseLayout extends React.Component {
  state = {
    user: null
  }
  componentDidMount() {
    this.setUser()
    Hub.listen('auth', hubData => {
      const { payload: { event } } = hubData;
      if (event === 'signOut') {
        this.setState({ user: null })
      }
      if (event === 'signIn') {
        this.setUser()
      }
    })
  }
  async setUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.setState({ user })
     } catch (err) {
       console.log('user not signed in...')
     }
  }
  render() {
    const { user } = this.state
    let { theme, window: { height }, isAdmin, slugs } = this.props.context
    let { type: themeType } = theme

    slugs = slugs === 'none' ? [] : slugs

    const dynamicContainerHeight = css`
      min-height: calc(${height}px - 157px);
    `

    let mainLogo = logo
    if (themeType === 'dark') mainLogo = logoLight
    if (themeType === 'dank') mainLogo = logoDank
    if (themeType === 'reactive') mainLogo = logoReactive
    return ( 
      <div>
        <div css={[headerStyle]}>
          <nav css={[headerContainerStyle]}>
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
              {
                isAdmin && (
                  <Link to="/admin" css={linkContainer}>
                    <p css={[link(theme)]}>Admin</p>
                  </Link>
                )
              }
              {
                slugs.length > Number(0) && slugs.map((slug) => (
                  <Link to={`/${slug}`} css={linkContainer}>
                    <p css={[link(theme)]}>{titleCase(slug)}</p>
                  </Link>
                ))
              }
            </div>
          </nav>
        </div>
        <main css={[dynamicContainerHeight]}>{this.props.children}</main>
        <footer css={footerContainer(theme)}>
          <div css={footer}>
           <div css={footerLeft}>
             © {new Date().getFullYear()}&nbsp;
             <a css={footerLink(theme)} target="_blank" rel="noopener noreferrer" href="https://github.com/jamstack-cms" >JAMstack CMS</a>
           </div>
           <div css={footerRight}>
              <div>
                <a
                css={footerLink(theme)}
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/jamstackcms">Twitter</a>
              </div>
              <div>
                <a
                css={footerLink(theme)}
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/jamstack-cms">GitHub</a>
              </div>
              <Link to="/profile" css={footerLink(theme)}>
                { user ? "Profile" : "Sign In" }
              </Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }
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

const footerLink = ({ primaryFontColor, primaryLightFontColor }) => css`
  color: ${primaryLightFontColor};
  transition: all .25s;
  margin-right: 10px;
  &:hover {
    color: ${primaryFontColor};
  }
`

const footerLeft = css`
  display: flex;
  flex: 1;
  justify-content: flex-start;
`

const footerRight = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  @media (max-width: 900px) {
    justify-content: flex-start;
    margin-top: 10px;
  }
`

const logoStyle = css`
  width: 200px;
  margin: 14px 0px 0px;
`

const linkContainer = css`
  box-shadow: none;
`

const link = ({ fontFamily, baseFontWeight, primaryFontColor, primaryLightFontColor }) => css`
  margin-bottom: 0px;
  margin-top: 0px;
  margin-left: 15px;
  padding-top: 5px;
  font-family: ${fontFamily}, sans-serif;
  font-weight: ${baseFontWeight};
  color: ${primaryLightFontColor};
  transition: all .35s;
  &:hover {
    color: ${primaryFontColor};
  }
  @media (max-width: 800px) {
    margin-left: 0px;
    margin-right: 10px;
  }
`

const menu = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 9px;
  @media (max-width: 800px) {
    justify-content: flex-start;
  }
`

const headerStyle = css`
`

const headerContainerStyle = css`
  display: flex;
  width: 1200px;
  margin: 0 auto;
  padding: 10px 20px 6px;
  padding-top: 10px;
  padding-bottom: 6px;
  @media (max-width: 1200px) {
    width: 100%;
    padding: 9px 20px 0px;
  }
  @media (max-width: 800px) {
    flex-direction: column;
  }
`

const footerContainer = ({ borderColor }) => css`
  width: 900px;
  margin: 0 auto;
  margin-top: 100px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-top: 1px solid ${borderColor};
  @media (max-width: 900px) {
    width: 100%;
  }
`

const footer = css`
  margin: 0 auto;
  display: flex;
  &a: {
    text-decoration: none;
  }
  @media (max-width: 900px) {
    width: 100%;
    padding: 9px 20px 0px;
    flex-direction: column;
  }
`

export default BaseLayoutWithContext
