import React from 'react'
import HeroPage from './pageTemplates/heroPage'
import { API, graphqlOperation } from 'aws-amplify'
import { getPage } from '../graphql/queries'

class EditPage extends React.Component {
  state = {
    page: {},
    isLoading: true
  }
  async componentDidMount() {
    const { id } = this.props
    try {
      const pageData = await API.graphql(graphqlOperation(getPage, { id }))
      console.log('pageData: ', pageData)
      const page = pageData.data.getPage
      this.setState({
        page, isLoading: false
      })
    } catch (err) { console.log({ err })}
  }
  render() {
    return (
      <div />
    )
  }
}

export default EditPage