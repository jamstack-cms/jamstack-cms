import React, { useRef } from 'react'
import { BlogContext } from '../../context/mainContext'
import { css } from '@emotion/core'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import uuid from 'uuid/v4'
import HeroPage from './heroPage'
import Button from '../button'

import Header from './HeaderTemplate'
import Code from './CodeTemplate'
import Paragraph from './ParagraphTemplate'
import SubHeading from './SubHeading'
import ImageComponent from './imageComponent'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import { createPage, updatePage } from '../../graphql/mutations'
import { slugify, getImageSource } from '../../utils/helpers'
import getKeyWithFullPath from '../../utils/getKeyWithFullPath'
import saveFile from '../../utils/saveFile'
import getKeyWithPath from '../../utils/getKeyWithPath'

import config from '../../../jamstack-config'

const {
  aws_user_files_s3_bucket: bucket
} = config

function getPageHtml(components) {
  const pageHtml = components.reduce((acc, next) => {
    let newHtml = `${acc}${next.content}`
    if (next.type === 'image') {
      newHtml = `${acc}${next.content.imageHtml}`
    }
    return newHtml
  }, ``)
  return pageHtml
}

class HeroTemplate extends React.Component {
  state = {
    components: [],
    pageId: null,
    currentView: 'editing',
    pageHtml: '',
    pageTitle: '',
    isSaving: false,
    slug: '',
    isLoading: false,
    pageData: {},
    isPublished: false,
    isPublishing: false,
    isUnpublishing: false,
  }
  async componentDidUpdate() {
    const { pageData } = this.props
    if (pageData && pageData.components) {
      if (!this.state.isLoading) return
      let { components } = pageData
      components = components.reduce((acc, next)  => {
        const component = createComponent(next.type, next.content)
        acc.push(component)
        return acc
      }, [])

      await Promise.all(components.map(async component => {
        if (component.type === 'image') {
          const imageSource = getImageSource(component.content.imageHtml)
          const key = getKeyWithPath(imageSource)
          const signedImage = await Storage.get(key)
          component.content.imageHtml = `<img src="${signedImage}" />`
        }
      }))
      
      this.setState({
        components,
        isLoading: false,
        slug: pageData.slug,
        pageTitle: pageData.name,
        pageId: pageData.id,
        isPublished: pageData.published
      })
    } else {
      console.log('not about to update')
      return null
    }
  }
  static getDerivedStateFromProps(props, state) {
    const { pageData } = props
    if (pageData && !pageData.components) {
      return {
        isLoading: true
      }
    } else {
      return null
    }
  }
  updateContent = (content, index) => {
    const components = [...this.state.components]
    components[index].content = content
    this.setState(() => ({ components }), this.updatePageHtml)
  }

  updatePageHtml = () => {
    const pageHtml = getPageHtml(this.state.components)
    this.setState(() => ({ pageHtml }))
  }

  updatePageTitle = event => {
    const pageTitle = event.target.value
    const slug = slugify(pageTitle)
    this.setState({ pageTitle, slug })
  }

