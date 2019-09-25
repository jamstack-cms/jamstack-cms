import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'
import Loader from './loadingIndicator'

export default function Button(props) {
  const { isLoading = false, onClick, title, customCss = [], customLoadingCss = [] } = props
  return (
    <div css={buttonContainer}>
      { isLoading && <Loader customLoadingCss={[...customLoadingCss]} />}
      <button css={[buttonStyle, ...customCss]} onClick={onClick}>
        {title}
      </button>
    </div>
  )
}

const buttonContainer = css`
  display: flex;
`

const buttonStyle = css`
  font-family: ${fontFamily};
  font-size: 14px;
  border: none;
  outline: none;
  padding: 4px 15px;
  margin: 0;
  cursor: pointer;
  border-radius: 3px;
  opacity: .7;
  &:hover {
    opacity: 1;
  }
`