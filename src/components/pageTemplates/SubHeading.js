import React, { useState } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function SubHeading({ index, deleteComponent, context: { theme }}) {
  const [editable, updateIsEditable] = useState(false)
  return (
    <div css={headerTemplateStyle}>
      <h3
        contentEditable={editable}
        suppressContentEditableWarning
        css={[headingStyle(theme), editable ? editingStyle() : null]}
      >Hello from SubHeader</h3>
      <EditOptions
        editable={editable}
        updateIsEditable={() => updateIsEditable(!editable)}
        theme={theme}
        deleteComponent={() => deleteComponent(index)}
      />
    </div>
  )
}

const SubHeadingWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <SubHeading {...props} context={context} />
    }
  </BlogContext.Consumer>
)

const headerTemplateStyle = css`
  position: relative;
`

const headingStyle = ({ fontFamily }) => css`
  margin: 20px auto 10px;
  outline: none;
  border: none;
  padding: 5px 10px;
  font-family: ${fontFamily};
  border: 1px solid transparent;
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default SubHeadingWithContext