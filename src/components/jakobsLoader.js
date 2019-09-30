import React from 'react'
import { BlogContext } from '../context/mainContext'
import { css } from '@emotion/core'

/* Thanks to Jakob from CodePen for the awesome animation! */
/* Check him out at https://codepen.io/JacobDvlpr */

function JakobsLoader({ context: { theme: { highlight }}}) {
  const loading = css`{
    border: 4px solid ${highlight};
  }`
  const centered = css`
  `
  return (
    <div>
        <div className="box" css={centered}>
        <div className="jakobs-loading" css={[loading]}></div>
        <div className="jakobs-loading" css={[loading]}></div>
        <div className="jakobs-loading" css={[loading]}></div>
        </div>
    </div>
  )
}

export default function JakobsLoaderWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <JakobsLoader {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}