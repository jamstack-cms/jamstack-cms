import React from "react"
import { navigate, graphql } from "gatsby"
import marked from 'marked';
import { css } from "@emotion/core"
import { BlogContext } from '../context/mainContext'
import PostComponent from '../components/postComponent'
import MainLayout from '../layouts/mainLayout.js'

class BlogPostTemplate extends React.Component { 
  getMarkdownText(markdown) {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
  }
  editPost = () => {
    const { getPost } = this.props.data.appsync
    navigate(`/editpost/${getPost.id}/${getPost.title}/edit`, { replace: true })
  }
  render() {
    const { isAdmin, theme } = this.props.context
    const { title, description, createdAt  } = this.props.data.appsync.getPost
    const { pageContext: { content, local_cover_image, author, authorAvatar } } = this.props

    return (
      <div>
        {
          isAdmin && (
            <button
              onClick={this.editPost}
              css={[editPostButton(theme)]}
            >Edit Post</button>
          )
        }
        <PostComponent
          title={title}
          description={description}
          content={content}
          cover_image={local_cover_image}
          createdAt={new Date(createdAt)}
          authorAvatar={authorAvatar}
          authorName={author}
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


const editPostButton = ({ baseFontWeight, primaryFontColor, fontFamily }) => css`
  cursor: pointer;
  color: ${primaryFontColor};
  font-weight: ${baseFontWeight};
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 15px;
  margin-bottom: 20px;
  outline: none;
  font-family: ${fontFamily};
  @media (max-width: 800px) {
    display: none;
  }
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
    }
  }
`