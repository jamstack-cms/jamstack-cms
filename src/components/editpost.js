import React from 'react'
import marked from 'marked';
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { css } from "@emotion/core"
import { updatePost } from '../graphql/mutations'
import { getPost } from '../graphql/queries'
import Button from '../components/button'
import { BlogContext } from '../components/context'
import FileInput from './input'
import uuid from 'uuid/v4'
import config from '../aws-exports'
import { highlight, fontFamily } from '../theme'
import getSignedURLs from '../utils/getSignedURLs'
import getUnsignedUrls from '../utils/getUnsignedUrls'
import PostComponent from './postComponent'
import FormComponent from './formComponent'
import { toast } from 'react-toastify'
import { copyToClipboard, getTrimmedKey } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { generatePreviewLink as generateLink } from '../utils/helpers'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialPostState = {
  post: {
    id: '',
    title: '',
    content: '',
    description: '',
    createdAt: '',
    previewEnabled: false,
    uploadedImageUrl: '',
    trimmedKey: ''
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
  }
  static contextType = BlogContext
  async componentDidMount() {
    const { id } = this.props
    let wildcard = this.props["*"]
    
    if (wildcard === 'edit') this.setState({ isEditing: true })
    try {
      const postData = await API.graphql(graphqlOperation(getPost, { id }))
      const { getPost: post } = postData.data
  
      const updatedContent = await getSignedURLs(post.content)
      post['content'] = updatedContent
      
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
      post: {
        ...this.state.post,
        cover_image: URL.createObjectURL(event.target.files[0]),
      },
      file: fileForUpload
    })
  }
  uploadImage = async event => {
    const { target: { files } } = event
    const fileForUpload = files[0]
    this.setState({
      file: fileForUpload
    }, async () => {
      try {
        const { url } = await this.uploadFile()
        this.setState({
          uploadedImageUrl: url,
          showOverlay: true,
          trimmedKey: getTrimmedKey(url, 20)
        })
      } catch (err) {
        console.log('error: ', err)
      }
    }) 
  }
  editPost = async() => {
    const { isEditing, post: { content } } = this.state
    if (isEditing) {
      const updatedContent = await getSignedURLs(content)
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
  
  viewPost = async () => {
    this.setState({
      isEditing: false
    })
  }
  updatePost = async () => {
    const input = {...this.state.post}
    if (this.state.file && this.state.file.name) {
      const { url: fileForUpload } = await this.uploadFile()
      input['cover_image'] = fileForUpload
    }
    await API.graphql(graphqlOperation(updatePost, {input}))
    this.setState({ hasChanged: false })
    this.viewPost()
  }
  copyPreviewLink() {
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
        previewEnabled: true
      }
    })
    toast(`Success! Link copied to clipboard.`)
  }
  uploadFile = () => {
    return new Promise(async(resolve) => {
      const { file } = this.state
      const { name: fileName, type: mimeType } = file
      const key = `images/${uuid()}${fileName}`      
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      try {
        await Storage.put(key, file, {
          contentType: mimeType
        })
        resolve({ url, key }) 
      } catch (err) {
        console.log('error: ', err)
      }
    })
  }
  render() {
    const { window } = this.context
    const { isEditing, isLoading, hasChanged, showOverlay } = this.state
    const { title, content, createdAt, cover_image, previewEnabled, description  } = this.state.post
    const dynamicPreviewButton = css`
      color: ${highlight};
    `

    const dynamicPreviewLinkButton = css`
      background-color: ${highlight};
    `
  
    if (isLoading) return <p css={loading}>Loading...</p>
    return (
      <div>
        {
          isEditing ? (
            <div css={[fixedPreview]}>
              <button onClick={this.editPost} css={[fixedButton, dynamicPreviewButton]}>
                Preview
              </button>
              <button onClick={this.updatePost} css={[fixedButton, dynamicPreviewButton]}>
                Save
              </button>
              <FileInput
                placeholder="Upload Image"
                onChange={this.uploadImage}
                labelStyle={[fixedButton, dynamicPreviewButton]}
              />
            </div>
          ) : (
            <div css={[fixedPreview]}>
              <button onClick={this.editPost} css={[fixedButton, dynamicPreviewButton]}>
              Edit
              </button>
              <button onClick={this.updatePost} css={[fixedButton, dynamicPreviewButton]}>
                Save
              </button>
            </div>
          )
        }
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
              <div css={buttonContainer}>
                <Button
                  onClick={() => this.viewPost()}
                  title="Preview"
                  customCss={[preview]}
                />
                <Button
                  onClick={() => this.updatePost()}
                  title="Save"
                  customCss={[save]}
                />
                <FileInput
                  placeholder="Upload Image"
                  onChange={this.uploadImage}
                />
                {
                  cover_image && (
                    <FileInput
                      placeholder="Update Cover Image"
                      customCss={[coverImageButton]}
                      onChange={this.uploadCoverImage}
                    />
                  )
                }
                {
                  !cover_image && (
                    <FileInput
                      placeholder="Add Cover Image"
                      customCss={[coverImageButton]}
                      onChange={this.uploadCoverImage}
                    />
                  )
                }
                <>
                  {
                      previewEnabled && (
                        <Button
                          onClick={() => this.copyPreviewLink()}
                          title="Copy preview link"
                          customCss={[save, dynamicPreviewLinkButton]}
                        />
                      )
                    }
                    {
                      !previewEnabled && (
                        <Button
                          onClick={() => this.generatePreviewLink()}
                          title="Generate preview"
                          customCss={[save, dynamicPreviewLinkButton]}
                        />
                      )
                    }
                  </>
              </div>              
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
              <Button
                title='Edit'
                onClick={this.editPost}
                customCss={[buttonStyle]}
              />
              {
                hasChanged && (
                  <>
                    <Button
                      title='Save'
                      onClick={this.updatePost}
                      customCss={[buttonStyle, save]}
                    />
                  </>
                )
              }
              <>
              {
                  previewEnabled && (
                    <Button
                      onClick={() => this.copyPreviewLink()}
                      title="Copy preview link"
                      customCss={[save, dynamicPreviewLinkButton]}
                    />
                  )
                }
                {
                  !previewEnabled && (
                    <Button
                      onClick={() => this.generatePreviewLink()}
                      title="Generate preview"
                      customCss={[save, dynamicPreviewLinkButton]}
                    />
                  )
                }
              </>
            </>
          )
        }
        {
          showOverlay && (
            <div css={overlay}>
              <div css={imageUrlContainer} onClick={() => this.copyUploadedImageLink()}>
                <FontAwesomeIcon css={faIcon} icon={faLink} />
                <p>{this.state.trimmedKey}</p>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

const faIcon = css`
  font-size: 12px;
  margin-top: 7px;
  margin-right: 8px;
`

const imageUrlContainer = css`
  background-color: fafafa;
  padding: 9px 23px;
  display: flex;
  cursor: pointer;
  border-radius: 12px;
  &:hover {
    background-color: rgba(0, 0, 0, .075);
  }
`

const overlay = css`
  background-color: white;
  border: 6px solid ${highlight};
  width: 400px;
  z-index: 1000;
  height: 100px;
  position: fixed;
  left: 0px;
  top: 0px;
  margin-left: calc(50vw - 200px);
  margin-top: calc(50vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin: 0px;
  }
`

const loading = css`
  font-family: ${fontFamily} !important;
  font-weight: 400;
  font-size: 22px;
`

const fixedButton = css`
  font-family: ${fontFamily} !important;
  border: none;
  background-color: transparent;
  outline: none;
  font-size: 16px;
  margin-top: 0px;
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

const coverImage = css`
  margin: 0px;
`

const buttonContainer = css`
  display: flex;
  justify-content: flex-start;
`

const baseButton = css`
  margin-top: 20px;
  margin-left: 10px;
`

const preview = css`
  ${baseButton};
  color: black;
  background-color: #dedede;
`

const save = css`
  ${baseButton};
  background-color: #00a54a;
  color: white;
`

const coverImageButton = css`
  ${baseButton};
  background-color: white;
  color: black;
  border: 1px solid #ededed;
`

const buttonStyle = css`
  margin-bottom: 10px;
`

export default PostRoute