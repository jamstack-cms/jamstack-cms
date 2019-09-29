import React from "react"
import { graphql } from "gatsby"
import Layout from '../layouts/mainLayout'
import Button from '../components/button'
import { css } from '@emotion/core'
import { BlogContext } from '../context/mainContext'

class Settings extends React.Component {
  render() {
    const { theme, updateTheme } = this.props.context
    const {
      highlight, baseFontWeight, primaryFontColor
    } = theme

    const dynamicHighlight = type => css`
      color: ${type === theme.type ? highlight : primaryFontColor};
    ` 
    const themedHeading = css`
      color: ${primaryFontColor};
      font-weight: ${baseFontWeight};
    `

    return (
      <Layout noPadding>
        <p css={[heading, themedHeading]}>Theme</p>
        <div css={[buttonContainer]}>
          <Button
            onClick={() => updateTheme('light')}
            title="Light"
            customCss={[dynamicHighlight('light')]}
          />
          <Button
            onClick={() => updateTheme('dark')}
            title="Dark"
            customCss={[dynamicHighlight('dark')]}
          />
          <Button
            onClick={() => updateTheme('dank')}
            title="Dank"
            customCss={[dynamicHighlight('dank')]}
          />
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

const heading = css`
  font-weight: 600;
  margin-bottom: 10px;
`

const buttonContainer = css`
  display: flex;
`

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
