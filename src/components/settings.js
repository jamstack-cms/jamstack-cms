import React from "react"
// import { graphql } from "gatsby"
import Layout from '../layouts/mainLayout'
import Button from '../components/button'
import SolidButton from '../components/solidButton'
import { css } from '@emotion/core'
import { BlogContext } from '../context/mainContext'
import { API, graphqlOperation } from 'aws-amplify'
import { updateSettings, createSettings } from '../graphql/mutations'
import { toast } from 'react-toastify'
import amplifyDeploy from '../providers/webhookProviders/amplifyDeploy'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Settings extends React.Component {
  state = {
    isDeploying: false,
    description: this.props.context.siteDescription
  }
  rangeTimeout = null
  descriptionTimeout = null
  deploy = async () => {
    this.setState({
        isDeploying: true
      }, async () => {
      try {
        await amplifyDeploy()
        this.setState({ isDeploying: false})
        toast('Successfully deployed new build!')
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
          console.log(`${type} successfully updated...`)
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
    console.log('input: ', input)
    this.updateSettings(input, 'border')
  }
  updateBorder = width => {
    clearTimeout(this.rangeTimeout)
    const { updateBorderWith } = this.props.context
    updateBorderWith(width)
    this.rangeTimeout = setTimeout(() => {
      const input = {
        id: 'jamstack-cms-theme-info',
        borderWidth: width
      }
      this.updateSettings(input, 'border width')
    }, 1000)
  }
  updateDescription = event => {
    clearTimeout(this.descriptionTimeout)
    const { updateDescription } = this.props.context
    const description = event.target.value
    this.setState({
      description
    })
    this.descriptionTimeout = setTimeout(() => {
      const input = {
        id: 'jamstack-cms-theme-info',
        description
      }
      this.updateSettings(input, 'description')
      updateDescription(description)
    }, 1000)
  }
  render() {
    const { theme, themeBorderWidth } = this.props.context
    console.log('context: ', this.props.context)
    const {
      highlight, baseFontWeight, primaryFontColor
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
          <SolidButton
            onClick={this.deploy}
            isLoading={isDeploying}
            customCss={[deployButton()]}
            title="Deploy"
          />
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
            <Button
              onClick={() => this.updateTheme('reactive')}
              title="Reactive"
              customCss={[dynamicHighlight('reactive')]}
            />
          </div>
          <div css={[settingContainer]}>
            <p css={[heading, themedHeading]}>Border</p>
            <SolidButton
              onClick={this.toggleBorder}
              title="Toggle Border"
            />
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
          <div css={[settingContainer]}>
            <p css={[heading, themedHeading]}>Site description</p>
            <textarea
              placeholder="Your blog description"
              css={blogDescriptionStyle}
              onChange={this.updateDescription}
              value={this.state.description}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

export default function SettingsWithContext(props) {
  return (
    <BlogContext.Consumer>
        {
          context => <Settings {...props} context={context} />
        }
    </BlogContext.Consumer>
  )
}

const blogDescriptionStyle = css`
  outline: none;
  border: 1px solid #ededed;
  padding: 20px;
  width: 100%;
`

const settingContainer = css`
  margin-top: 25px;
`

const launchButtonContainer = css`
  position: relative;
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
