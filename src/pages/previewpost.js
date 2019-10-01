import React from 'react'
import { Router } from "@reach/router"
import Preview from '../components/preview'

export default function PreviewPost() {
  return (
    <Router>
      <Preview path="/previewpost/:id/:title" />
    </Router>
  )
}