import React, { useEffect } from 'react'

import { css } from '@emotion/core'

import { BlogContext } from '../context/mainContext'
import { Link } from 'gatsby'

function PageList({ fetchPages, deletePage, pages, context: { theme } }) {
  useEffect(() => {
    fetchPages()
  }, [])
  return (
    <div>
      {
        pages.map((page, index) => (
          <div key={index} css={pageLinkContainer}>
            <div css={[sideButtonContainer]}>
              <p onClick={() => deletePage(page.id)} css={[sideButton(theme)]}>Delete</p>
            </div>
            <Link to={`/editpage/${page.id}/${page.slug}`}>
              <div css={pageItemContainerStyle}>
                <div>
                    <p css={pageNameStyle(theme)}>{page.name}</p>
                </div>
                <div>
                  <p css={pageTitleStyle(theme)}>slug: {page.slug}</p>
                </div>
              </div>
            </Link>
            <div>
            </div>
          </div>
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

const pageLinkContainer = css`
  position: relative;
`

const sideButton = ({ fontFamily }) => css`
  font-family: ${fontFamily};
  font-size: 14px;
  opacity: .7;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`

const sideButtonContainer = css`
  position: absolute;
  left: -80px;
  top: 0px;
  margin-top: 35px;
  min-width: 100px;
`
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