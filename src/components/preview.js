import React from 'react'
import marked from 'marked';
import { css } from '@emotion/core'
import { getPost } from '../graphql/queries'
import { fontFamily } from '../theme'
import PostPreviewComponent from '../components/postPreviewComponent'
import { API, graphqlOperation } from 'aws-amplify'
import getSignedURLs from '../utils/getSignedURLs'

function getMarkdownText(markdown) {
  var rawMarkup = marked(markdown, {sanitize: true});
  return { __html: rawMarkup };
}

class Preview extends React.Component {
  state = {
    isLoading: true,
    post: {}
  }
  async componentDidMount() {
    const { id } = this.props

    try {
      const postData = await API.graphql(graphqlOperation(getPost, { id }))
      const { getPost: post } = postData.data
  
      const updatedContent = await getSignedURLs(post.content)
      post['content'] = updatedContent
      console.log('post:', post)
      
      this.setState({ post, isLoading: false })
    } catch (err) { console.log({ err })}
  }
  render() {
    const { isLoading } = this.state
    if (isLoading) return (
      <p css={loading}>Loading...</p>
    )
    const { cover_image, title, createdAt, content } = this.state.post
    return (
      <>
        <PostPreviewComponent
          cover_image={cover_image}
          title={title}
          createdAt={createdAt}
          content={content}
        />        
      </>
    )
  }
}

const loading = css`
  font-family: ${fontFamily} !important;
`

const dateStyle = css`
  font-size: 14px !important;
  color: rgba(0, 0, 0, .5);
  font-family: ${fontFamily} !important;
`

const coverImage = css`
  margin: 0px;
`

const container = css`
  padding: 20px 0px;
`

export default Preview