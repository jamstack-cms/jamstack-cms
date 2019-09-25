import React from 'react'
import uuid from 'uuid/v4'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { css } from "@emotion/core"
import { toast } from 'react-toastify'

import Button from './button'
import PostComponent from './postComponent'
import FormComponent from './formComponent'
import ImageLinkOverlay from './imageLinkOverlay'
import FileInput from './input'
import { updatePost } from '../graphql/mutations'
import { getPost } from '../graphql/queries'
import { BlogContext } from './context'
import { highlight, fontFamily } from '../theme'
import getSignedUrls from '../utils/getSignedUrls'
import getUnsignedUrls from '../utils/getUnsignedUrls'
import getKeyWithPath from '../utils/getKeyWithPath'
import saveFile from '../utils/saveFile'
import { generatePreviewLink as generateLink, copyToClipboard, getTrimmedKey } from '../utils/helpers'

const initialPostState = {
  post: {
    id: '',
    title: '',
    content: '',
    description: '',
    createdAt: '',
    previewEnabled: false,
  }
}

class PostRoute extends React.Component {
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
    isGeneratingPreview: false
  }
  static contextType = BlogContext
  async componentDidMount() {
    const { id } = this.props
    let wildcard = this.props["*"]
    
    if (wildcard === 'edit') {
      this.setState({ isEditing: true })
    }
    try {
      const postData = await API.graphql(graphqlOperation(getPost, { id }))
      const { getPost: post } = postData.data
      if (wildcard !== 'edit') {
        const updatedContent = await getSignedUrls(post.content)
        post['content'] = updatedContent
      }
      if (post['cover_image']) {
        const coverImage = await Storage.get(getKeyWithPath(post['cover_image']))
        post['cover_image'] = coverImage
      }
      this.setState({ post, isLoading: false })
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
  updatePost = async () => {
    this.setState({ isSaving: true })
    const input = {...this.state.post}
    if (this.state.file && this.state.file.name) {
      const { url: fileForUpload } = await saveFile(this.state.file)
      input['cover_image'] = fileForUpload
    }
    await API.graphql(graphqlOperation(updatePost, {input}))
    this.setState({ hasChanged: false, isSaving: false })
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
      post: {
        ...this.state.post,
        previewEnabled: true,
        isGeneratingPreview: false
      }
    })
    toast(`Success! Link copied to clipboard.`)
  }
  render() {
    const { window } = this.context
    const { isEditing, isLoading, hasChanged, showOverlay,
    isSaving, isGeneratingPreview, isUploadingImage } = this.state
    const { title, content, createdAt, cover_image, previewEnabled, description  } = this.state.post
    
    if (isLoading) return <p css={loading}>Loading...</p>
    console.log('isEditing: ', isEditing)
    return (
      <div>
        <div css={[fixedPreview]}>
          {
            isEditing ? (
              <>
                <Button
                  onClick={this.toggleEditView}
                  title="Preview"
                  customCss={[baseButton, fixedButton]}
                />
                {
                  hasChanged && (
                    <Button
                      onClick={this.updatePost}
                      title="Save"
                      customCss={[baseButton, fixedButton]}
                      customLoadingCss={[sideLoadingStyle]}
                      isLoading={isSaving}
                    />
                  )
                }
                <FileInput
                  placeholder="Upload Image"
                  onChange={this.uploadImage}
                  labelStyle={[baseButton, fixedButton]}
                  customLoadingCss={[sideLoadingStyle]}
                  isLoading={isUploadingImage}
                />
                <FileInput
                  placeholder={cover_image ? "Update Cover Image" : "Upload Cover Image"}
                  labelStyle={[baseButton, fixedButton]}
                  onChange={this.uploadCoverImage}
                />
              </>
            ) : (
              <>
                <Button
                  onClick={this.toggleEditView}
                  title="Edit"
                  customCss={[baseButton, fixedButton]}
                  customLoadingCss={[sideLoadingStyle]}
                />
                {hasChanged && (
                  <Button
                    onClick={this.updatePost}
                    title="Save"
                    customCss={[baseButton, fixedButton]}
                    customLoadingCss={[sideLoadingStyle]}
                    isLoading={isSaving}
                  />
                )}
              </>
            )
          }
          {
            previewEnabled ? (
              <Button
                onClick={this.copyPreviewLink}
                title="Preview link"
                customCss={[baseButton, fixedButton, alignLeft]}
              />
            ) : (
              <Button
                onClick={() => this.generatePreviewLink()}
                title="Generate preview"
                customCss={[baseButton, fixedButton, alignLeft]}
                customLoadingCss={[sideLoadingStyle]}
              />
            )
          }
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

const loading = css`
  font-family: ${fontFamily} !important;
  font-weight: 400;
  font-size: 22px;
`

const alignLeft = css`
  text-align: left;
`

const fixedButton = css`
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
  font-weight: 700;
  margin-left: -150px;
  display: flex;
  flex-direction: column;
`

const baseButton = css`
  margin-top: 12px;
  line-height: 20px;
`

const loadingStyle = css`
  margin-top: 21px;
  margin-left: 12px;
  margin-right: -4px;
`

const sideLoadingStyle = css`
  margin-top: 12px;
  margin-right: -4px;
`

const lastButton = css`
border: none;
`

const preview = css`
  ${baseButton};
`

const coverImageButton = css`
  ${baseButton};
  border: 1px solid #ededed;
`

export default PostRoute