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
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Settings extends React.Component {
  state = {
    isDeploying: false
  }
  rangeTimeout = null
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
  updateSettings = async (input, type) => {
    try {
      await API.graphql(graphqlOperation(createSettings, { input }))
      console.log(`${type} successfully updated...`)
    } catch (err) {
      if (err.errors[0].message.includes('The conditional request failed')) {
        console.log(`${type} already set.... Updating ${type}.`)
        try {
          await API.graphql(graphqlOperation(updateSettings, { input }))
          console.log(`updated ${type}...`)
        } catch (err) {
          console.log(`error updating ${type}: `, err)
        }
      }
    }
  }
  updateTheme = theme => {
    const { updateTheme } = this.props.context
    const input = {
      id: 'jamstack-cms-theme-info',
      theme
    }
    this.updateSettings(input, 'theme')
    updateTheme(theme)
    toast(`Theme successfully updated.`)
  }

  toggleBorder = () => {
    let { borderEnabled, updateBorderEnabled } = this.props.context
    if (borderEnabled === 'enabled') {
      borderEnabled = 'disabled'
      updateBorderEnabled(borderEnabled)
    } else {
      borderEnabled = 'enabled'
      updateBorderEnabled(borderEnabled)
    }
    const input = {
      id: 'jamstack-cms-theme-info',
      border: borderEnabled
    }
    this.updateSettings(input, 'border')
  }
  updateBorder = width => {
    clearTimeout(this.rangeTimeout)
    const { updateBorderWith } = this.props.context
    updateBorderWith(width)
    this.rangeTimeout = setTimeout(() => {
      const input = {
        id: 'jamstack-cms-theme-info',
        borborderWidthder: width
      }
      this.updateSettings(input, 'border width')
      console.log('updated setting in the api')
    }, 1000)
  }

  render() {
    const { theme, themeBorderWidth } = this.props.context
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

    return (
      <Layout noPadding>
        <div css={launchButtonContainer}>
          <button onClick={this.deploy} css={[baseButton(theme), deployButton()]}>
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
          <div css={[settingContainer]}>
            <p css={[heading, themedHeading]}>Border</p>
            <button onClick={this.toggleBorder} css={[baseButton(theme)]}>
              Toggle Border
            </button>
          </div>
          <div css={[settingContainer]}>
            <p css={[heading, themedHeading]}>Border Width - {themeBorderWidth}</p>
            <Slider
              value={themeBorderWidth}
              orientation="horizontal"
              onChange={this.updateBorder}
              min={0}
              max={50}
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

const widthInput = ({ primaryFontColor }) => css`
  outline: none;
  border: none;
  color: ${primaryFontColor};
  border-bottom: 2px solid ${primaryFontColor};
`

const settingContainer = css`
  margin-top: 25px;
`

const loadingIndicator = css`
  margin-right: 7px;
`

const launchButtonContainer = css`
  position: relative;
`

const baseButton = ({ highlight, inverseButtonFontColor }) => css`
  background-color: ${highlight};
  color: ${inverseButtonFontColor};
  padding: 6px 32px;
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

const deployButton = () => css`
  position: absolute;
  right: 0px;
  top: 0px;
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
