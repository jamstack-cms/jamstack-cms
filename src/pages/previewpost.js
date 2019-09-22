import React from 'react'
import { Router } from "@reach/router"
import Preview from '../components/Preview'

export default function PreviewPost() {
  return (
    <Router>
      <Preview path="/previewpost/:id/:title" />
    </Router>
  )
}