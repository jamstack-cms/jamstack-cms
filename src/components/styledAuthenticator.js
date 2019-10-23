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
  theme,
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  }
})

export default styledAuthenticator