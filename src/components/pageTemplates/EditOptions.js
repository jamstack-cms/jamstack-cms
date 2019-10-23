import React, { useState } from 'react'
import { css } from '@emotion/core'

function EditOptions({ updateIsEditable, editable, deleteComponent, theme }) {
  return (
    <div css={[editOptionsStyle(theme)]}>
      <p css={editButtonTextStyle(theme)} onClick={updateIsEditable}>
        {editable ? 'Save' : 'Edit'}
      </p>
      <p onClick={deleteComponent} css={editButtonTextStyle}>Delete</p>
    </div>
  )
}

const editOptionsStyle = () => css`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
`

const editButtonTextStyle = () => css`
  cursor: pointer;
  margin-right: 15px;
`

export default EditOptions