import React, { useEffect } from 'react'

import { css } from '@emotion/core'
import { Link } from 'gatsby'
import Button from './button'

import { BlogContext } from '../context/mainContext'

function PageList({ publishPage, toggleViewState, unpublishPage, fetchPages, deletePage, pages, context: { theme } }) {
  useEffect(() => {
    fetchPages()
    // eslint-disable-next-line
  }, [])

  if (!pages.length) {
    return (
      <div>
        <span css={primary(theme)}>No pages yet! Create your first page</span> <span css={underline(theme)} onClick={() => toggleViewState('createPage')}>here</span>.
      </div>
    )
  }

  return (
    <div>
      {
        pages.map((page, index) => (
          <div key={index} css={pageLinkContainer}>
            <div css={[sideButtonContainer]}>
              <Button
                title="Delete"
                onClick={() => deletePage(page.id)}
                customCss={[sideButton(theme)]}
              />
              {
                page.published ? (
                  <Button
                    title="Unpublish"
                    onClick={() => unpublishPage(page)}
                    customCss={[sideButton(theme)]}
                  />
                ) : (
                  <Button
                    title="Publish"
                    onClick={() => publishPage(page)}
                    customCss={[sideButton(theme), publishButton(theme)]}
                  />
                )
              }
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

const primary = ({ primaryFontColor }) => css`
  color: ${primaryFontColor};
`

const underline = ({ highlight }) => css`
  color: ${highlight};
  cursor: pointer;
  &: hover {
    text-decoration: underline;
  }
`

const pageLinkContainer = css`
  position: relative;
`

const sideButton = ({ fontFamily }) => css`
  font-family: ${fontFamily};
  font-size: 14px;
  opacity: .7;
  margin-bottom: 5px;
  cursor: pointer;
  padding: 0;
  &:hover {
    opacity: 1;
  }
`

const sideButtonContainer = css`
  position: absolute;
  left: -80px;
  top: 0px;
  margin-top: 23px;
  min-width: 100px;
`

const publishButton = ({highlight}) => css`
  color: ${highlight};
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