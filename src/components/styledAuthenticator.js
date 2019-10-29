import { withAuthenticator } from 'aws-amplify-react'
import primaryTheme from '../themes/lightTheme'

const theme = {
  button: {
    backgroundColor: primaryTheme.highlight
  },
  a: {
    color: 'black'
  }
}

const styledAuthenticator = Component => {
  return withAuthenticator(Component, {
    theme,
    signUpConfig: {
      hiddenDefaults: ['phone_number']
    }
  })
}

export default styledAuthenticator