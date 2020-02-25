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
        if  (user.signInUserSession.idToken.payload['cognito:groups']) {
          const groups = user.signInUserSession.idToken.payload['cognito:groups']
          if (groups.includes("Admin")) {
            this.setState({ isAdmin: true })
          }
        }
        
      })
      .catch(err => console.log(err));
  }
  render() {
    let posts = this.props.data.appsync.itemsByContentType.items.filter(post => post.published)
    posts = posts.reverse()
    let authorImages = checkNodeData(this.props.data.allAuthorImages)
    if (authorImages) {
      authorImages = this.props.data.allAuthorImages.edges[0].node.data
    }
    const { theme, siteDescription } = this.props.context
    return (
      <SiteContainer {...this.props}> 
          <SEO title="All posts" />
          <div css={mainContainer}>
            <h1 css={heading(theme)}>Welcome to the full stack CMS built for the modern age.</h1>
            <div css={authorInfoStyle(theme, authorImages)}>
              {
                authorImages && authorImages.map((image, index) => (
                  <img key={index} alt="Author" src={image} css={authorImageStyle(theme)} />
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

const authorInfoStyle = (theme, authorImages) => css`
  display: flex;
  margin: 0 30px;
  align-items: center;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid ${authorImages ? 'rgba(0,0,0,0.2)' : 'transparent'};
  }
`

const authorImageStyle = () => css`
  width: 50px;
  border-radius: 25px;
  margin-right: 25px;
  border: 4px solid white;
`

const siteDescriptionStyle = ({ secondaryFontColor }) => css`
  max-width: 50%;
  color: ${secondaryFontColor};
  font-size: 14px;
  line-height: 1.35;
  @media (max-width: 900px) {
    max-width: 100%;
  }
`

const mainContainer = css`
  width: 1220px;
  margin: 0 auto;
  @media (max-width: 1200px) {
    width: 100%;
  }
`

const heading = ({ fontFamily }) => css`
  width: 50%;
  font-family: ${fontFamily};
  font-size: 44px;
  margin: 110px 30px;
  font-weight: 600;
  @media (max-width: 900px) {
    width: 80%;
    font-size: 34px;
  }
`

export const pageQuery = graphql`
  query {
    appsync {
      itemsByContentType(limit: 500, contentType: "Post") {
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