  save = async (publishingState) => {
    console.log('publishingState: ', publishingState)
    if (this.state.isSaving) return
    try {
      let operation = createPage
      let { pageTitle, pageHtml, pageId } = this.state
      if (!pageTitle || !pageHtml) return
      if (!publishingState) {
        this.setState({ isSaving: true })
      }
      if (publishingState === 'publish') {
        this.setState({ isPublishing: true })
      }
      if (publishingState === 'unpublish') {
        this.setState({ isUnpublishing: true })
      }
      setImmediate(async() => {
        let newComponents = [...this.state.components].filter(component => (component.content))
        let baseComponents = JSON.stringify(this.state.components.filter(component => (component.content)))
        newComponents = await Promise.all(newComponents.map(async component => {
          if (component.type === 'image') {
            if (component.content.imageHtml.includes('blob:http')) {
              const fileInfo = await saveFile(component.content.src)
              const url = fileInfo.url
              component.content.imageHtml = `<img src="${url}" />`
            }
            if (component.content.imageHtml.includes(bucket)) {
              const imageSource = getImageSource(component.content.imageHtml)
              const imageUrl = getKeyWithFullPath(imageSource)
              component.content.imageHtml = `<img src="${imageUrl}" />`
            }
          }
          return component
        }))

        pageHtml = getPageHtml(newComponents)

        const slug = slugify(pageTitle)
        const input = {
          name: pageTitle,
          slug,
          content: pageHtml,
          components: JSON.stringify(newComponents),
          published: publishingState === 'publish' ? true : false
        }
        if (pageId) {
          operation = updatePage
          input['id'] = pageId
        }

        const newPageData = await API.graphql(graphqlOperation(operation, { input }))
        const { createPage } = newPageData.data

        baseComponents = JSON.parse(baseComponents)

        // worst hack ever. couldn't figure another way, so for now doing this:
        // stringifying state, then parsing and updating because state was being mutated somehow.
        baseComponents = baseComponents.map((c, i) => {
          c.component = newComponents[i].component
          if (c.type === 'image') {
            c.content = {
              ...c.content,
              src: newComponents[i].content.src
            }
          } else {
            c.content = newComponents[i].content
          }
          return c
        })
        baseComponents = await Promise.all(baseComponents.map(async component => {
          if (component.type === 'image') {
            if (
              (!component.content.imageHtml.includes('blob:http')) &&
              (!component.content.imageHtml.includes('&X-Amz-SignedHeaders=host'))
            ) {              
              const imageSource = getImageSource(component.content.imageHtml)
              const key = getKeyWithPath(imageSource)
              const signedImage = await Storage.get(key)
              component.content.imageHtml = `<img src="${signedImage}" />`
            }
          }
          return component
        }))

        this.setState({
          pageId: createPage ? createPage.id : this.state.pageId,
          isPublished: publishingState === 'publish' ? true : this.state.isPublished,
          isPublishing: false, isUnpublishing: false, isSaving: false, components: baseComponents
        })
      })
    } catch (err) {
      console.log('error saving page...:', err)
      this.setState({ isSaving: false })
    }
  }
  
  deleteComponent = index => {
    let components = [...this.state.components]
    components.splice(index, 1)
    this.setState(() => ({ components }), this.updatePageHtml)
  }
  moveComponent = (dragIndex, hoverIndex) => {
    console.log('moveComponent called: ')
    const component = this.state.components[dragIndex]
    let components = [...this.state.components]
    components.splice(dragIndex, 1)
    components.splice(hoverIndex, 0, component)
    this.setState(() => ({ components }), this.updatePageHtml)
  }
  createComponent = type => {
    // this.setState({ currentView: 'editing' })
    const component = createComponent(type)
    const components = [...this.state.components, component]
    this.setState({ components })
  }
  toggleView = view => {
    const pageHtml = this.state.pageHtml
    this.setState({ currentView: view, pageHtml })
  }
  render() {
    const { width, theme } = this.props.context
    let { slug, components, currentView, pageHtml, pageTitle, isSaving, isPublished, isPublishing, isUnpublishing } = this.state
    const location = window.location.pathname.includes('/editpage') ? 'edit' : 'main'
    
    return (
      <DndProvider backend={HTML5Backend}>
        <div css={[container(theme, width, location)]} className="hero-template">
          <div css={inputContainerStyle(theme)}>
            <input
              onChange={this.updatePageTitle}
              placeholder="Page title"
              value={pageTitle}
              css={inputStyle(theme)}
            />
            { pageTitle && <p css={slugStyle}>slug: {slug}</p>}
          </div>
          {
            currentView !== 'preview' && (
              <div css={[componentCreatorContainerStyle()]}>
                <p onClick={() => this.createComponent('paragraph')} css={componentCreatorStyle(theme)}>Rich Text</p>
                <p onClick={() => this.createComponent('header')} css={componentCreatorStyle(theme)}>Header</p>
                <p onClick={() => this.createComponent('subheading')} css={componentCreatorStyle(theme)}>Subheading</p>
                <p onClick={() => this.createComponent('image')} css={componentCreatorStyle(theme, true)}>Image</p>
                <p onClick={() => this.createComponent('code')} css={componentCreatorStyle(theme, true)}>Code</p>
                {/* <p onClick={() => this.createComponent('pwithimage')} css={componentCreatorStyle(theme, true)}>Paragraph with Image</p> */}
              </div>
            )
          }
          <div css={[pageContentButtonContainerStyle()]}>
            {
              pageHtml && (
                <>
                  <Button
                    onClick={() => this.toggleView(currentView === 'preview' ? 'editing' : 'preview')}
                    title={currentView === 'editing' ? 'Preview' : 'Edit'}
                    customCss={[buttonStyle(theme)]}
                  />
                  <Button
                    onClick={() => this.save()}
                    title="Save"
                    isLoading={isSaving}
                    customCss={[buttonStyle(theme)]}
                    customLoadingCss={[loadingStyle(theme)]}
                  />
                  {
                    isPublished ? (
                      <Button
                        onClick={() => this.save('unpublish')}
                        title="Unpublish"
                        isLoading={isUnpublishing}
                        customCss={[buttonStyle(theme)]}
                        customLoadingCss={[loadingStyle(theme)]}
                      />
                    ) : (
                      <Button
                        onClick={() => this.save('publish')}
                        title="Publish"
                        isLoading={isPublishing}
                        customCss={[buttonStyle(theme)]}
                        customLoadingCss={[loadingStyle(theme)]}
                    />
                    )
                  }
                </>
              )
            }
          </div>
          {
            currentView === 'preview' ? (
              <HeroPage
                html={pageHtml}
              />
            ) : (
              components.map((item, index) => (
                <Draggable
                  component={item.component}
                  moveCard={this.moveComponent}
                  id={item.id}
                  index={index}
                  key={item.id}
                  theme={theme}
                  deleteComponent={this.deleteComponent}
                  updateContent={content => this.updateContent(content, index)}
                  currentView={currentView}
                  content={item.content}
                />
              ))
            )
          }
        </div>
      </DndProvider>
    )
  }
}

