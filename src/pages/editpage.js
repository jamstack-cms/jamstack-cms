import React from 'react'
import { Router } from "@reach/router"
import EditPage from '../components/editpage'

export default function Post() {
  return (
    <Router>
      <EditPage path="/editpage/:id/:title/*" />
    </Router>
  )
}