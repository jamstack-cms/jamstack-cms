import React from 'react'
import { css } from '@emotion/core'
import { getPost } from '../graphql/queries'
import PostComponent from '../components/postComponent'
import { API, graphqlOperation } from 'aws-amplify'
import getSignedUrls from '../utils/getSignedUrls'
import getSignedImage from '../utils/getSignedImage'
import Layout from '../layouts/mainLayout'
import { BlogContext } from '../context/mainContext'

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
      const updatedContent = await getSignedUrls(post.content)
      post['content'] = updatedContent
      if (post['cover_image']) {
        const signedCoverImage = await getSignedImage(post['cover_image'])
        post['cover_image'] = signedCoverImage
      }
      this.setState({ post, isLoading: false })
    } catch (err) { console.log({ err })}
  }
  render() {
    const { isLoading } = this.state
    const { cover_image, title, createdAt, content, description } = this.state.post
    const { context: { theme } } = this.props
    return (
      <Layout>
        { isLoading && (
          <p css={loading(theme)}>Loading...</p>
        )}
        {
          !isLoading && (
            <>
              <PostComponent
                cover_image={cover_image}
                title={title}
                createdAt={new Date(createdAt)}
                content={content}
                description={description}
              />        
            </>
          )
        }
      </Layout>
    )
  }
}

const loading = ({ fontFamily }) => css`
  font-family: ${fontFamily} !important;
  font-weight: 400;
  font-size: 20px;
`

export default function PreviewWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <Preview {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}