import React from 'react'
import { css } from '@emotion/core'

export default function Button(props) {
  const { onClick, title, customCss } = props
  return (
    <button css={[buttonStyle, customCss]} onClick={onClick}>
      {title}
    </button>
  )
}

const buttonStyle = css`
  border: none;
  outline: none;
  background-color: black;
  color: white;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 3px;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
`