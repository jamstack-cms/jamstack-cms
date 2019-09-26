import React from "react"
import { Hub, Auth } from 'aws-amplify'

const BlogContext = React.createContext()

class ContextProviderComponent extends React.Component {
  state = {
    isAdmin: false,
    updateIsAdmin: this.updateIsAdmin,
    window: {}
  }

  componentDidMount() {
    Hub.listen('auth', hubData => {
      const { payload: { event, data } } = hubData;
      if (event === 'signIn') {
        const { signInUserSession: { idToken: { payload } } } = data
        if (payload['cognito:groups'].includes('Admin')) {
          this.updateIsAdmin(true)
        }
      }
    })
    Auth.currentAuthenticatedUser()
      .then(user => {
        const { payload } = user.signInUserSession.idToken
        const groups = payload['cognito:groups']
        if (groups.includes("Admin")) {
          this.updateIsAdmin(true)
        }
      })
      .catch(err => console.log(err));
      window.addEventListener("resize", this.onResize);
      this.onResize()
  }

  onResize = () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const window = {width, height}
    this.setState({ window })
 }

  updateIsAdmin = (isAdmin) => {
    this.setState({ isAdmin })
  }

  render() {
    return (
      <BlogContext.Provider value={{
        ...this.state,
        updateIsAdmin: this.updateIsAdmin
      }}>
        {this.props.children}
      </BlogContext.Provider>
    )
  }
}

export {
  BlogContext,
  ContextProviderComponent
}