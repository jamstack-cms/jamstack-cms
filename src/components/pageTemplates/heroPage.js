import React from 'react'
import { css } from '@emotion/core'

export default function HeroPage({ html }) {
  return (
    <div css={container} className="hero-page-content">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
 )
}

const container = css`
  margin: 0px 10px;
`