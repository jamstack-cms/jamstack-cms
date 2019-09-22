import React from 'react'
import { Router } from "@reach/router"
import EditPost from '../components/editpost'

export default function Post() {
  return (
    <Router>
      <EditPost path="/editpost/:id/:title/*" />
    </Router>
  )
}