import React from "react"

import SiteContainer from '../components/site-container'
import SEO from "../components/seo"
import { BlogContext } from '../context/mainContext'
import { css } from '@emotion/core'
import { graphql } from 'gatsby'
import { highlight } from '../theme'
import PostList from '../components/postList'
import checkNodeData from '../utils/checkNodeData'

import { Auth } from 'aws-amplify'

class BlogIndex extends React.Component {
  state = {
    isAdmin: false
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const groups = user.signInUserSession.idToken.payload['cognito:groups']
        if (groups.includes("Admin")) {
          this.setState({ isAdmin: true })
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    const posts = this.props.data.appsync.listPosts.items.filter(post => post.published)
    let authorImages = checkNodeData(this.props.data.allAuthorImages)
    if (authorImages) {
      authorImages = this.props.data.allAuthorImages.edges.map(k => k.node.data).flat()
    }
    const { theme, siteDescription } = this.props.context
    return (
      <SiteContainer {...this.props}> 
          <SEO title="All posts" />
          <div css={mainContainer}>
            <h1 css={heading(theme)}>Welcome to the first full stack CMS built for the modern age.</h1>
            <div css={authorInfoStyle(theme)}>
              {
                authorImages && authorImages.map((image, index) => (
                  <img src={image} css={authorImageStyle(theme)} />
                ))
              }
              <p css={siteDescriptionStyle(theme)}>{siteDescription}</p>
            </div>
            <PostList
              posts={posts}
              highlight={highlight}
            />
          </div>
      </SiteContainer>
    )
  }
}


function BlogIndexWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <BlogIndex {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export default BlogIndexWithContext

const authorInfoStyle = () => css`
  display: flex;
  margin: 0 30px;
  align-items: center;
`

const authorImageStyle = () => css`
  width: 34px;
  border-radius: 17px;
  margin-right: 25px;
`

const siteDescriptionStyle = ({ secondaryFontColor }) => css`
  max-width: 50%;
  color: ${secondaryFontColor};
  font-size: 14px;
  line-height: 22px;
`

const mainContainer = css`
  width: 1220px;
  margin: 0 auto;
`

const heading = ({ fontFamily }) => css`
  width: 50%;
  font-family: ${fontFamily};
  font-size: 44px;
  margin: 110px 30px;
  font-weight: 600;
`

export const pageQuery = graphql`
  query {
    appsync {
      listPosts(limit: 500) {
        items {
          content
          createdAt
          description
          id
          title
          cover_image
          published
        }
      }
    },
    file(relativePath: {eq: "logo.png"}) {
      childImageSharp {
        resize(width: 44) {
          tracedSVG
          aspectRatio
          originalName
          height
          width
          src
        }
      }
    },
    allAuthorImages {
      edges {
        node {
          data
        }
      }
    }
  }
`
