import React from "react"
import { graphql } from "gatsby"
import TitleComponent from '../components/titleComponent'
import Layout from '../layouts/mainLayout'

class Settings extends React.Component {
  render() {
    return (
      <Layout>
        <TitleComponent title="Settings" />
      </Layout>
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
