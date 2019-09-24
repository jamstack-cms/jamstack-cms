import React from 'react'
import { css } from '@emotion/core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { highlight } from '../theme'

export default function ImageLinkOverlay({
  copyUploadedImageLink, imageKey
}) {
  return (
    <div css={overlay}>
      <div css={imageUrlContainer} onClick={copyUploadedImageLink}>
        <FontAwesomeIcon css={faIcon} icon={faLink} />
        <p>{imageKey}</p>
      </div>
    </div>
  )
}

const faIcon = css`
  font-size: 12px;
  margin-top: 7px;
  margin-right: 8px;
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