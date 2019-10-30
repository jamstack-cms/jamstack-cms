import React from 'react'
import { css } from '@emotion/core'

export default function HeroPage(props) {
  console.log('props:', props)
  const { pageContext: { content} } = props
  return (
    <div css={container} className="hero-page-content">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
 )
}

const container = css`
  width: 900px;
  margin: 50px auto;
  @media (max-width: 900px) {
    width: 100%;
    padding: 0px 20px;
  }
`

export const pageQuery = graphql`
  query GetPageById($id: ID!) {
    appsync {
      getPage(id: $id) {
        id
        name
        slug
        content
        components
        published
      }
    }
  }
`