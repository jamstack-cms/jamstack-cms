
import React from 'react'
import { css } from '@emotion/core'
import Loader from './loadingIndicator'
import { BlogContext } from '../context/mainContext'

function SolidButton({ onClick, context: { theme }, title, customCss = [], isLoading }) {
  return (
    <button onClick={onClick} css={[baseButton(theme), ...customCss]}>
      {
        isLoading && (
          <Loader
            customLoadingCss={[loadingIndicator]}
            customSpinnerStyle={[customSpinnerStyle(theme)]}
          />
        )
      }
      {title}
    </button>
  )
}

export default function SolidButtonWithContext(props) {
  return (
    <BlogContext.Consumer>
        {
          context => <SolidButton {...props} context={context} />
        }
    </BlogContext.Consumer>
  )
}

const loadingIndicator = css`
  margin-right: 7px;
`

const customSpinnerStyle = ({ inverseFontColor }) => css`
  color: ${inverseFontColor};
`

const baseButton = ({ highlight, inverseButtonFontColor }) => css`
  background-color: ${highlight};
  color: ${inverseButtonFontColor};
  padding: 6px 32px;
  border-radius: 4px;
  outline: none;
  border: none;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, .2);
  cursor: pointer;
  transition: all .3s;
  display: flex;
  &:hover {
    opacity: .8;
  }
`