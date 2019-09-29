import React from "react"
import { graphql } from "gatsby"
import Layout from '../layouts/mainLayout'
import Button from '../components/button'
import { css } from '@emotion/core'
import { highlight } from '../theme'

class Settings extends React.Component {
  render() {
    const { theme, updateTheme } = this.props.context

    const dynamicHighlight = type => css`
      color: ${type === theme ? highlight : 'black'};
    ` 

    return (
      <Layout noPadding>
        <p css={heading}>Theme</p>
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

const heading = css`
  font-weight: 600;
  margin-bottom: 10px;
`

const buttonContainer = css`
  display: flex;
`

export default Settings

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
