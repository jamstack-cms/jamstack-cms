import React from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { css, keyframes } from '@emotion/core'
import { BlogContext } from '../context/mainContext'

function LoadingIndicator({
  customLoadingCss = [], customSpinnerStyle = [], context: { theme }
}) {
  return (
    <div css={[...customLoadingCss]}>
      <FontAwesomeIcon
        icon={faSpinner}
        css={[spinnerStyle(theme), ...customSpinnerStyle]}
      />
    </div>
  ) 
}

export default function LoadingIndicatorWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <LoadingIndicator {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg)
  }
`

const spinnerStyle = ({ primaryFontColor }) => css`
  color: ${primaryFontColor};
  animation: ${rotate} 1.5s linear infinite;
`