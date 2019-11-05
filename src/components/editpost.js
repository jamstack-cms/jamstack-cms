import React from 'react'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { css } from "@emotion/core"

import MainLayout from '../layouts/mainLayout'
import Button from './button'
import PostComponent from './postComponent'
import FormComponent from './formComponent'
import ImageLinkOverlay from './imageLinkOverlay'
import FileInput from './input'
import { updatePost } from '../graphql/mutations'
import { getPost } from '../graphql/queries'
import { BlogContext } from '../context/mainContext'
import getSignedUrls from '../utils/getSignedUrls'
import getUnsignedUrls from '../utils/getUnsignedUrls'
import getKeyWithPath from '../utils/getKeyWithPath'
import saveFile from '../utils/saveFile'
import { generatePreviewLink as generateLink, copyToClipboard, getTrimmedKey } from '../utils/helpers'
import { toast } from 'react-toastify';

const initialPostState = {
  post: {
    id: '',
    title: '',
    content: '',
    description: '',
    createdAt: '',
    previewEnabled: false,
    published: false,
    authorName: '',
    authorAvatar: null
  }
}

class EditPost extends React.Component {
  state = {
    file: {},
    hasChanged: false,
    isLoading: true,
    isEditing: false,
    post: initialPostState,
    showOverlay: false,
    trimmedKey: '',
    uploadedImageUrl: '',
    // loading indicators
    isSaving: false,
    isUploadingImage: false,
    isPublishing: false,
    isGeneratingPreview: false
  }
  async componentDidMount() {
    const { id } = this.props
    let wildcard = this.props["*"]    
    if (wildcard === 'edit') {
      this.setState({ isEditing: true })
    }
    try {
      let authorAvatar
      const postData = await API.graphql(graphqlOperation(getPost, { id }))
      console.log('postData: ', postData)
      const { getPost: post } = postData.data
      if (post.author.avatarUrl) {
        authorAvatar = await Storage.get(post.author.avatarUrl)
      }
      if (wildcard !== 'edit') {
        const updatedContent = await getSignedUrls(post.content)
        post['content'] = updatedContent
      }
      if (post['cover_image']) {
        const coverImage = await Storage.get(getKeyWithPath(post['cover_image']))
        post['cover_image'] = coverImage
      }
      this.setState({
        authorName: post.author.username,
        post, isLoading: false,
        authorAvatar: authorAvatar ? authorAvatar : null })
    } catch (err) { console.log({ err })}
  }
  setPost = (key, value) => {
    if (!this.state.hasChanged) this.setState({ hasChanged: true })
    this.setState({
      post: {
        ...this.state.post,
        [key]: value
      }
    })
  }
  uploadCoverImage = (event) => {
    const { target: { files } } = event
    const fileForUpload = files[0]
    this.setState({
      hasChanged: true,
      post: {
        ...this.state.post,
        cover_image: URL.createObjectURL(event.target.files[0]),
      },
      file: fileForUpload
    })
  }
  uploadImage = async event => {
    this.setState({ isUploadingImage: true })
    const { target: { files } } = event
    const fileForUpload = files[0]
    this.setState({
      file: fileForUpload
    }, async () => {
      try {
        const { url } = await saveFile(this.state.file)
        this.setState({
          uploadedImageUrl: url,
          isUploadingImage: false,
          showOverlay: true,
          trimmedKey: getTrimmedKey(url, 20)
        })
      } catch (err) {
        console.log('error: ', err)
      }
    }) 
  }
  toggleEditView = async editState => {
    const { post: { content } } = this.state
    let { isEditing } = this.state
    if (editState === 'viewPost') {
      isEditing = true
    }
    if (editState === 'viewEditor') {
      isEditing = false
    }
    if (isEditing) {
      const updatedContent = await getSignedUrls(content)
      this.setState({
        isEditing: false,
        post: {
          ...this.state.post,
          content: updatedContent
        }
      })
    } else {
      const updatedContent = await getUnsignedUrls(content)
      this.setState({
        isEditing: true,
        post: {
          ...this.state.post,
          content: updatedContent
        }
      })
    }
  }
  updatePost = async publishedState => {
    const { author, ...input } = this.state.post
    
    if (!publishedState) {
      this.setState({ isSaving: true })
      if (this.state.file && this.state.file.name) {
        const { url: fileForUpload } = await saveFile(this.state.file)
        input['cover_image'] = fileForUpload
      }
    } else {
      this.setState({ isPublishing: true })
      if(publishedState === 'publish') {
        input['published'] = true
      } else {
        input['published'] = false
      }
    }
    await API.graphql(graphqlOperation(updatePost, {input}))
    this.setState({
      hasChanged: false, isSaving: false, isPublishing: false
    })
    if(publishedState === 'publish') {
      this.setState({ post: {...this.state.post, published: true }})
      toast("Successfully published post!")
    }
    if(publishedState === 'unpublish') {
      this.setState({ post: {...this.state.post, published: false }})
      toast("Successfully unpublished post!")
    }
    if (!publishedState) {
      toast("Successfully updated post!")
    }
    this.toggleEditView('viewPost')
  }
  copyPreviewLink = () => {
    const link = generateLink(this.state.post, this.props.location)
    copyToClipboard(link)
  }
  copyUploadedImageLink = () => {
    copyToClipboard(this.state.uploadedImageUrl)
    setTimeout(() => {
      this.setState({ showOverlay: false })
    }, 500)
  }
  generatePreviewLink = async () => {
    this.setState({ isGeneratingPreview: true })
    const { id } = this.state.post
    const link = generateLink(this.state.post, this.props.location)
    const input = {
      id,
      previewEnabled: true
    }
    await API.graphql(graphqlOperation(updatePost, {input}))
    copyToClipboard(link)
    this.setState({
      isGeneratingPreview: false,
      post: {
        ...this.state.post,
        previewEnabled: true
      }
    })
  }
  render() {
    const { window } = this.props.context
    const { isEditing, isLoading, hasChanged, showOverlay, authorName,
    isSaving, isGeneratingPreview, isUploadingImage, isPublishing, authorAvatar } = this.state
    const { title, content, createdAt, cover_image, previewEnabled, description, published } = this.state.post
    const { theme } = this.props.context
    if (isLoading) return <p css={loading(theme)}>Loading...</p>
    console.log('post: ', this.state.post)
    return (
      <div>
        <div css={[fixedPreview]}>
          {
            isEditing ? (
              <>
                <Button
                  onClick={this.toggleEditView}
                  title="Preview"
                  customCss={[baseButton, fixedButton(theme)]}
                />
                {
                  hasChanged && (
                    <Button
                      onClick={() => this.updatePost()}
                      title="Save"
                      customCss={[baseButton, fixedButton(theme)]}
                      customLoadingCss={[sideLoadingStyle]}
                      isLoading={isSaving}
                    />
                  )
                }
                <Button
                  onClick={() => this.updatePost(published ? 'unpublish' : 'publish')}
                  title={published ? "Unpublish" : "Publish"}
                  customCss={[baseButton, fixedButton(theme)]}
                  customLoadingCss={[sideLoadingStyle]}
                  isLoading={isPublishing}
                />
                <FileInput
                  placeholder="Upload Image"
                  onChange={this.uploadImage}
                  labelStyle={[baseButton, fixedButton(theme)]}
                  customLoadingCss={[sideLoadingStyle]}
                  isLoading={isUploadingImage}
                />
                <FileInput
                  placeholder={cover_image ? "Update Cover Image" : "Upload Cover Image"}
                  labelStyle={[baseButton, fixedButton(theme)]}
                  onChange={this.uploadCoverImage}
                />
              </>
            ) : (
              <>
                <Button
                  onClick={this.toggleEditView}
                  title="Edit"
                  customCss={[baseButton, fixedButton(theme)]}
                  customLoadingCss={[sideLoadingStyle]}
                />
                {hasChanged && (
                  <Button
                    onClick={() => this.updatePost()}
                    title="Save"
                    customCss={[baseButton, fixedButton(theme)]}
                    customLoadingCss={[sideLoadingStyle]}
                    isLoading={isSaving}
                  />
                )}
              </>
            )
          }
          <Button
            onClick={previewEnabled ? this.copyPreviewLink : this.generatePreviewLink}
            title={previewEnabled ? "Preview link" : "Generate preview"}
            customCss={[baseButton, fixedButton(theme), alignLeft]}
            customLoadingCss={[previewLoading]}
            isLoading={isGeneratingPreview}
          />
        </div>
        {
          isEditing ? (
            <>
              <FormComponent
                cover_image={cover_image}
                title={title}
                description={description}
                content={content}
                setPost={this.setPost}
                window={window}
              />                         
            </>
          ) : (
            <>
              <PostComponent
                title={title}
                description={description}
                content={content}
                cover_image={cover_image}
                createdAt={new Date(createdAt)}
                authorAvatar={authorAvatar}
                authorName={authorName}
              />
            </>
          )
        }
        {
          showOverlay && (
            <ImageLinkOverlay
              imageKey={this.state.trimmedKey}
              copyUploadedImageLink={this.copyUploadedImageLink}
            />
          )
        }
      </div>
    )
  }
}

function EditPostWithContext(props) {
  return (
    <MainLayout>
      <BlogContext.Consumer>
        {
          context => <EditPost {...props} context={context} />
        }
      </BlogContext.Consumer>
    </MainLayout>
  )
}

export default EditPostWithContext

const loading = ({ fontFamily }) => css`
  font-family: ${fontFamily} !important;
  font-weight: 400;
  font-size: 20px;
`

const alignLeft = css`
  text-align: left;
`

const fixedButton = ({ fontFamily }) => css`
  font-family: ${fontFamily} !important;
  border: none;
  background-color: transparent;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
`

const fixedPreview = css`
  position: fixed;
  width: 150px;
  margin-top: 30vh;
  margin-left: -150px;
  display: flex;
  flex-direction: column;
`

const baseButton = css`
  margin-top: 12px;
  line-height: 20px;
`

const sideLoadingStyle = css`
  margin-top: 12px;
  margin-right: -4px;
`

const previewLoading = css`
  ${sideLoadingStyle};
  margin-top: 22px;
`