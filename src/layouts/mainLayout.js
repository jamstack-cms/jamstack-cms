import React from "react"
import { css } from "@emotion/core"
import { BlogContext } from '../context/mainContext'

function MainLayout(props) {
  const { children, noPadding, customCss = [] } = props
  let basePadding = css`
    padding-top: 35px;
    padding-bottom: 25px;
  `
  if (noPadding) {
    basePadding = css`
      padding: 0;
    `
  }
  return (
    <div>
      <main css={[mainContent, basePadding, ...customCss]}>{children}</main> 
    </div>
  )
}

function MainLayoutWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <MainLayout {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export default MainLayoutWithContext

const mainContent = css`
  margin: auto;
  width: 944px;
  @media (max-width: 1000px) {
    width: 100%;
  }
`