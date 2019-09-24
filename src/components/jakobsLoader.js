import React from 'react'

import { css, keyframes } from '@emotion/core'
import { highlight } from '../theme'

/* Thanks to Jakob from CodePen for the awesome animation! */
/* Check him out at https://codepen.io/JacobDvlpr */

export default function JakobsLoader() {
  const loading = css`{
    border: 4px solid ${highlight};
  }`
  const centered = css`
  `
  return (
    <div>
        <div className="box" css={centered}>
        <div className="loading" css={[loading]}></div>
        <div className="loading" css={[loading]}></div>
        <div className="loading" css={[loading]}></div>
        </div>
    </div>
  )
}
