import React from "react"
import { Auth } from 'aws-amplify'
import { graphql } from "gatsby"
import { css } from "@emotion/core"
import styledAuthenticator from '../components/styledAuthenticator'
import { BlogContext } from '../context/mainContext'
import TitleComponent from '../components/titleComponent'
import Layout from '../layouts/mainLayout'

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
    const { email, username } = this.state
    return (
      <Layout>
        <div>
          <TitleComponent title="Profile" />
          <h4>Username: {username}</h4>
          <p>Email: {email}</p>
          <div>
            <button
              onClick={this.signOut}
              css={button}>Sign Out</button>
          </div>
        </div>
      </Layout>
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
