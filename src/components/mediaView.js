import React from 'react'
import { Storage } from 'aws-amplify'
import { css } from '@emotion/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import getKeyWithPath from '../utils/getKeyWithPath'
import getKeyWithFullPath from '../utils/getKeyWithFullPath'
import FileInput from '../components/input'
import saveFile from '../utils/saveFile'
import { copyToClipboard, getTrimmedKey } from '../utils/helpers'
import { toast } from 'react-toastify'
import { BlogContext } from '../context/mainContext'

class MediaView extends React.Component {
  state = {
    image: {},
    listType: 'grid',
    dataType: 'all'
  }
  updateDataType = event => {
    this.setState({ dataType: event.target.value })
  }
  deleteImage = async image => {
    this.props.removeImage(image)
    const keyWithPath = getKeyWithPath(image)
    try {
      await Storage.remove(keyWithPath)
      console.log('image deleted')
      toast("Successfully deleted image.")
    } catch (err) {
      console.log('error deleting image: ', err)
    }
  }
  updateListType = listType => this.setState({ listType })
  uploadImage = async (event) => {
    const { target: { files } } = event
    const fileForUpload = files[0]
    this.setState({
      isUploadingImage: true,
      image: URL.createObjectURL(event.target.files[0]),
      file: fileForUpload
    }, async () => {
      const { url } = await saveFile(fileForUpload)
      const keyWithPath = getKeyWithPath(url)
      const uploadedImage = await Storage.get(keyWithPath)
      const images = [uploadedImage, ...this.props.images]
      this.props.addImageToState(images)
      this.setState({ isUploadingImage: false })
      toast("Successfully uploaded new image.")
    })
  }
  
  render() {
    const { listType, dataType, isUploadingImage } = this.state
    const { context: { theme, theme: { baseFontWeight, primaryFontColor, highlight } }} = this.props
    const isList = listType === 'list';
    let imageListType = css``
    if (isList) {
      imageListType = css`
        width: 680px;
      `
    }
    const chosenViewButton = (type) => css`
      color: ${type === listType ? primaryFontColor : highlight};
      font-weight: ${baseFontWeight};
    `
   
    let images = this.props.images
    if (dataType === 'in-use') {
      images = this.props.imagesInUse
    }
    if (dataType === 'not-in-use') {
      images = this.props.imagesNotInUse
    }
    return (
      <div>
        <div css={[viewTypeContainer]}>
          <div>
            <button
              css={[toggleViewButton(theme), chosenViewButton('list')]}
              onClick={() => this.updateListType('grid')}>Grid View</button>
          </div>
          <div>
            <button
              css={[toggleViewButton(theme), chosenViewButton('grid')]}
              onClick={() => this.updateListType('list')}>List View</button>
          </div>
          <FileInput
            isLoading={isUploadingImage}
            placeholder="Upload"
            customLoadingCss={[loader]}
            labelStyle={[toggleViewButton(theme), uploadButton]}
            onChange={this.uploadImage}
          />
          <select css={[selectMenu(theme)]} value={dataType} onChange={this.updateDataType}>
            <option value="all">All Images</option>
            <option value="in-use">Images in use</option>
            <option value="not-in-use">Images not in use</option>
          </select>
        </div>
        <div css={mediaContainer}>
          {
            images.map((image, index)=> {
              return (
                <div css={imageWrapper} key={index}>
                  <div css={[imageContainerStyle, imageListType]}>
                    <img alt='media-item' css={[imageStyle(theme)]} src={image}  />
                    <div
                    onClick={() => copyToClipboard(getKeyWithFullPath(image))}
                    css={[imageOverlay]}>
                      <div css={[overlayLinkContainer]}>
                        <div css={overlayLinkItems(theme)}>
                          <FontAwesomeIcon css={faIcon(theme)} icon={faLink} />
                          <p css={[overlayLink(theme)]}>{getTrimmedKey(getKeyWithFullPath(image), 15)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => this.deleteImage(image)} css={deleteButtonContainer}>
                    <p css={deleteButton(theme)}>Delete Image</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default function MediaViewWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <MediaView {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const loader = css`
  margin-right: 5px;
`

const deleteButton = ({ fontFamily }) => css`
  font-family: ${fontFamily};
  font-size: 14px;
`

const deleteButtonContainer = css`
  cursor: pointer;
  opacity: .5;
  &:hover {
    opacity: 1
  }
`

const selectMenu = ({ fontColor }) => css`
  margin-left: 15px;
  outline: none;
  color: ${fontColor};
`

const uploadButton = css`
  margin: 0;
  opacity: 1;
  font-size: 16px;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
`

const imageWrapper = css`
  margin: 5px 10px;
`

const faIcon = ({ primaryFontColor}) => css`
  font-size: 12px;
  margin-top: 7px;
  color: ${primaryFontColor};
  margin-right: 8px;
`

const viewTypeContainer = css`
  display: flex;
  margin-top: 10px;
  padding-top: 15px;
`

const toggleViewButton = ({ fontFamily }) => css`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 15px;
  outline: none;
  font-family: ${fontFamily};
`

const imageContainerStyle = css`
  width: 300px;
  cursor: pointer;
  position: relative;
`

const imageOverlay = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgba(209, 209, 209, .25);
    opacity: 1;
  },
`

const overlayLinkContainer = css`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const overlayLinkItems = ({ backgroundColor }) => css`
  margin-top: -4px;
  background-color: ${backgroundColor};
  display: flex;
  padding: 2px 20px;
  border-radius: 3px;
`

const overlayLink = ({ fontFamily, primaryFontColor }) => css`
  color: ${primaryFontColor};
  margin: 0;
  font-family: ${fontFamily};
`

const imageStyle = ({ highlight }) => css`
  border-bottom: 8px solid ${highlight};
  margin: 0;
  margin-bottom: -5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 30px 60px -10px, rgba(0, 0, 0, 0.22) 0px 18px 36px -18px;
`

const mediaContainer = css`
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
`