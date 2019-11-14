import React from "react"
import { Storage, API, graphqlOperation } from "aws-amplify"
import styledAuthenticator from '../components/styledAuthenticator'
import NewPost from '../components/newPost'
import NewPage from '../components/newPage'
import Layout from '../layouts/mainLayout'
import { itemsByContentType, listPages } from '../graphql/queries'
import { deletePost, updatePost, deletePage, updatePage } from '../graphql/mutations'
import { css } from "@emotion/core"
import TitleComponent from '../components/titleComponent'
import PostList from '../components/postList'
import PageList from '../components/pageList'
import MediaView from '../components/mediaView'
import Settings from '../components/settings'
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
    pages: [],
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
    this.fetchPages()
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
  fetchPages = async () => {
    try {
      const pageData = await API.graphql(graphqlOperation(listPages))
      const { items: pages } = pageData.data.listPages
      if (this.mounted) {
        this.setState({ pages })
      }
    } catch (err) {
      console.log('error fetching posts:', err)
    }
  }
  fetchPosts = async () => {
    try {
      const postData = await API.graphql(graphqlOperation(itemsByContentType, { limit: 500, contentType: "Post" }))
      const { items: posts } = postData.data.itemsByContentType
      const postsWithSignedImages = await Promise.all(posts.map(async post => {
        if (!post.cover_image) return post
        const signedImage = await getSignedImage(post.cover_image)
        post['signedImage'] = signedImage
        return post
      }))
      if (this.mounted) {
        this.setState({ posts: postsWithSignedImages, isLoading: false })
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
    // set base array of images
    let allImageKeys = []
    let contentImageKeys = this.props.data.allImageKeys.edges[0].node.data
    let authorImages = this.props.data.allAuthorImages.edges[0].node.data
    // set image keys currently in use to allImageKeys variable (contentImageKeys + authorImages)
    if (contentImageKeys !== 'none') {
      allImageKeys = [...contentImageKeys]
    }
    if (authorImages !== 'none') {
      authorImages = authorImages.map(image => {
        image = image.split('/')
        image = `images/${image[image.length - 1]}`
        return image
      })
      allImageKeys = [...allImageKeys, ...authorImages]
    }
    if (!allImageKeys.length) return
    const signedImages = this.state.images
    const imagesInUse = []
    const imagesNotInUse = []
    signedImages.forEach(image => {
      const key = getImageKey(image)
      const keyWithPath = `images/${key}`
      allImageKeys.forEach(k => {
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
  unPublishPost = async ({ id }) => {
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
  publishPage = async ({ id }) => {
    const shouldPublish = window.confirm("Are you sure you'd like to publish this page?");
    if (shouldPublish) {
      const pages = [...this.state.pages]
      const pageIndex = pages.findIndex(page => page.id === id)
      pages[pageIndex]['published'] = true
      try {
        await API.graphql(graphqlOperation(updatePage, { input: { id, published: true }}))
        toast(`🔥 Page successfully published!`)
        this.setState({ pages })
      } catch (err) {
        console.log('error publishing page..:', err)
      }
    }
  }
  unpublishPage = async ({ id }) => {
    const shouldUnpublish = window.confirm("Are you sure you'd like to unpublish this page?");
    if (shouldUnpublish) {
      const pages = [...this.state.pages]
      const pageIndex = pages.findIndex(page => page.id === id)
      pages[pageIndex]['published'] = false
      try {
        await API.graphql(graphqlOperation(updatePage, { input: { id, published: false }}))
        toast(`Page successfully unpublished!`)
        this.setState({ pages })
      } catch (err) {
        console.log('error unpublishing page..:', err)
      }
    }
  }
  deletePage = async id => {
    const shouldDelete = window.confirm("Are you sure you'd like to delete this page?");
    if (shouldDelete) {
      try {
        const pages = [...this.state.pages].filter(page => page.id !== id)
        this.setState({ pages })
        await API.graphql(graphqlOperation(deletePage, { input: { id }}))
        toast("Page successfully deleted.")
      } catch (err) {
        console.log('error deleting page...: ', err)
      }
    }
  }
  render() {
    const { viewState, isLoading, pageTemplate } = this.state
    const { theme, theme: { primaryFontColor, highlight }} = this.props.context
    const highlightButton = state => css`
      color: ${state === viewState ? highlight: primaryFontColor};
    `

    return (
        <div css={container}>
          <Layout>
            <TitleComponent title='Admin' />
            <div css={[buttonContainer(theme)]}>
              <button
                onClick={() => this.toggleViewState('listPosts')}
                css={[adminButtonStyle(theme), highlightButton('listPosts')]}
              >View Posts</button>
              <button
                css={[adminButtonStyle(theme), highlightButton('createPost')]}
                onClick={() => this.toggleViewState('createPost')}
              >New Post</button>
              <button
                onClick={() => this.toggleViewState('media')}
                css={[adminButtonStyle(theme), highlightButton('media')]}
              >View Media</button>
              <button
                css={[adminButtonStyle(theme), highlightButton('listPages')]}
                onClick={() => this.toggleViewState('listPages')}
              >View Pages</button>
              <button
                css={[adminButtonStyle(theme), highlightButton('createPage')]}
                onClick={() => this.toggleViewState('createPage')}
              >New Page</button>
              <button
                css={[adminButtonStyle(theme), highlightButton('settings')]}
                onClick={() => this.toggleViewState('settings')}
              >Settings</button>
              {
                viewState === 'createPage' && (
                  <select css={selectMenu} value={pageTemplate} onChange={this.updatePageTemplate}>
                    <option value='hero'>Hero</option>
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
                    fixedWidthImages
                    deletePost={this.deletePost}
                    publishPost={this.publishPost}
                    unPublishPost={this.unPublishPost}
                    toggleViewState={this.toggleViewState}
                    isLoading={isLoading}
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
            viewState === 'listPages' && (
              (
                <Layout noPadding>
                  <PageList
                    pages={this.state.pages}
                    deletePage={this.deletePage}
                    fetchPages={this.fetchPages}
                    publishPage={this.publishPage}
                    unpublishPage={this.unpublishPage}
                    toggleViewState={this.toggleViewState}
                  />
                </Layout>
              )
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

const buttonContainer = ({ borderColor }) => css`
  border-bottom: 1px solid ${borderColor};
  padding-bottom: 10px;
  margin-top: 20px;
`

const adminButtonStyle = ({ fontFamily }) => css`
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

// function AdminWithContext(props) {
//   return (
//     <BlogContext.Consumer>
//       {
//         context => <Admin {...props} context={context} />
//       }
//     </BlogContext.Consumer>
//   )
// }

function AdminWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <Admin {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export default styledAuthenticator(AdminWithContext)

export const adminQuery = graphql`
  query adminQuery {
    allImageKeys {
      edges {
        node {
          data
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
