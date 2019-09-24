import React from 'react'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'

function TitleComponent({ title, customStyles }) {
  return (
    <div>
      <h1 css={[titleStyle, customStyles]}>{title}</h1>
    </div>
  )
}

const titleStyle = css`
  font-family: ${fontFamily}, sans-serif;
  font-size: 32px;
  font-weight: 200;
  margin-bottom: 10px;
`

export default TitleComponent