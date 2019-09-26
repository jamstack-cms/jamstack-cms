import React from "react"
import { css } from "@emotion/core"
import { BlogContext } from '../context/mainContext'

class MainLayout extends React.Component {
  render() {
    const { children, noPadding, customCss = [] } = this.props
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
      <div css={container}>
        <main css={[mainContent, basePadding, ...customCss]}>{children}</main> 
      </div>
    )
  }
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

const container = css` 
`

const mainContent = css`
  margin: auto;
  width: 680px;
`