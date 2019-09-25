import React from 'react'
import { css } from "@emotion/core"
import marked from 'marked';
import Button from './button'
import FileInput from './input'
import FormComponent from './formComponent'
import { ContextProviderComponent, BlogContext } from './context'
import { createPost } from '../graphql/mutations'
import {  API, graphqlOperation } from 'aws-amplify'
import format from 'date-fns/format'
import { highlight, fontFamily } from '../theme'
import saveFile from '../utils/saveFile'
import { getTrimmedKey, copyToClipboard } from '../utils/helpers'
import { toast } from 'react-toastify'
import ImageLinkOverlay from './imageLinkOverlay'
import getSignedUrls from '../utils/getSignedUrls'
import getUnsignedUrls from '../utils/getUnsignedUrls'

const postState = {
  content: '',
  title: '',
  description: ''
}

class NewPost extends React.Component {
  state = {
    post: postState,
    cover_image: '',
    file: {},
    isEditing: true,
    uploadedImageUrl: false,
    showOverlay: false,
    trimmedKey: '',
    // loading state
    isUploadingImage: false,
    isPublishing: false,
    isSaving: false
  }
  setPost = (key, value) => {
    this.setState({
      post: {
        ...this.state.post,
        [key]: value
      }
    })
  }
  toggleInput = async () => {
    const { isEditing, post: { content } } = this.state
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
  publish = async (isPublished) => {
    const { file, post, post: { title, content, description } } = this.state
    if (!title || !content) return
    if (isPublished) {
      this.setState({ isPublishing: true })
    } else (
      this.setState({ isSaving: true })
    )
    if (file.name) {
      const { url: fileForUpload } = await saveFile(file)
      post['cover_image'] = fileForUpload
    }
    if (isPublished) {
      post['published'] = true
    } else {
      post['published'] = false
    }
    const postInput = {title, content}

    if (description) {
      postInput.description = description
    }

    try {
      await API.graphql(graphqlOperation(createPost, { input: post }))
      this.setState({ isSaving: false, isPublishing: false, post: postState })
      this.props.toggleViewState('list')
      toast(`Post successfully ${isPublished ? "published" : "saved"}!`)
      this.props.fetchPosts()
    } catch (err) {
      this.setState({ isPublishing: false })
      console.log({ err })
    }
  }

  getMarkdownText(markdown) {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
  }
  setCoverImage = (event) => {
    const { target: { files } } = event
    const fileForUpload = files[0]
    this.setState({
      cover_image: URL.createObjectURL(event.target.files[0]),
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
          showOverlay: true,
          trimmedKey: getTrimmedKey(url, 20),
          isUploadingImage: false
        })
      } catch (err) {
        console.log('error: ', err)
      }
    }) 
  }
  copyUploadedImageLink = () => {
    copyToClipboard(this.state.uploadedImageUrl)
    setTimeout(() => {
      this.setState({ showOverlay: false })
    }, 500)
  }
  render() {
    const { trimmedKey, showOverlay, isEditing, cover_image,
      isUploadingImage, isPublishing, isSaving,
      post: { title, description, content } } = this.state
    const { window } = this.props.context
    console.log('trimmedKey: ', trimmedKey)
    const dynamicPreviewButton = css`
      color: ${highlight};
    `
    return (
      <div css={container}>
        {
          isEditing ? (
            <div>
              <button onClick={this.toggleInput} css={[fixedPreview, dynamicPreviewButton]}>
                Preview
              </button>
            </div>
          ) : (
            <button onClick={this.toggleInput} css={[fixedPreview, dynamicPreviewButton]}>
              Edit
            </button>
          )
        }
        {
          isEditing ? (
            <div css={textareaContainer}>
              <FormComponent
                cover_image={cover_image}
                title={title}
                content={content}
                description={description}
                setPost={this.setPost}
                window={window}
              />
              <div css={buttonContainer}>
                
              </div>
            </div>
          ) : (
            <div>
              {
                cover_image && <img object-fit="contain" alt="cover" css={coverImage} src={cover_image} />
              }
              <div css={postPreview} className="blog-post">
                <h1 css={previewTitleStyle}>{this.state.post.title}</h1>
                <p css={previewDescriptionStyle}>{this.state.post.description}</p>
                <p css={dateStyle}>{format(new Date(), 'MMMM dd yyyy')}</p>
                <section
                  css={blogPost}
                  dangerouslySetInnerHTML={this.getMarkdownText(this.state.post.content)}
                />
              </div>
            </div>
          )
        }
        <div css={buttonContainer}>
            <Button
              onClick={() => this.toggleInput()}
              title={isEditing ? "Preview" : "Edit"}
              customCss={[preview, baseButton]}
              customLoadingCss={[loadingStyle]}
            />
            <Button
            onClick={() => this.publish()}
            title="Publish"
            customCss={[publish, baseButton]}
            customLoadingCss={[loadingStyle]}
            isLoading={isPublishing}
          />
          <Button
            onClick={() => this.publish()}
            title="Save"
            customCss={[publish, baseButton]}
            customLoadingCss={[loadingStyle]}
            isLoading={isSaving}
          />
          {
            isEditing && (
              <>

                <FileInput
                  placeholder={`${cover_image ? "Update Cover Image" : "Add Cover Image" }`}
                  customCss={[imageButton]}
                  labelStyle={[baseButton]}
                  onChange={this.setCoverImage}
                />
                <FileInput
                  placeholder="Upload Image"
                  customCss={[imageButton]}
                  onChange={this.uploadImage}
                  isLoading={isUploadingImage}
                  customLoadingCss={[loadingStyle]}
                />
              </>
            )
          }
        </div>
        {
          showOverlay && (
            <ImageLinkOverlay
              imageKey={trimmedKey}
              copyUploadedImageLink={this.copyUploadedImageLink}
            />
          )
        }
      </div>
    )
  }
}

const loadingStyle = css`
  margin-top: 21px;
  margin-left: 12px;
  margin-right: -4px;
`

const dateStyle = css`
  margin-top: 0px;
  font-size: 15px !important;
  font-family: ${fontFamily} !important;
`

const previewTitleStyle = css`
`

const previewDescriptionStyle = css`
  font-weight: 500;
  font-size: 22px;
  color: rgba(0, 0, 0, .55);
`

const container = css`
  padding-top: 25px;
`

const fixedPreview = css`
  position: fixed;
  font-weight: 700;
  margin-left: -140px;
  color: blue;
  border: none;
  outline: none;
  font-family: ${fontFamily};
  font-weight: 400;
  background-color: transparent;
  cursor: pointer;
`

const coverImage = css`
  margin-top: 20px;
`

const postPreview = css`
  background-color: white;
  padding: 10px 0px 50px;
`

const textareaContainer = css`
  display: flex;
  flex-direction: column;
`

const baseButton = css`
  margin-top: 20px;
  margin-left: 10px;
  padding: 2px 14px;
  border: none;
  border-right: 1px solid black;
`

const preview = css`
  ${baseButton};
`

const imageButton = css`
  ${baseButton};
`

const publish = css`
  ${baseButton};
`

const blogPost = css`
`

const buttonContainer = css`
  display: flex;
`

const NewPostWithContext = props => (
  <ContextProviderComponent>
    <BlogContext.Consumer>
      {
        context => <NewPost {...props} context={context} />
      }
    </BlogContext.Consumer>
  </ContextProviderComponent>
)

export default NewPostWithContext