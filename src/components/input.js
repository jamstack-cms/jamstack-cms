import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'
import uuid from 'uuid/v4'

export default function FileInput(props) {
  const { onChange, customCss = [], placeholder, labelStyle = [] } = props
  const id = `file-upload-${uuid()}`
  return (
    <>
      <input
        type='file'
        placeholder={placeholder}
        css={[buttonStyle, ...customCss]}
        onChange={onChange}
        name="file"
        id={id}
      />
      <label
        htmlFor={id}
        css={[label, ...labelStyle]}
      >{placeholder}</label>
    </>
  )
}

const buttonStyle = css`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`

const label = css`
  font-family: ${fontFamily};
  font-size: 14px;
  color: white;
  background-color: black;
  display: inline-block;
  padding: 4px 20px;
  margin-left: 10px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 3px;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
`
