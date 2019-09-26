import React from "react"
import TitleComponent from '../components/titleComponent'
import Layout from '../layouts/mainLayout'

class About extends React.Component {
  render() {
    return (
      <Layout>
        <TitleComponent title='About Me' />
      </Layout>
    )
  }
}

export default About
