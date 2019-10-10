import React from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../context/mainContext'

function TitleComponent({ title, customStyles, context }) {
  const { theme } = context
  return (
    <div>
      <h1 css={[titleStyle(theme), customStyles]}>{title}</h1>
    </div>
  )
}

const titleStyle = ({ fontFamily }) => css`
  font-family: ${fontFamily}, sans-serif;
  font-size: 32px;
  font-weight: 200;
  margin-top: 20px;
  margin-bottom: 10px;
`

export default function TitleComponentWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <TitleComponent {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}