import React from "react"
import { Hub, Auth } from 'aws-amplify'
import { getThemeInfo } from '../themes/themeProvider'
import { StaticQuery, graphql } from 'gatsby'
import { toast } from 'react-toastify'
import { Global, css } from '@emotion/core'
import dankbg from "../images/dankbg.jpg"
import Amplify from 'aws-amplify'
import config from '../../jamstack-config.js'
Amplify.configure(config)
toast.configure()

const mainQuery = graphql`
  query MainQuery {
    allThemeInfo {
      edges {
        node {
          data {
            theme
            categories
            border
            borderWidth
            description
          }
        }
      }
    },
    allSlugs {
      edges {
        node {
          data
        }
      }
    }
  }
`

const BlogContext = React.createContext()

class ContextProviderComponent extends React.Component {
  state = {
    isAdmin: false,
    updateIsAdmin: this.updateIsAdmin,
    avatarUrl: null,
    window: {},
  }

  componentDidMount() {
    Hub.listen('auth', hubData => {
      const { payload: { event, data } } = hubData;
      if (event === 'signIn') {
        const { signInUserSession: { idToken: { payload } } } = data
        if (payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
          this.updateIsAdmin(true)
        }
      }
    })
    Auth.currentAuthenticatedUser()
      .then(user => {
        const { payload } = user.signInUserSession.idToken
        const groups = payload['cognito:groups']
        if (groups.includes("Admin")) {
          this.updateIsAdmin(true)
        }
      })
      .catch(err => console.log(err))
    window.addEventListener("resize", this.onResize)
    this.onResize()
  }

  updateTheme = theme => {
    window.JAMSTACKTHEME = theme
    this.forceUpdate()
  }
  updateBorderEnabled = borderEnabled => {
    window.JAMSTACKTHEME_BORDER_ENABLED = borderEnabled
    this.forceUpdate()
  }
  updateBorderWith = borderWidth => {
    window.JAMSTACKTHEME_BORDER_WIDTH = borderWidth
    this.forceUpdate()
  }
  updateDescription = description => {
    window.JAMSTACKCMS_DESCRIPTION = description
    this.forceUpdate()
  }

  setAvatar = avatarUrl => this.setState({ avatarUrl })

  onResize = () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const window = {width, height}
    this.setState({ window })
 }

  updateIsAdmin = (isAdmin) => {
    this.setState({ isAdmin })
  }

  render() {
    const { window: { height } } = this.state
    return (
      <StaticQuery query={mainQuery}>
        { queryData => {
          const slugs = queryData.allSlugs.edges[0].node.data
          let {allThemeInfo: { edges: [{ node: { data: {
            border: borderEnabled, borderWidth: themeBorderWidth, theme: savedTheme, description: baseDescription
          } } }] }} = queryData

          let theme = getThemeInfo(savedTheme)
          borderEnabled = borderEnabled === 'none' ? 'enabled' : borderEnabled
          themeBorderWidth = themeBorderWidth === 'none' ? 12 : themeBorderWidth
          baseDescription = baseDescription === 'none' ? 'Edit description in settings' : baseDescription

          if (typeof window !== 'undefined') {
            if (window.JAMSTACKTHEME) {
              theme = getThemeInfo(window.JAMSTACKTHEME)
            }
            if (window.JAMSTACKTHEME_BORDER_ENABLED) {
              borderEnabled = window.JAMSTACKTHEME_BORDER_ENABLED
            }
            if (window.JAMSTACKTHEME_BORDER_WIDTH) {
              themeBorderWidth = window.JAMSTACKTHEME_BORDER_WIDTH
            }
            if (window.JAMSTACKCMS_DESCRIPTION) {
              baseDescription = window.JAMSTACKCMS_DESCRIPTION
            }
          }
          
          const showBorder = borderEnabled === 'enabled' ? true : false
          return (
            <>
            <Global
              styles={css`${globalStyle(theme, height, showBorder, themeBorderWidth)}`}
            />
            <BlogContext.Provider value={{
              ...this.state,
              updateIsAdmin: this.updateIsAdmin,
              updateTheme: this.updateTheme,
              updateBorderEnabled: this.updateBorderEnabled,
              updateBorderWith: this.updateBorderWith,
              setAvatar: this.setAvatar,
              updateDescription: this.updateDescription,
              borderEnabled,
              themeBorderWidth,
              siteDescription: baseDescription,
              theme,
              slugs
            }}>
              {this.props.children}
            </BlogContext.Provider>
            </>
          )
        }}
        </StaticQuery>
    )
  }
}