function createComponent(type, content) {
  let component = {
    id: uuid()
  }
  switch(type) {
    case 'header':
        component = {
        ...component,
        component: Header,
        content: content ? content : '',
        type: 'header'
      }
      break
    case 'paragraph':
        component = {
        ...component,
        component: Paragraph,
        content: content ? content : '',
        type: 'paragraph'
      }
      break
    case 'subheading':
        component = {
        ...component,
        component: SubHeading,
        content: content ? content : '',
        type: 'subheading'
      }
      break
    case 'image':
        component = {
        ...component,
        component: ImageComponent,
        content: content ? content : '',
        type: 'image'
      }
      break
    case 'code':
        component = {
        ...component,
        component: Code,
        content: content ? content : '',
        type: 'code'
      }
      break
    default:
      return null
  }
  return component
}

function Draggable({ content, updateContent, currentView, component: Component, id, deleteComponent, index, moveCard, theme }) {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: 'COMPONENT',
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'COMPONENT', id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{opacity}}>
      <Component
         deleteComponent={deleteComponent}
         index={index}
         updateContent={updateContent}
         currentView={currentView}
         content={content}
       />
    </div>
  )
}

const buttonStyle = () => css`
  padding-left: 8px;
  font-size: 14px;
`

const loadingStyle = ({ primaryFontColor }) => css`
  margin-top: 4px;
  color: ${primaryFontColor};
`

const inputContainerStyle = () => css`
  margin: 0px 20px;
  display: flex;
  align-items: flex-end;
`

const slugStyle = () => css`
  margin-bottom: 15px;
`

const pageContentButtonContainerStyle = () => css`
  margin: 20px 3px;
  display: flex;
`

const componentCreatorContainerStyle = () => css`
  display: flex;
  margin: 0px 20px;
`

const componentCreatorStyle = ({ secondaryBackgroundColor }, lastItem) => {
  return css`
    border: 1px solid #ededed;
    border-right: ${lastItem ? '1px solid #ededed' : 'none' };
    padding: 5px 25px;
    font-size: 14px;
    margin: 0px;
    transition: all .3s;
    cursor: pointer;
    &:hover {
      background-color: ${secondaryBackgroundColor};
    }
  `
}

const container = (theme, width, location) => css`
  width: ${width ? width : '1000px'};
  margin: 0 auto;
  margin-top: ${location === 'edit' ? '50px' : '0px'};
`

const inputStyle = ({ primaryFontColor }) => css`
  color: ${primaryFontColor};
  background-color: transparent;
  font-size: 20px;
  border: none;
  outline: none;
  width: 100%;
  margin: 20px 0px 5px;
  font-weight: 300;
  padding: 6px;
  margin: 0px 20px 10px 0px;
  border-bottom: 1px solid #ddd;
  width: 300px;
`

const HeroTemplateWithContext = props => (
  <BlogContext.Consumer>
    {
      context => <HeroTemplate {...props} context={context} />
    }
  </BlogContext.Consumer>
)

export default HeroTemplateWithContext