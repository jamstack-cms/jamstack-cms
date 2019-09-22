import { withAuthenticator } from 'aws-amplify-react'

const theme = {
  button: {
    backgroundColor: 'black'
  },
  a: {
    color: 'black'
  }
}

const styledAuthenticator = Component => withAuthenticator(Component, {
  theme
})

export default styledAuthenticator