import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'

export default function Button(props) {
  const { onClick, title, customCss = [] } = props
  return (
    <button css={[buttonStyle, ...customCss]} onClick={onClick}>
      {title}
    </button>
  )
}

const buttonStyle = css`
  font-family: ${fontFamily};
  font-size: 14px;
  border: none;
  outline: none;
  background-color: black;
  color: white;
  padding: 4px 15px;
  cursor: pointer;
  border-radius: 3px;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
`