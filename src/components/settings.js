import React from "react"
// import { graphql } from "gatsby"
import Layout from '../layouts/mainLayout'
import Button from '../components/button'
import { css } from '@emotion/core'
import { BlogContext } from '../context/mainContext'
import { API, graphqlOperation } from 'aws-amplify'
import { updateSettings, createSettings } from '../graphql/mutations'
import { toast } from 'react-toastify'
import Loader from '../components/loadingIndicator'
import amplifyDeploy from '../providers/webhookProviders/amplifyDeploy'

class Settings extends React.Component {
  state = {
    isDeploying: false
  }
  deploy = async () => {
    this.setState({
        isDeploying: true
      }, async () => {
      try {
        await amplifyDeploy()
        this.setState({ isDeploying: false})
      } catch (err) {
        console.log('Error triggering webook: ', err)
      }
    })
  }
  updateSettings = async theme => {
    const input = {
      id: 'jamstack-cms-theme-info',
      theme
    }
    try {
      await API.graphql(graphqlOperation(createSettings, { input }))
      console.log('theme successfully updated...')
    } catch (err) {
      if (err.errors[0].message.includes('The conditional request failed')) {
        console.log('theme already set.... Updating theme.')
        try {
          await API.graphql(graphqlOperation(updateSettings, { input }))
          console.log('updated theme...')
        } catch (err) {
          console.log('error updating theme: ', err)
        }
      }
    }
  }
  updateTheme = theme => {
    const { updateTheme } = this.props.context
    this.updateSettings(theme)
    updateTheme(theme)
    toast(`Theme successfully updated.`)
  }

  render() {
    const { theme } = this.props.context
    const {
      highlight, baseFontWeight, primaryFontColor, inverseButtonFontColor
    } = theme
    const { isDeploying } = this.state

    const dynamicHighlight = type => css`
      color: ${type === theme.type ? highlight : primaryFontColor};
    ` 
    const themedHeading = css`
      color: ${primaryFontColor};
      font-weight: ${baseFontWeight};
    `

    const themedDeployButton = css`
      background-color: ${highlight};
      color: ${inverseButtonFontColor};
    `

    return (
      <Layout noPadding>
        <div css={launchButtonContainer}>
          <button onClick={this.deploy} css={[deployButton, themedDeployButton]}>
            {
              isDeploying && <Loader customLoadingCss={[loadingIndicator]} />
            }
            Deploy
            </button>
        </div>
        <div>
          <p css={[heading, themedHeading]}>Theme</p>
          <div css={[buttonContainer]}>
            <Button
              onClick={() => this.updateTheme('light')}
              title="Light"
              customCss={[dynamicHighlight('light')]}
            />
            <Button
              onClick={() => this.updateTheme('dark')}
              title="Dark"
              customCss={[dynamicHighlight('dark')]}
            />
            <Button
              onClick={() => this.updateTheme('dank')}
              title="Dank"
              customCss={[dynamicHighlight('dank')]}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

export default function SettingsWthContext(props) {
  return (
    <BlogContext.Consumer>
        {
          context => <Settings {...props} context={context} />
        }
    </BlogContext.Consumer>
  )
}

const loadingIndicator = css`
  margin-right: 7px;
`

const launchButtonContainer = css`
  position: relative;
`

const deployButton = css`
  padding: 6px 32px;
  position: absolute;
  right: 0px;
  top: 0px;
  border-radius: 4px;
  outline: none;
  border: none;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, .2);
  cursor: pointer;
  transition: all .3s;
  display: flex;
  &:hover {
    opacity: .8;
  }
`

const heading = css`
  font-weight: 600;
  margin-bottom: 10px;
`

const buttonContainer = css`
  display: flex;
`

// const themeQuery = graphql`
//   query ThemeQuery {
//     allThemeInfo {
//       edges {
//         node {
//           data {
//             customStyles
//             theme
//             categories
//           }
//         }
//       }
//     }
//   }
// `
