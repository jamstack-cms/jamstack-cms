import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'
import uuid from 'uuid/v4'
import Loader from './loadingIndicator'
import { BlogContext } from '../context/mainContext'

function FileInput(props) {
  const { onChange, customCss = [], placeholder, labelStyle = [],
    isLoading, customLoadingCss = [], context } = props
  const { theme } = context
  const id = `file-upload-${uuid()}`
  const themedLabel = css`
    color: ${theme.primaryFontColor};
  `
  return (
    <div css={container}>
      <input
        type='file'
        placeholder={placeholder}
        css={[buttonStyle, ...customCss]}
        onChange={onChange}
        name="file"
        id={id}
      />
      { isLoading && <Loader customLoadingCss={[...customLoadingCss]} />}
      <label
        htmlFor={id}
        css={[label, themedLabel, ...labelStyle]}
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

const label = css`
  font-family: ${fontFamily};
  font-size: 14px;
  display: inline-block;
  padding: 4px 15px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 3px;
  opacity: .7;
  &:hover {
    opacity: 1;
  }
`
