import React from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { css, keyframes } from '@emotion/core'

export default function LoadingIndicator({
  customLoadingCss = [], customSpinnerStyle = []
}) {
  return (
    <div css={[...customLoadingCss]}>
      <FontAwesomeIcon
        icon={faSpinner}
        css={[spinnerStyle, ...customSpinnerStyle]}
      />
    </div>
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

const spinnerStyle = css`
  animation: ${rotate} 1.5s linear infinite;
`