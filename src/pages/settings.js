import React from "react"
import { graphql } from "gatsby"
import TitleComponent from '../components/titleComponent'

class Settings extends React.Component {
  render() {
    return (
        <TitleComponent title="Settings" />
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
