import React from "react"
import { Storage, API, graphqlOperation } from "aws-amplify"
import styledAuthenticator from '../components/styledAuthenticator'
import NewPost from '../components/newPost'
import NewPage from '../components/newPage'
import Layout from '../layouts/mainLayout'
import { listPosts } from '../graphql/queries'
import { deletePost, updatePost } from '../graphql/mutations'
import { css } from "@emotion/core"
import TitleComponent from '../components/titleComponent'
import PostList from '../components/postList'
import MediaView from '../components/mediaView'
import Settings from '../components/settings'
import { fontFamily } from '../theme'
import getImageKey from '../utils/getImageKey'
import { toast } from 'react-toastify'
import JakobsLoader from '../components/jakobsLoader'
import { BlogContext } from '../context/mainContext'
import { graphql } from 'gatsby'
import getSignedImage from '../utils/getSignedImage'

class Admin extends React.Component {
  state = {
    isLoading: true,
    viewState: 'listPosts',
    posts: [],
    images: [],
    imageKeys: [],
    imagesInUse: [],
    imagesNotInUse: [],
    pageTemplate: 'hero',
  }
  mounted = false
  async componentDidMount() {
    this.mounted = true
    this.fetchPosts()
    try {
      const media = await Storage.list('')
      const images = media.map(k => Storage.get(k.key))
      const signedImages = await Promise.all(images)
      if (this.mounted) {
        this.setState({ images: signedImages }, () => {
          this.setImagesInUse()
        })
      }
    } catch(err) {
      console.log('error:' , err)
    }
  }
  updatePageTemplate = e => {
    this.setState({
      pageTemplate: e.target.value
    })
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  fetchPosts = async () => {
    try {
      const postData = await API.graphql(graphqlOperation(listPosts))
      const { items: posts } = postData.data.listPosts
      const postsWithSignedImages = await Promise.all(posts.map(async post => {
        const signedImage = await getSignedImage(post.cover_image)
        post['signedImage'] = signedImage
        return post
      }))
      if (this.mounted) {
        this.setState({ posts, isLoading: false })
      }
    } catch (err) {
      console.log('error fetching posts:', err)
    }
  }
  removeImage = (image) => {
    const images = [...this.state.images.filter(i => i !== image)]
    this.setState({ images }, () => {
      this.setImagesInUse()
    })
  }
  setImagesInUse = () => {
    let imageKeys = this.props.data.allImageKeys.edges.map(k => k.node.data).flat()
    const signedImages = this.state.images
    const imagesInUse = []
    const imagesNotInUse = []
    signedImages.forEach(image => {
      const key = getImageKey(image)
      const keyWithPath = `images/${key}`
      imageKeys.forEach(k => {
        if (k === keyWithPath) {
          imagesInUse.push(image)
        }
      })
    })
    signedImages.forEach(image => {
      if (!imagesInUse.includes(image)) {
        imagesNotInUse.push(image)
      }
    })
    this.setState({ imagesInUse, imagesNotInUse: [...new Set(imagesNotInUse)] })
  }
  addImageToState = images => {
    this.setState({ images }, () => {
      this.setImagesInUse()
    })
  }
  toggleViewState = viewState => this.setState({ viewState })
  deletePost = async ({ id }) => {
    const shouldDelete = window.confirm("Are you sure you'd like to delete this post?");
    if (shouldDelete) {
      const posts = [...this.state.posts.filter(post => post.id !== id)]
      this.setState({ posts })
      try {
        await API.graphql(graphqlOperation(deletePost, { input: { id }}))
        console.log('post successfully deleted!')
      } catch (err) {
        console.log('error deleting post..:', err)
      }
    }
  }
  publishPost = async ({ id }) => {
    const shouldPublish = window.confirm("Are you sure you'd like to publish this post?");
    if (shouldPublish) {
      const posts = [...this.state.posts]
      const postIndex = posts.findIndex(post => post.id === id)
      posts[postIndex]['published'] = true
      try {
        await API.graphql(graphqlOperation(updatePost, { input: { id, published: true }}))
        toast(`🔥 Post successfully published!`)
        this.setState({ posts })
      } catch (err) {
        console.log('error publishing post..:', err)
      }
    }
  }
  unPublishPost = async ({ id }) => {
    const shouldUnPublish = window.confirm("Are you sure you'd like to unpublish this post?");
    if (shouldUnPublish) {
      const posts = [...this.state.posts]
      const postIndex = posts.findIndex(post => post.id === id)
      posts[postIndex]['published'] = false
      try {
        await API.graphql(graphqlOperation(updatePost, { input: { id, published: false }}))
        toast(`Post successfully unpublished!`)
        this.setState({ posts })
      } catch (err) {
        console.log('error unpublishing post..:', err)
      }
    }
  }
  render() {
    const { viewState, isLoading, pageTemplate } = this.state
    const { borderColor, primaryFontColor, highlight } = this.props.context.theme
    const highlightButton = state => css`
      color: ${state === viewState ? highlight: primaryFontColor};
    `
    const themedButtonContainer = css`
      border-bottom: 1px solid ${borderColor};
    `
    return (
        <div css={container}>
          <Layout>
            <TitleComponent title='Admin' />
            <div css={[buttonContainer, themedButtonContainer]}>
              <button
                onClick={() => this.toggleViewState('listPosts')}
                css={[adminButtonStyle, highlightButton('listPosts')]}
              >View Posts</button>
              <button
                onClick={() => this.toggleViewState('media')}
                css={[adminButtonStyle, highlightButton('media')]}
              >View Media</button>
              <button
                css={[adminButtonStyle, highlightButton('createPost')]}
                onClick={() => this.toggleViewState('createPost')}
              >New Post</button>
              <button
                css={[adminButtonStyle, highlightButton('createPage')]}
                onClick={() => this.toggleViewState('createPage')}
              >New Page</button>
              <button
                css={[adminButtonStyle, highlightButton('settings')]}
                onClick={() => this.toggleViewState('settings')}
              >Settings</button>
              {
                viewState === 'createPage' && (
                  <select css={selectMenu} value={pageTemplate} onChange={this.updatePageTemplate}>
                    <option value='hero'>Hero</option>
                    <option value='sidebar'>Sidebar</option>
                  </select>
                )
              }
            </div>
          </Layout>
          {
            isLoading && viewState === 'listPosts' && (
            <Layout>
              <JakobsLoader />
            </Layout>)
          }
          {
            viewState === 'listPosts' && (
              (
                <Layout noPadding>
                  <PostList
                    posts={this.state.posts}
                    highlight={highlight}
                    isAdmin={true}
                    deletePost={this.deletePost}
                    publishPost={this.publishPost}
                    unPublishPost={this.unPublishPost}
                  />
                </Layout>
              )
            )
          }
          {
            viewState === 'createPost' && (
              <Layout noPadding>
                <NewPost
                  toggleViewState={this.toggleViewState}
                  fetchPosts={this.fetchPosts}
                />
              </Layout>
            )
          }
          {
            viewState === 'media' && (
              <Layout noPadding>
                <MediaView
                  toggleViewState={this.toggleViewState}
                  images={this.state.images}
                  addImageToState={this.addImageToState}
                  imagesInUse={this.state.imagesInUse}
                  imagesNotInUse={this.state.imagesNotInUse}
                  removeImage={this.removeImage}
                />
              </Layout>
            )
          }
          {
            viewState === 'createPage' && (
              <div>
                <NewPage
                  template={pageTemplate}
                  toggleViewState={this.toggleViewState}
                  images={this.state.images}
                  addImageToState={this.addImageToState}
                  imagesInUse={this.state.imagesInUse}
                  imagesNotInUse={this.state.imagesNotInUse}
                  removeImage={this.removeImage}
                />
              </div>
            )
          }
          {
            viewState === 'settings' && (
              <div>
                <Settings
                  toggleViewState={this.toggleViewState}
                />
              </div>
            )
          }
        </div>
    )
  }
}

const selectMenu = css`
  outline: none;
  border: none;
`

const buttonContainer = css`
  padding-bottom: 10px;
  margin-top: 20px;
`

const adminButtonStyle = css`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin-right: 15px;
  font-size: 16px;
  font-family: ${fontFamily};
  opacity: 1;
  cursor: pointer;
  &:hover {
    opacity: .8;
  }
`

const container = css`
`

function AdminWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <Admin {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export const themeQuery = graphql`
  query themeQuery {
    allImageKeys {
      edges {
        node {
          data
        }
      }
    },
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

export default styledAuthenticator(AdminWithContext)