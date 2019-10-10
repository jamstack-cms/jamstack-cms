import React from 'react'
import { css } from '@emotion/core'
import Loader from './loadingIndicator'
import { BlogContext } from '../context/mainContext'

function Button(props) {
  const { context: { theme }, isLoading = false, onClick, title, customCss = [], customLoadingCss = [] } = props
  return (
    <div css={[buttonContainer]}>
      { isLoading && <Loader customLoadingCss={[...customLoadingCss]} />}
      <button css={[buttonStyle(theme), ...customCss]} onClick={onClick}>
        {title}
      </button>
    </div>
  )
}

export default function ButtonWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <Button {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const buttonContainer = css`
  display: flex;
`

function buttonStyle ({ primaryFontColor, fontFamily }) {
  return css`
    background-color: transparent;
    font-family: ${fontFamily};
    color: ${primaryFontColor};
    font-size: 16px;
    border: none;
    outline: none;
    padding: 4px 15px;
    margin: 0;
    cursor: pointer;
    border-radius: 3px;
    opacity: 1;
    &:hover {
      opacity: .8;
    }
  `
}