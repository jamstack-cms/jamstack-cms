import React from 'react'
import { css } from '@emotion/core'
import uuid from 'uuid/v4'
import Loader from './loadingIndicator'
import { BlogContext } from '../context/mainContext'

function FileInput(props) {
  const { onChange, placeholder, labelStyle = [],
    isLoading, customLoadingCss = [], context } = props
  const { theme } = context
  const id = `file-upload-${uuid()}`
  
  return (
    <div css={container}>
      <input
        type='file'
        placeholder={placeholder}
        css={[buttonStyle]}
        onChange={onChange}
        name="file"
        id={id}
      />
      { isLoading && <Loader customLoadingCss={[...customLoadingCss]} />}
      <label
        htmlFor={id}
        css={[label(theme), ...labelStyle]}
      >{placeholder}</label>
    </div>
  )
}

export default function FileInputWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <FileInput {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const container = css`
  display: flex;
`

const buttonStyle = css`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`

const label = ({ fontFamily, primaryFontColor }) => css`
  font-family: ${fontFamily};
  color: ${primaryFontColor};
  font-size: 16px;
  display: inline-block;
  padding: 4px 15px;
  cursor: pointer;
  border-radius: 3px;
  opacity: 1;
  &:hover {
    opacity: .8;
  }
`
