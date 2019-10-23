import React, { useState } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function Header({ deleteComponent, index, context: { theme }}) {
  const [editable, updateIsEditable] = useState(false)
  console.log('editable: ', editable)
  return (
    <div css={headerTemplateStyle(editable)}>
      <h1
        contentEditable={editable}
        suppressContentEditableWarning
        css={[headingStyle(theme), editable ? editingStyle() : null]}
      >Hello from Header</h1>
      <EditOptions
        editable={editable}
        updateIsEditable={() => updateIsEditable(!editable)}
        theme={theme}
        deleteComponent={() => deleteComponent(index)}
      />
    </div>
  )
}

const HeaderWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <Header {...props} context={context} />
    }
  </BlogContext.Consumer>
)

const headerTemplateStyle = (iseditable) => css`
  position: relative;
  cursor: ${iseditable ? 'default' : 'pointer'};
`

const headingStyle = ({ fontFamily }) => css`
  font-family: ${fontFamily}, serif;
  margin: 25px auto 18px;
  font-size: 36px;
  line-height: 42px;
  outline: none;
  border: none;
  padding: 5px 10px;
  font-family: ${fontFamily};
  border: 1px solid transparent;
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default HeaderWithContext