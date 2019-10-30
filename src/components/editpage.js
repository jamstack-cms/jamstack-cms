import React from 'react'
import HeroTemplate from './pageTemplates/heroTemplate'
import { API, graphqlOperation } from 'aws-amplify'
import { getPage } from '../graphql/queries'

class EditPage extends React.Component {
  state = {
    page: {},
    isLoading: true,
    components: []
  }
  async componentDidMount() {
    const { id } = this.props
    try {
      const pageData = await API.graphql(graphqlOperation(getPage, { id }))
      const page = pageData.data.getPage
      page.components = JSON.parse(page.components)
      this.setState({ page })
    } catch (err) { console.log({ err })}
  }
  render() {
    return (
      <HeroTemplate
        pageData={this.state.page}
      />
    )
  }
}

export default EditPage
