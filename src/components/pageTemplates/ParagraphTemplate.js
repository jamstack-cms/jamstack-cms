import React, { useState } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function Paragraph({ index, deleteComponent, context: { theme }}) {
  const [editable, updateIsEditable] = useState(false)
  console.log('editable: ', editable)
  return (
    <div css={paragraphTemplateStyle}>
      <p
        contentEditable={editable}
        suppressContentEditableWarning
        css={[paragraphStyle(theme), editable ? editingStyle() : null]}
      >Hello from paragraph component.</p>
      <EditOptions
        editable={editable}
        updateIsEditable={() => updateIsEditable(!editable)}
        theme={theme}
        deleteComponent={() => deleteComponent(index)}
      />
    </div>
  )
}

const ParagraphWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <Paragraph {...props} context={context} />
    }
  </BlogContext.Consumer>
)

const paragraphTemplateStyle = css`
  position: relative;
`

const paragraphStyle = ({ fontFamily, primaryFontColor }) => css`
  font-family: ${fontFamily}, serif;
  font-size: 18px;
  margin: 0px 0px 35px;
  line-height: 1.756;
  color: ${primaryFontColor};
  outline: none;
  border: none;
  padding: 5px 10px;
  border: 1px solid transparent;
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default ParagraphWithContext