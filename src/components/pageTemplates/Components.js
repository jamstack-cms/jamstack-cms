import React from 'react'
import { css } from '@emotion/core'

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      css={css`
        cursor: pointer;
        padding: 8px;
        color: ${reversed
          ? active ? 'white' : '#aaa'
          : active ? 'black' : '#ccc'};
        opacity: .7;
        &:hover {
          opacity: 1;
        }
      `}
    />
  )
)

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    css={css`
    & > * {
      display: inline-block;
    }
  `}
  />
))


export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    css={css`
      font-size: 18px;
      vertical-align: text-bottom;
    `}
  />
))

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    css={css`
    position: relative;
    padding: 1px 18px 17px;
    margin: 0 -20px;
    border-bottom: 2px solid #eee;
    margin-bottom: 20px;
  `}
  />
))