import React from 'react'
import { css } from '@emotion/core'

function EditOptions({ updateIsEditable, editable, deleteComponent, theme, hideEdit, hideDelete }) {
  return (
    <div css={[editOptionsStyle(theme)]}>
      {!hideEdit && (
        <p css={editButtonTextStyle(theme)} onClick={updateIsEditable}>
          {editable ? 'Set' : 'Edit'}
        </p>
      )}
      {!hideDelete && (
        <p onClick={deleteComponent} css={editButtonTextStyle(theme)}>Delete</p>
      )}
    </div>
  )
}

const editOptionsStyle = () => css`
  position: absolute;
  left: -70px;
  top: 5px;
`

const editButtonTextStyle = ({ primaryFontColor, primaryLightFontColor }) => css`
  cursor: pointer;
  font-size: 14px;
  margin-right: 15px;
  margin-bottom: 0px;
  margin-top: 0px;
  line-height: 19px;
  color: ${primaryLightFontColor};
  transition: all .35s;
  &:hover {
    color: ${primaryFontColor};
  }
`

export default EditOptions