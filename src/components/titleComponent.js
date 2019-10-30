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
  font-family: ${fontFamily};
  font-size: 34px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 40px;
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