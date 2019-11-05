import React from "react"
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify'
import { graphql } from "gatsby"
import { css } from "@emotion/core"
import styledAuthenticator from '../components/styledAuthenticator'
import TitleComponent from '../components/titleComponent'
import Layout from '../layouts/mainLayout'
import Button from '../components/button'
import InputButton from '../components/input'
import { BlogContext } from '../context/mainContext'
import { createUser, updateUser } from '../graphql/mutations'
import { getUser } from '../graphql/queries'

class Profile extends React.Component {
  state = {
    username: null,
    email: null,
    sub: null,
    imageFile: {}
  }
  async componentDidMount() {
    try {
      const userInfo = await Auth.currentAuthenticatedUser()
      const { payload, payload: { sub } } = userInfo.signInUserSession.idToken
      this.setState({
        email: payload.email,
        username: userInfo.username,
        sub
      })
      let graphqlData = { id: sub }
      const user = await API.graphql(graphqlOperation(getUser, graphqlData))
      if (!user.data.getUser) {
        graphqlData = {
          ...graphqlData, username: userInfo.username
        }
        await API.graphql(graphqlOperation(createUser, { input: graphqlData }))
        console.log('user created!')
      } else {
        const { avatarUrl } = user.data.getUser
        if (avatarUrl) {
          const signedImage = await Storage.get(avatarUrl)
          const { setAvatar } = this.props.context
          setAvatar(signedImage)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  onChange = e => {
    const imageFile = e.target.files[0];
    this.setState({ imageFile }, () => {
      this.setAvatar()
    })
  }
  signOut = () => {
    this.props.context.updateIsAdmin(false)
    Auth.signOut()
      .catch(err => console.log({ err }))
  }
  setAvatar = async () => {
    const { imageFile, sub } = this.state
    const { setAvatar } = this.props.context
    const key = `images/avatars/${sub}.jpg`
    try {
      await Storage.put(key, imageFile)
      const signedImage = await Storage.get(key)
      setAvatar(signedImage)
      const updatedUserInfo = { id: sub, avatarUrl: key }
      await API.graphql(graphqlOperation(updateUser, { input: updatedUserInfo }))
      console.log('updated user info...')
    } catch (err) {
      console.log('error setting avatar... :', err)
    }
  }
  render() {
    const { email, username } = this.state
    const { avatarUrl, theme } = this.props.context

    return (
      <Layout>
        <div>
          <TitleComponent title="Profile" />
          <div css={container}>
            <div css={userInfo}>
              {
                avatarUrl && (
                  <img
                    src={avatarUrl}
                    css={avatarStyle(theme)}
                    alt="Profile avatar"
                  />
                )
              }
              <div css={profileInfoContainer}>
                <p css={profileInfo}>Username: {username}</p>
                <p css={profileInfo}>Email: {email}</p>
              </div>
            </div>
            <div css={buttonContainer}>
              <Button
                onClick={this.signOut}
                title="Sign Out"
                customCss={[leftButton]}
              />
              <InputButton
                onChange={this.onChange}
                placeholder={avatarUrl ? "Update Avatar" : "Set Avatar"}
              />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const leftButton = css`
  padding-left: 0px;
`

const profileInfoContainer = css`
  margin-top: 35px;
`

const userInfo = css`
  display: flex;
`

const avatarStyle = ({ highlight }) => css`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-top: 20px;
  margin-right: 30px;
  margin-bottom: 0px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 30px 60px -10px, rgba(0, 0, 0, 0.28) 0px 18px 36px -18px;
`

const container = css`
  margin-top: 25px;
`

const buttonContainer = css`
  display: flex;
  margin-top: 20px;
`

const profileInfo = css`
  margin: 0px 0px 5px;
`

function ProfileWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <Profile {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const ProfileWithAuth = styledAuthenticator(ProfileWithContext)

export default ProfileWithAuth

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
