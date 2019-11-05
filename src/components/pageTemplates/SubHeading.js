import React, { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function SubHeading({ content, updateContent, index, deleteComponent, context: { theme }}) {
  const [editable, updateIsEditable] = useState(true)
  const [html, updateHtml] = useState(content ? content : 'This is a subheader.')
  const h3ref = useRef(null)

  useEffect(() => {
    updateAndSave(false)
    // eslint-disable-next-line
  }, [])

  function updateAndSave() {
    updateIsEditable(!editable)
    let newHtml = h3ref.current.innerHTML
    newHtml = newHtml.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
    updateHtml(newHtml)
    const content = `<h3>${newHtml}</h3>`
    updateContent(content)
  }

  return (
    <div css={headerTemplateStyle}>
      <h3
        contentEditable={editable}
        suppressContentEditableWarning
        css={[headingStyle(theme), editable ? editingStyle() : null]}
        ref={h3ref}
        dangerouslySetInnerHTML={{__html: html }}
      />
      <EditOptions
        editable={editable}
        updateIsEditable={updateAndSave}
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
  font-weight: 600;
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default SubHeadingWithContext