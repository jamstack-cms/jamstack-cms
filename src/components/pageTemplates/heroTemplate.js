import React, { useRef, useState } from 'react'
import { BlogContext } from '../../context/mainContext'
import { css } from '@emotion/core'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import uuid from 'uuid/v4'

import Header from './HeaderTemplate'
import Paragraph from './ParagraphTemplate'
import SubHeading from './SubHeading'

class HeroTemplate extends React.Component {
  state = {
    components: []
  }
  deleteComponent = index => {
    let components = [...this.state.components]
    components.splice(index, 1)
    this.setState({ components })
  }
  moveComponent = (dragIndex, hoverIndex) => {
    const component = this.state.components[dragIndex]
    let components = [...this.state.components]
    components.splice(dragIndex, 1)
    components.splice(hoverIndex, 0, component)
    this.setState({ components })
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
          deleteComponent: this.deleteComponent
        }
        break
      case 'paragraph':
          newComponent = {
            ...newComponent,
            component: Paragraph,
            deleteComponent: this.deleteComponent
          }
          break
      case 'subheading':
          newComponent = {
            ...newComponent,
            component: SubHeading,
            deleteComponent: this.deleteComponent
          }
          break
      default:
        return null
    }
    const components = [...this.state.components, newComponent]
    this.setState({ components })
  }
  render() {
    const { width, theme } = this.props.context
    const { components } = this.state
    const dynamicWidthStyle = css`
      width: ${width ? width : '1000px'};
    `
    return (
      <DndProvider backend={HTML5Backend}>
        <div css={[container, dynamicWidthStyle]}>
        <div css={[componentCreatorContainerStyle()]}>
          <p onClick={() => this.createComponent('header')} css={componentCreatorStyle(theme)}>Header</p>
          <p onClick={() => this.createComponent('subheading')} css={componentCreatorStyle(theme)}>Subheading</p>
          <p onClick={() => this.createComponent('image')} css={componentCreatorStyle(theme)}>Image</p>
          <p onClick={() => this.createComponent('paragraph')} css={componentCreatorStyle(theme)}>Paragraph</p>
          <p onClick={() => this.createComponent('pwithimage')} css={componentCreatorStyle(theme, true)}>Paragraph with Image</p>
        </div>
          {
            components.map((item, index) => (
              <Draggable
                component={item.component}
                moveCard={this.moveComponent}
                id={item.id}
                index={index}
                key={item.id}
                theme={theme}
                deleteComponent={item.deleteComponent}
              />
            ))
          }
        </div>
      </DndProvider>
    )
  }
}

function Draggable({ component: Component, id, deleteComponent, index, moveCard, theme }) {
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
       />
    </div>
  )
}

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

const textStyle = ({ primaryFontColor }) => css`
  color: ${primaryFontColor};
`

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