import React from "react"
import { graphql } from "gatsby"

class Settings extends React.Component {
  render() {
    return (
        <h1>Settings</h1>
    )
  }
}

export default Settings

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
