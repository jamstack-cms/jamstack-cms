import React, { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/core'
import { BlogContext } from '../../context/mainContext'

import EditOptions from './EditOptions'

function Code({ content, updateContent, deleteComponent, index, context: { theme }}) {
  const [editable, updateIsEditable] = useState(true)
  const [html, updateHtml] = useState(content ? content : 'Insert code here')
  const codeRef = useRef(null)

  useEffect(() => {
    updateAndSave()
    // eslint-disable-next-line
  }, [])

  function updateAndSave() {
    updateIsEditable(!editable)
    let newHtml = codeRef.current.innerHTML
    newHtml = newHtml.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
    updateHtml(newHtml)
    const content = `<pre><code>${newHtml}</code></pre>`
    updateContent(content)
  }

  return (
    <div css={codeTemplateStyle(editable)}>
      <pre css={[preStyle(theme), editable ? editingStyle() : null]}>
        <code
          contentEditable={editable}
          suppressContentEditableWarning
          ref={codeRef}
          css={codeStyle}
          dangerouslySetInnerHTML={{__html: html }}
        />
      </pre>
      <EditOptions
        editable={editable}
        updateIsEditable={updateAndSave}
        theme={theme}
        deleteComponent={() => deleteComponent(index)}
      />
    </div>
  )
}

const CodeWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <Code {...props} context={context} />
    }
  </BlogContext.Consumer>
)

const codeStyle = css`
  outline: none;
  border: none;
  font-size: 16px;
  line-height: 0px;
`

const preStyle = ({ codeBackgroundColor }) => css`
  background-color: ${codeBackgroundColor};
  padding: 20px;
  border: 1px solid transparent;
`

const codeTemplateStyle = (iseditable) => css`
  margin: 40px 10px 20px;
  position: relative;
  cursor: ${iseditable ? 'default' : 'pointer'};
`

const editingStyle = () => css`
  border: 1px solid #ddd;
`

export default CodeWithContext