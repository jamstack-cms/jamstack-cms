import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'

export default function FileInput(props) {
  const { onChange, customCss = [], placeholder, labelStyle = [] } = props
  return (
    <>
      <input
        type='file'
        placeholder={placeholder}
        css={[buttonStyle, ...customCss]}
        onChange={onChange}
        name="file"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
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
