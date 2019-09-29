import React from "react"
import { Hub, Auth } from 'aws-amplify'
import { getThemeInfo } from '../themes/themeProvider'
import { StaticQuery, graphql } from 'gatsby'

import { toast } from 'react-toastify'
import { Global, css } from '@emotion/core'
import dankbg from "../images/dankbg.jpeg"
import Amplify from 'aws-amplify'
import config from '../../jamstack-config.js'
Amplify.configure(config)
console.log('config from browser')

toast.configure( {
  progressStyle: {
    background: 'rgba(0, 0, 0, .2)',
  }
})


const themeQuery = graphql`
  query ThemeQuery {
    allThemeInfo {
      edges {
        node {
          data {
            customStyles
            theme
            categories
          }
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
    window: {},
    theme: 'light'
  }

  componentDidMount() {
    Hub.listen('auth', hubData => {
      const { payload: { event, data } } = hubData;
      if (event === 'signIn') {
        const { signInUserSession: { idToken: { payload } } } = data
        if (payload['cognito:groups'].includes('Admin')) {
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
      .catch(err => console.log(err));
      window.addEventListener("resize", this.onResize);
      this.onResize()
  }

  updateTheme = theme => {
    window.JAMSTACKTHEME = theme
    this.setState(() => {
      return {
        theme
      }
    })
  }

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
    return (
      <StaticQuery query={themeQuery}>
        { themeData => {
          const {allThemeInfo: { edges: [{ node: { data } }] }} = themeData
          let theme = getThemeInfo('light')

          if (typeof window !== 'undefined') {
            if (window.JAMSTACKTHEME) {
              console.log('theme info: ', window.JAMSTACKTHEME)
              theme = getThemeInfo(window.JAMSTACKTHEME)
            } else {
              console.log('no theme set in window global..')
            }
          }

          return (
            <>
            <Global
              styles={css`
                ${blogPostStyle(theme.type, theme.highlight)}
                body, html {
                  background-color: ${theme.backgroundColor};
                }
                body {
                  border: 12px solid ${theme.highlight};
                  background: url(${theme.type === 'dank' ? dankbg : null}) no-repeat center center fixed;
                  -webkit-background-size: cover;
                  -moz-background-size: cover;
                  -o-background-size: cover;
                  background-size: cover;
                }
                * {
                  color: ${theme.primaryFontColor};
                }
              `}
            />
            <BlogContext.Provider value={{
              ...this.state,
              updateIsAdmin: this.updateIsAdmin,
              updateTheme: this.updateTheme,
              theme
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

const blogPostStyle = (type, highlight) => {
  const isDark = type === 'dark'
  const isDank = type === 'dank'
  const isLight = type === 'light'
  return css`
  .blog-post p {
    font-family: Raleway, serif;
    font-size: 20px;
    margin: 11px 0px 13px;
    line-height: 34px;
    font-weight: ${isDark ? 200 : 400};
  }

  .blog-post li {
    font-family: Raleway, serif;
    margin-bottom: 7px;
    line-height: 28px;
    font-size: 18px;
    font-weight: ${isDark ? 200 : 400};
  }

  .blog-post h1 {
    font-family: Raleway, serif;
    margin: 25px 0px 0px;
    font-weight: 200 !important;
    font-size: 36px;
    line-height: 42px;
  }

  .blog-post h2 {
    font-family: Raleway, serif;
    margin: 25px 0px 15px;
    font-weight: ${isDark ? 200 : 300};
    line-height: 30px;
  }

  .blog-post h3 {
    font-family: Raleway, serif;
    margin: 25px 0px 25px;
  }

  .blog-post h4 {
    font-family: Raleway, serif;
    margin: 25px 0px 0px;
  }

  .blog-post h5 {
    font-family: Raleway, serif;
  }

  .blog-post code {
    font-size: 16px;
  }

  .blog-post a {
    color: black;
  }

  .blog-post pre {
    background-color: #ededed;
    padding: 20px;
    font-weight: 400;
    font-family: 'Courier New', Courier, monospace;
    overflow-x: scroll;
  }

  .blog-post p code {
    background-color: #ededed;
    font-family: 'Courier New', Courier, monospace;
    padding: 2px 5px;
  }

  .blog-post pre code {
    font-size: 16px;
  }

  .blog-post blockquote {
    border-left: 1px solid ${isDark ? highlight : 'black'};
  }
`
}