import React from "react"
import { Auth } from 'aws-amplify'
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import styledAuthenticator from '../components/styledAuthenticator'
import { ContextProviderComponent, BlogContext } from '../components/context'

class Admin extends React.Component {
  state = {
    username: null,
    email: null
  }
  static contextType = BlogContext;
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const { payload } = user.signInUserSession.idToken
        this.setState({
          email: payload.email,
          username: user.username
        })
      })
      .catch(err => console.log(err));
  }
  signOut = () => {
    this.context.updateIsAdmin(false)
    Auth.signOut()
      .catch(err => console.log({ err }))
  }
  render() {
    const { data } = this.props
    const { email, username } = this.state
    const { isAdmin } = this.context
    console.log('context:', this.context)
    return (
      <ContextProviderComponent>
        <div>
          <h1>Profile</h1>
          <h4>Username: {username}</h4>
          <p>Email: {email}</p>
          <div>
            <button
              onClick={this.signOut}
              css={button}>Sign Out</button>
          </div>
        </div>
      </ContextProviderComponent>
    )
  }
}

const button = css`
  width: 200px;
  height: 40px;
  background-color: black;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
`

export default styledAuthenticator(Admin)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
