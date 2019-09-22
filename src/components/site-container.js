import React from 'react'
import { css } from '@emotion/core'

export default function SiteContainer(props) {
  return (
    <div css={container}>
      {props.children}
    </div>
  )
}

const container = css``
