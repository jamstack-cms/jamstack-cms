import React, { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function Header({ content, updateContent, deleteComponent, index, context: { theme }}) {
  const [editable, updateIsEditable] = useState(true)
  const [html, updateHtml] = useState(content ? content : 'This is a header.')
  const h1ref = useRef(null)

  useEffect(() => {
    updateAndSave()
    // eslint-disable-next-line
  }, [])

  function updateAndSave() {
    updateIsEditable(!editable)
    let newHtml = h1ref.current.innerHTML
    newHtml = newHtml.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
    updateHtml(newHtml)
    const content = `<h1>${newHtml}</h1>`
    updateContent(content)
  }

  return (
    <div css={headerTemplateStyle(editable)}>
      <h1
        contentEditable={editable}
        suppressContentEditableWarning
        css={[headingStyle(theme), editable ? editingStyle() : null]}
        ref={h1ref}
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
  font-weight: 600;
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default HeaderWithContext