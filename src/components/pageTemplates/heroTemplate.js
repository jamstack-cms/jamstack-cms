import React, { useRef, useState } from 'react'
import { BlogContext } from '../../context/mainContext'
import { css } from '@emotion/core'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import uuid from 'uuid/v4'
import HeroPage from './HeroPage'
import Button from '../button'

import Header from './HeaderTemplate'
import Paragraph from './ParagraphTemplate'
import SubHeading from './SubHeading'
import ImageComponent from './imageComponent'
import { API, graphqlOperation } from 'aws-amplify'
import { createPage } from '../../graphql/mutations'
import { slugify } from '../../utils/helpers'

class HeroTemplate extends React.Component {
  state = {
    components: [],
    currentView: 'editing',
    pageHtml: '',
    pageTitle: '',
    isSaving: false,
    slug: ''
  }
  updateContent = (content, index) => {
    const components = [...this.state.components]
    components[index].content = content
    this.setState(() => ({ components }), this.updatePageHtml)
  }

  updatePageTitle = event => {
    const pageTitle = event.target.value
    const slug = slugify(pageTitle)
    this.setState({ pageTitle, slug })
  }

  save = async () => {
    try {
      const { pageTitle, pageHtml, components } = this.state
      if (!pageTitle || !pageHtml) return
      this.setState({ isSaving: true })
      const slug = slugify(pageTitle)
      const input = {
        name: pageTitle,
        slug,
        content: pageHtml,
        components: JSON.stringify(components)
      }
      await API.graphql(graphqlOperation(createPage, { input }))
      this.setState({ isSaving: false })
    } catch (err) {
      console.log('error saving page...:', err)
      this.setState({ isSaving: false })
    }
  }

  updatePageHtml = () => {
    const pageHtml = this.state.components.reduce((acc, next) => {
      const newHtml = `${acc}${next.content}`
      return newHtml
    }, ``)
    this.setState(() => ({ pageHtml }))
  }
  
  deleteComponent = index => {
    let components = [...this.state.components]
    components.splice(index, 1)
    this.setState(() => ({ components }), this.updatePageHtml)
  }
  moveComponent = (dragIndex, hoverIndex) => {
    const component = this.state.components[dragIndex]
    let components = [...this.state.components]
    components.splice(dragIndex, 1)
    components.splice(hoverIndex, 0, component)
    this.setState(() => ({ components }), this.updatePageHtml)
  }
  createComponent = (component) => {
    let newComponent = {
      id: uuid()
    }
    switch(component) {
      case 'header':
        newComponent = {
          ...newComponent,
          component: Header,
          deleteComponent: this.deleteComponent,
          content: ''
        }
        break
      case 'paragraph':
        newComponent = {
          ...newComponent,
          component: Paragraph,
          deleteComponent: this.deleteComponent,
          content: ''
        }
        break
      case 'subheading':
        newComponent = {
          ...newComponent,
          component: SubHeading,
          deleteComponent: this.deleteComponent,
          content: ''
        }
        break
      case 'image':
        newComponent = {
          ...newComponent,
          component: ImageComponent,
          deleteComponent: this.deleteComponent,
          content: '',
        }
        break
      default:
        return null
    }
    const components = [...this.state.components, newComponent]
    this.setState({ components })
  }
  toggleView = view => {
    this.setState({ currentView: view })
  }
  render() {
    const { width, theme } = this.props.context
    const { slug, components, currentView, pageHtml, pageTitle, isSaving } = this.state
    const dynamicWidthStyle = css`
      width: ${width ? width : '1000px'};
    `

    return (
      <DndProvider backend={HTML5Backend}>
        <div css={[container, dynamicWidthStyle]}>
          <div css={inputContainerStyle(theme)}>
            <input
              onChange={this.updatePageTitle}
              placeholder="Page title"
              value={pageTitle}
              css={inputStyle(theme)}
            />
            { pageTitle && <p css={slugStyle}>slug: {slug}</p>}
          </div>
          <div css={[componentCreatorContainerStyle()]}>
            <p onClick={() => this.createComponent('header')} css={componentCreatorStyle(theme)}>Header</p>
            <p onClick={() => this.createComponent('subheading')} css={componentCreatorStyle(theme)}>Subheading</p>
            <p onClick={() => this.createComponent('image')} css={componentCreatorStyle(theme)}>Image</p>
            <p onClick={() => this.createComponent('paragraph')} css={componentCreatorStyle(theme)}>Paragraph</p>
            <p onClick={() => this.createComponent('pwithimage')} css={componentCreatorStyle(theme, true)}>Paragraph with Image</p>
          </div>
          <div css={[pageContentButtonContainerStyle()]}>
            {
              pageHtml && (
                <>
                <Button
                  onClick={() => this.toggleView(currentView === 'preview' ? 'editing' : 'preview')}
                  title={currentView === 'editing' ? 'Preview' : 'Edit'}
                />
                <Button
                  onClick={this.save}
                  title="Save"
                  isLoading={isSaving}
                />
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
                  deleteComponent={item.deleteComponent}
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

const inputContainerStyle = () => css`
  margin: 0px 24px;
  display: flex;
  align-items: flex-end;
`

const slugStyle = () => css`
  margin-bottom: 15px;
`

const pageContentButtonContainerStyle = () => css`
  margin: 0px 10px;
  display: flex;
`

const componentCreatorContainerStyle = () => css`
  display: flex;
  margin: 0px 20px;
`

const componentCreatorStyle = (theme, lastItem) => {
  return css`
    border: 1px solid #ededed;
    border-right: ${lastItem ? '1px solid #ededed' : 'none' };
    padding: 10px 40px;
    trasition: all .3s;
    cursor: pointer;
    &:hover {
      background: #fefefe;
    }
  `
}

const container = css`
  margin: 0 auto;
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