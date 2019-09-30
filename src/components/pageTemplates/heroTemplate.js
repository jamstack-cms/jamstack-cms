import React from 'react'
import { BlogContext } from '../../context/mainContext'
import { css } from '@emotion/core'

class HeroTemplate extends React.Component {
  render() {
    console.log('props: ' , this.props)
    const { width } = this.props.context
    const dynamicWidthStyle = css`
      width: ${width ? width : '1000px'};
    `
    return (
      <div css={[container, dynamicWidthStyle]}>
        <img
          alt='header'
          css={headerImage}
        />
        <h1
          css={headerTitle}
        >
          In defense of being on the phone all the damn time 24 hours
        </h1>
        <p>More off this less hello salamander lied porpoise much over tightly circa horse taped so innocuously outside crud mightily rigorous plot life. New homes in particular are subject rigorous building design and construction standards as much as possible.

        As you’re tapping, scrolling, and swiping on your phone, you probably don’t give much thought to the fact that your apps are consuming electricity — just that they’re chipping away at your battery life.</p>
      </div>
    )
  }
}

const headerTitle = css`
  margin-top: 15px;
`

const container = css`
  margin: 0 auto;
  margin-top: 15px;
`

const headerImage = css`
  width: 100%;
  height: 300px;
  background-color: #dadada;
  border: none;
  outline: none;
  margin-bottom: 0;
`

const HeroTemplateWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <HeroTemplate {...props} context={context} />
    }
  </BlogContext.Consumer>
)

export default HeroTemplateWithContext