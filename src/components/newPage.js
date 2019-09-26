import React from 'react'
import { BlogContext } from '../context/mainContext'

import HeroTemplate from './pageTemplates/heroTemplate'
import SidebarTemplate from './pageTemplates/sidebarTemplate'

class NewPage extends React.Component {
  render() {
    const { template, ...rest } = this.props
    if (template === 'hero') return <HeroTemplate {...rest} />
    if (template === 'sidebar') return <SidebarTemplate {...rest} />
  }
}

const NewPageWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <NewPage {...props} context={context} />
    }
  </BlogContext.Consumer>
)

export default NewPageWithContext