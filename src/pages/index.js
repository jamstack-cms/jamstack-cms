import React from "react"

import SiteContainer from '../components/site-container'
import SEO from "../components/seo"
import MainLayout from '../layouts/mainLayout'
import { BlogContext } from '../context/mainContext'
import { css } from '@emotion/core'
import { graphql } from 'gatsby'

import { highlight } from '../theme'
import PostList from '../components/postList'

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
    return (
      <SiteContainer {...this.props}> 
          <SEO title="All posts" />
          <div css={postContainer}>
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
    <MainLayout>
      <BlogContext.Consumer>
        {
          context => <BlogIndex {...props} context={context} />
        }
      </BlogContext.Consumer>
    </MainLayout>
  )
}

export default BlogIndexWithContext

const postContainer = css`
  width: 690px;
  margin: 0 auto;
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
    }
  }
`
