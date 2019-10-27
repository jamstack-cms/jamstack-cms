import React from 'react'

import { css } from '@emotion/core'

import { BlogContext } from '../context/mainContext'
import { Link } from 'gatsby'

function PageList({
  pages, context: { theme }
}) {
  return (
    <div>
      {
        pages.map((page, index) => (
          <Link to={`/editpage/${page.id}/${page.slug}`}>
            <div key={index} css={pageItemContainerStyle}>
              <div>
                  <p css={pageNameStyle(theme)}>{page.name}</p>
              </div>
              <div>
                <p css={pageTitleStyle(theme)}>slug: {page.slug}</p>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  )
}

function PageListWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <PageList {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export default PageListWithContext

const pageNameStyle = () => css`
  margin: 0;
`

const pageTitleStyle = () => css`
  margin: 0;
  color: 
`

const pageItemContainerStyle = css`
  border-bottom: 1px solid #ddd;
  padding: 20px 0px 20px;
`