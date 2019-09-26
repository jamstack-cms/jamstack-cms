import React from "react"
import { navigate, graphql } from "gatsby"
import marked from 'marked';
import { css } from "@emotion/core"
import { BlogContext } from '../context/mainContext'
import { fontFamily } from '../theme'
import PostComponent from '../components/postComponent'
import MainLayout from '../layouts/mainLayout.js'

class BlogPostTemplate extends React.Component {
  static contextType = BlogContext
  
  getMarkdownText(markdown) {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
  }
  editPost = () => {
    const { getPost } = this.props.data.appsync
    navigate(`/editpost/${getPost.id}/${getPost.title}/edit`, { replace: true })
  }
  render() {
    const { isAdmin } = this.context
    const { title, description, createdAt  } = this.props.data.appsync.getPost
    const { pageContext: { content, local_cover_image } } = this.props

    return (
      <div>
        {
          isAdmin && (
            <button
              onClick={this.editPost}
              css={editPostButton}
            >Edit Post</button>
          )
        }
        <PostComponent
          title={title}
          description={description}
          content={content}
          cover_image={local_cover_image}
          createdAt={new Date(createdAt)}
        />
      </div>
    )
  }
}

function BlogPostTemplateWithContext(props) {
  return (
    <MainLayout>
      <BlogContext.Consumer>
        {
          context => <BlogPostTemplate {...props} context={context} />
        }
      </BlogContext.Consumer>
    </MainLayout>
  )
}

export default BlogPostTemplateWithContext


const editPostButton = css`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 15px;
  margin-bottom: 20px;
  font-weight: 400;
  outline: none;
  font-family: ${fontFamily};
`


export const pageQuery = graphql`
  query BlogPostByID($id: ID!) {
    appsync {
      getPost(id: $id) {
        id
        title
        createdAt
        description
        content
        cover_image
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