export {
  BlogContext,
  ContextProviderComponent
}

const globalStyle = ({
  primaryFontColor,
  secondaryFontColor,
  primaryLightFontColor,
  toastFontColor,
  codeBackgroundColor,
  fontFamily,
  scriptFamily,
  highlight,
  toastBackgroundColor,
  backgroundColor,
  type
}, height, showBorder, themeBorderWidth) => {
  console.log('height: ', height)
  const isDark = type === ('dark' || 'dank' || 'reactive')
  // const isDank = type === 'dank'
  // const isLight = type === 'light'
  return css`
  body, html {
    background-color: ${backgroundColor};
  }
  body {
    border: ${showBorder ? themeBorderWidth + 'px solid ' + highlight : 'none'};
    background: url(${type === 'dank' ? dankbg : null}) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  p, h1, h2, h3, h4, h5, span {
    color: ${primaryFontColor};
  }
  .rangeslider-horizontal .rangeslider__fill {
    background-color: ${highlight};
  }
  body {
    margin: 0;
    padding: 35px 0px 0px;
  }

  * {
    font-family: ${fontFamily}, sans-serif;
    text-decoration: none;
    box-sizing: border-box;
  }

  footer, footer p {
    font-family: ${fontFamily};
    color: ${primaryLightFontColor};
  }

  footer a {
    font-family: ${fontFamily};
    text-decoration: none;
    box-shadow: none;
    color: ${primaryLightFontColor};
  }

  h4 {
    font-family: ${fontFamily}, sans-serif;
    text-transform: none;
  }

  .hero-page-content p {
    font-family: ${fontFamily}, serif;
    font-size: 16px;
    margin-bottom: 15px;
    color: ${primaryFontColor};
  }

  .hero-page-content li {
    color: ${primaryFontColor};
    font-family: ${fontFamily}, serif;
    margin-bottom: 7px;
    line-height: 28px;
    font-size: 18px;
    font-weight: ${isDark ? 200 : 400};
  }

  .hero-page-content h1  {
    font-family: ${fontFamily};
    color: ${primaryFontColor};
    margin: 25px auto 18px;
    font-size: 36px;
    line-height: 42px;
    font-weight: 600;
    outline: none;
    border: none;
  }

  .hero-page-content h2 {
    font-family: ${fontFamily};
    color: ${primaryFontColor};
    font-weight: 600;
    line-height: 30px;
    font-size: 32px;
    margin: 25px auto 18px;
  }

  .hero-page-content h3 {
    margin: 20px auto 10px;
    font-family: ${fontFamily};
    font-weight: 600;
    color: ${primaryFontColor};
  }

  .hero-page-content h4 {
    font-family: ${fontFamily};
    color: ${primaryFontColor};
    margin: 25px 0px 0px;
  }

  .hero-page-content h5 {
    font-family: ${fontFamily};
    color: ${primaryFontColor};
  }

  .hero-page-content code {
    font-size: 16px;
    color: ${primaryFontColor};
  }

  .hero-page-content a {
    color: ${primaryFontColor};
  }

  .hero-page-content img {
    border-radius: 5px;
    margin: 15px auto 30px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 30px 60px -10px, rgba(0, 0, 0, 0.22) 0px 18px 36px -18px;
  }

  .hero-page-content pre {
    background-color: ${codeBackgroundColor};
    padding: 20px;
    font-weight: 400;
    font-family: 'Courier New', Courier, monospace;
    overflow-x: scroll;
    margin: 40px 0px;
  }

  .hero-page-content p code {
    background-color: ${codeBackgroundColor};
    font-family: 'Courier New', Courier, monospace;
    color: ${primaryFontColor};
  }

  .hero-page-content pre code {
    font-size: 16px;
  }

  .hero-page-content blockquote {
    border-left: 1px solid ${isDark ? highlight : 'black'};
  }

  .blog-post p {
    font-family: ${fontFamily}, serif;
    font-size: 18px;
    margin: 0px 0px 35px;
    line-height: 1.756;
    font-weight: ${isDark ? 200 : 300};
    color: ${primaryFontColor};
  }

  .blog-post li {
    color: ${primaryFontColor};
    font-family: ${fontFamily}, serif;
    margin-bottom: 7px;
    line-height: 28px;
    font-size: 18px;
    font-weight: ${isDark ? 200 : 400};
  }

  .blog-post h1 {
    font-family: ${fontFamily}, serif;
    margin: 25px auto 18px;
    font-weight: 200 !important;
    font-size: 36px;
    line-height: 42px;
  }

  .blog-post h2 {
    font-family: ${scriptFamily}, serif;
    line-height: 30px;
    font-size: 32px;
    margin: 25px auto 18px;
  }

  .blog-post h3 {
    font-family: ${scriptFamily}, serif;
    margin: 20px auto 10px
  }

  .blog-post h4 {
    font-family: ${fontFamily}, serif;
    margin: 25px 0px 0px;
  }

  .blog-post h5 {
    font-family: ${fontFamily}, serif;
  }

  .blog-post code {
    font-size: 16px;
    color: ${primaryFontColor};
  }

  .blog-post a {
    color: ${primaryFontColor};
  }

  .blog-post img {
    border-radius: 5px;
    margin: 15px auto 15px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 30px 60px -10px, rgba(0, 0, 0, 0.22) 0px 18px 36px -18px;
  }

  .blog-post pre {
    background-color: ${codeBackgroundColor};
    padding: 20px;
    font-weight: 400;
    font-family: 'Courier New', Courier, monospace;
    overflow-x: scroll;
    margin: 15px auto 50px;
  }

  .blog-post p code {
    background-color: ${codeBackgroundColor};
    font-family: 'Courier New', Courier, monospace;
    padding: 2px 5px;
    color: ${primaryFontColor};
  }

  .blog-post pre code {
    font-size: 16px;
  }

  blockquote {
    margin-left: -50px;
    border-color: ${primaryFontColor};
    margin-top: 20px;
    margin-bottom: 20px;
    @media (max-width: 700px) {
      margin-left: 0px;
    }
  }

  .blog-post blockquote p {
    padding-right: 100px;
    padding-bottom: 0px;
    width: 100%;
    line-height: 30px;
    font-family: ${fontFamily};
  }
  .blog-post blockquote p a {
    padding-bottom: 0px;
    width: 100%;
    font-family: ${fontFamily};
  }
  .editor-toolbar button.active, .editor-toolbar button:hover {
    background-color: transparent;
  }
  .editor-toolbar i {
    color: ${primaryFontColor};
  }
  .CodeMirror {
    background-color: transparent;
  }

  .CodeMirror-cursor, .CodeMirror-cursors {
    border-left: 1px solid ${secondaryFontColor} !important;
  }

  .CodeMirror, .CodeMirror-scroll {
    overflow: scroll;
    height: ${height - 470}px;
    min-height: 300px;
  }
  
  ::placeholder {
    color: ${secondaryFontColor} !important;
    opacity: 1 !important;
  }

  .Toastify__close-button--default {
    color: ${toastFontColor};
  }

  .Toastify__toast-body {
    color: ${toastFontColor};
  }

  .Toastify__toast .Toastify__toast--default {
    background: ${toastBackgroundColor};
  }

  .Toastify__toast--default {
    background: ${toastBackgroundColor};
  }

  .Toastify__progress-bar, .Toastify__progress-bar--animated, .Toastify__progress-bar--default {
    background: ${highlight};
  }
`
}