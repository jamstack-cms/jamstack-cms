import React from 'react'
import marked from 'marked';
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { css } from "@emotion/core"
import { updatePost } from '../graphql/mutations'
import { getPost } from '../graphql/queries'
import Button from '../components/button'
import format from 'date-fns/format'
import { BlogContext } from '../components/context'
import FileInput from './input'
import uuid from 'uuid/v4'
import config from '../aws-exports'
import SimpleMDE from "react-simplemde-editor";
import { highlight, fontFamily } from '../theme'
import getSignedURLs from '../utils/getSignedURLs'
import getKeyWithPath from '../utils/getKeyWithPath'
import PostPreviewComponent from './postPreviewComponent'

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
    createdAt: ''
  }
}

class PostRoute extends React.Component {
  state = {
    file: {},
    hasChanged: true,
    isLoading: true,
    isEditing: false,
    post: initialPostState
  }
  static contextType = BlogContext
  async componentDidMount() {
    const { id } = this.props
    let wildcard = this.props["*"]
    
    if (wildcard === 'edit') this.setState({ isEditing: true })
    try {
      const postData = await API.graphql(graphqlOperation(getPost, { id }))
      const { getPost: post } = postData.data
      console.log('post.content: ', post.content)
  
      const updatedContent = await getSignedURLs(post.content)
      post['content'] = updatedContent
      
      this.setState({ post, isLoading: false })
    } catch (err) { console.log({ err })}
  }
  getMarkdownText(markdown) {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
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
  uploadImage = (event) => {
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
  editPost = async() => {
    const { post: { content } } = this.state
    const updatedContent = await getSignedURLs(content)
    this.setState({
      isEditing: !this.state.isEditing, content: updatedContent
    })
  }
  viewPost = async () => {
    this.setState({
      isEditing: false
    })
  }
  cancelEdit = () => {
    this.setState({ isEditing: false, hasChanged: false })
  }
  updatePost = async () => {
    const input = {...this.state.post}
    if (this.state.file && this.state.file.name) {
      const fileForUpload = await this.uploadFile()
      input['cover_image'] = fileForUpload
    }

    await API.graphql(graphqlOperation(updatePost, {input}))
    this.setState({ hasChanged: false })
    this.viewPost()
  }
  uploadFile = () => {
    return new Promise(async(resolve) => {
      const { file } = this.state
      const { name: fileName, type: mimeType } = file

      const extension = file.name.split(".")[1]
      const key = `images/${uuid()}${fileName}.${extension}`      
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      try {
        await Storage.put(key, file, {
          contentType: mimeType
        })
        resolve(url) 
      } catch (err) {
        console.log('error: ', err)
      }
    })
  }
  render() {
    const { window } = this.context
    const { isEditing, isLoading, hasChanged } = this.state
    const { title, content, createdAt, cover_image  } = this.state.post
    const dynamicTextArea = css`
      min-height: ${window.height-340}px;
      margin-top: 30px;
    `
    const dynamicPreviewButton = css`
      color: ${highlight};
    `
    console.log('cover_image: ', cover_image)
    console.log('state: ', this.state)
  
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
              {
                cover_image && <img css={coverImage} src={cover_image} />
              }
              <input
                value={this.state.post.title}
                css={[titleStyle]}
                onChange={e => this.setPost('title', e.target.value)}
              />
              <input
                value={this.state.post.description}
                css={[descriptionStyle]}
                onChange={e => this.setPost('description', e.target.value)}
              />
              <SimpleMDE
                value={this.state.post.content}
                onChange={value => this.setPost('content', value)}
                css={[dynamicTextArea]}
              />
              <div css={buttonContainer}>
                <Button
                  onClick={() => this.editPost()}
                  title="Preview"
                  customCss={preview}
                />
                <Button
                  onClick={() => this.updatePost()}
                  title="Save"
                  customCss={save}
                />
                {
                  cover_image && (
                    <FileInput
                      placeholder="Update Cover Image"
                      customCss={[coverImageButton]}
                      onChange={this.uploadImage}
                    />
                  )
                }
                {
                  !cover_image && (
                    <FileInput
                      placeholder="Add Cover Image"
                      customCss={[coverImageButton]}
                      onChange={this.uploadImage}
                    />
                  )
                }
              </div>              
            </>
          ) : (
            <>
              <PostPreviewComponent
                cover_image={cover_image}
                title={title}
                createdAt={createdAt}
                content={content}
              />
              <Button
                title='Edit'
                onClick={this.editPost}
                customCss={buttonStyle}
              />
              {
                hasChanged && (
                  <>
                    <Button
                      title='Save'
                      onClick={this.updatePost}
                      customCss={[buttonStyle, save]}
                    />
                    <Button
                      title='Cancel'
                      onClick={this.cancelEdit}
                      customCss={[buttonStyle, cancel]}
                    />
                  </>
                )
              }
            </>
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

const fixedButton = css`
  font-family: ${fontFamily} !important;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: 400;
`

const dateStyle = css`
  font-size: 14px !important;
  color: rgba(0, 0, 0, .5);
  font-family: ${fontFamily} !important;
`

const fixedPreview = css`
  position: fixed;
  margin-top: 35vh;
  font-weight: 700;
  margin-left: -140px;
  display: flex;
  flex-direction: column;
`

const coverImage = css`
  margin: 0px;
`

const buttonContainer = css`
  display: flex;
`

const baseButton = css`
  width: 220px;
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

const cancel = css`
  ${baseButton};
  background-color: red;
`

const coverImageButton = css`
  ${baseButton};
  background-color: white;
  color: black;
  border: 1px solid #ededed;
`

const buttonStyle = css`
  margin-bottom: 10px;
  padding-left: 50px;
  padding-right: 50px;
`

const container = css`
  padding: 20px 0px;
`

const titleStyle = css`
  font-size: 30px;
  border: none;
  outline: none;
  width: 100%;
  padding: 0px 14px;
  border-bottom: 2px solid rgba(0, 0, 0, .15);
  background-color: transparent;
`

const descriptionStyle = css`
  font-size: 20px;
  border: none;
  outline: none;
  margin-top: 20px;
  width: 100%;
  padding: 0px 14px;
  border-bottom: 2px solid rgba(0, 0, 0, .15);
  background-color: transparent;
`

export default PostRoute