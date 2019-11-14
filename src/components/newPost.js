import React from 'react'
import { css } from "@emotion/core"
import marked from 'marked';
import Button from './button'
import FileInput from './input'
import FormComponent from './formComponent'
import { BlogContext } from '../context/mainContext'
import { createPost } from '../graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import format from 'date-fns/format'
import { getTrimmedKey, copyToClipboard } from '../utils/helpers'
import { toast } from 'react-toastify'
import ImageLinkOverlay from './imageLinkOverlay'
import saveFile from '../utils/saveFile'
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
  publish = async (isPublished) => {
    const { file, post, post: { title, content, description } } = this.state
    if (!title || !content) return
    const user = await Auth.currentAuthenticatedUser()
    const { payload: { sub } } = user.signInUserSession.idToken
    post['postAuthorId'] = sub
    post['contentType'] = 'Post'
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
      this.props.toggleViewState('listPosts')
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
    const { window, theme } = this.props.context
    const primaryFontStyle = css`
      color: ${theme.primaryFontColor};
    `
    const secondaryFontStyle = css`
      color: ${theme.secondaryFontColor};
    `
    const highlightFontStyle = css`
      color: ${theme.highlight};
    `
    return (
      <div css={container}>
        <div css={[fixedPreview]}>
          <Button
            onClick={this.toggleEditView}
            title={isEditing ? "Preview" : "Edit"}
            customCss={[fixedButton(theme)]}
            customLoadingCss={[loadingStyle]}
          />
          <Button
            onClick={() => this.publish(true)}
            title="Publish"
            customCss={[fixedButton(theme)]}
            customLoadingCss={[loadingStyle]}
            isLoading={isPublishing}
          />
          <Button
            onClick={() => this.publish(false)}
            title="Save"
            customCss={[fixedButton(theme)]}
            customLoadingCss={[loadingStyle]}
            isLoading={isSaving}
          />
          {
            isEditing && (
              <>
                <FileInput
                  placeholder={`${cover_image ? "Update Cover Image" : "Add Cover Image" }`}
                  labelStyle={[fixedButton(theme)]}
                  onChange={this.setCoverImage}
                />
                <FileInput
                  placeholder="Upload Image"
                  labelStyle={[fixedButton(theme)]}
                  onChange={this.uploadImage}
                  isLoading={isUploadingImage}
                  customLoadingCss={[loadingStyle]}
                />
              </>
            )
          }
        </div>
        
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
            </div>
          ) : (
            <div>
              {
                cover_image && <img object-fit="contain" alt="cover" css={coverImage} src={cover_image} />
              }
              <div css={postPreview} className="blog-post">
                <h1 css={[previewTitleStyle, primaryFontStyle]}>{this.state.post.title}</h1>
                <p css={[previewDescriptionStyle, secondaryFontStyle]}>{this.state.post.description}</p>
                <p css={[dateStyle(theme), highlightFontStyle]}>{format(new Date(), 'MMMM dd yyyy')}</p>
                <section
                  css={[blogPost, primaryFontStyle]}
                  dangerouslySetInnerHTML={this.getMarkdownText(this.state.post.content)}
                />
              </div>
            </div>
          )
        }
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
  margin-top: 12px;
  margin-right: -4px;
`

const dateStyle = ({ fontFamily }) => css`
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
  width: 150px;
  margin-top: 0vh;
  margin-left: -150px;
  display: flex;
  flex-direction: column;
`

const coverImage = css`
  margin-top: 20px;
`

const postPreview = css`
  padding: 10px 0px 50px;
`

const textareaContainer = css`
  display: flex;
  flex-direction: column;
`

const baseButton = css`
  margin-top: 12px;
  line-height: 20px;
`

const fixedButton = ({ fontFamily }) => css`
  ${baseButton};
  font-family: ${fontFamily} !important;
  border: none;
  background-color: transparent;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
`

const blogPost = css`
`

export default function NewPostWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <NewPost {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}
