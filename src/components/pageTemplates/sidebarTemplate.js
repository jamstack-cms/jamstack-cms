import React from 'react'
import { BlogContext } from '../../context/mainContext'

class SidebarTemplate extends React.Component {
  render() {
    return (
      <div>
        <p>Hello from Sidebar Template</p>
      </div>
    )
  }
}

const SidebarTemplateWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <SidebarTemplate {...props} context={context} />
    }
  </BlogContext.Consumer>
)

export default SidebarTemplateWithContext