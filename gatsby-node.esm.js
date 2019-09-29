const { slugify } = require('./src/utils/helpers')
import fs from 'fs'
import urlRegex from 'url-regex'
import Amplify, { Storage } from 'aws-amplify'
import getImageKey from './src/utils/getImageKey'
import getRawPath from './src/utils/getRawPath'
import downloadImage from './src/utils/downloadImage'
import config from './jamstack-config'

const blogPost = require.resolve(`./src/templates/blog-post.js`)

let APPSYNC_KEY
if(process.env.APPSYNC_KEY) {
  APPSYNC_KEY = process.env.APPSYNC_KEY
} else {
  const JSConfig = require('./jamstack-api-key.js')
  console.log("config: ", JSConfig)
  APPSYNC_KEY = JSConfig['aws_appsync_apiKey']
}

const axios = require('axios')
const graphqltag = require('graphql-tag')
const gql = require('graphql')
const { print } = gql

Amplify.configure(config)

const {
  aws_user_files_s3_bucket: bucket
} = config

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const postData = await graphql(` {
    appsync {
      listPosts {
        items {
          content
          createdAt
          description
          id
          published
          title
          cover_image
        }
      }
    }
  }`)

  const blogPosts = postData.data.appsync.listPosts.items.filter(post => post.published)
  const images = await Storage.list('')
  const imageKeys = images.map(i => i.key)
  await Promise.all(
    blogPosts.map(async(post, index) => {
      if (!post) return
      if (!fs.existsSync(`${__dirname}/public/downloads`)){
        fs.mkdirSync(`${__dirname}/public/downloads`);
      }
      const content = post.content
      const contentUrls = content.match(urlRegex());
      let images = []
      if (contentUrls) {
        contentUrls.forEach(url => {
          if(url.includes(bucket)) {
            const key = getImageKey(url)
            const cleanedKey = key.replace(/[{()}]/g, '');
            const keyWithPath = `images/${cleanedKey}`
            if (imageKeys.indexOf(keyWithPath) !== -1) {
              const image = Storage.get(keyWithPath)
              images.push(image)
            }
          }
        })
      }
      let signedUrls = []
      if (images.length) {
        try {
          signedUrls = await Promise.all(images)
        } catch (err) {
          console.log('error getting signed urls::::', err)
        }
      }
      let urlIndex = 0
      const pathsToDownload = []
      const rawPaths = []
  
      // create array of raw local image URLs (rawPaths)
      // we use these raw paths locally to reference the downloaded images.
      signedUrls.forEach(url => rawPaths.push(`${getRawPath(url)})`))
      // create array of images with signed paths so we can download them in the next step
      signedUrls.forEach(signedUrl => pathsToDownload.push(downloadImage(signedUrl)))

      // download cover image
      let coverImage
      if (post.cover_image) {
        const key = getImageKey(post.cover_image)
        const keyWithPath = `images/${key}`
        if (imageKeys.indexOf(keyWithPath) !== -1) {
          const signedImage = await Storage.get(keyWithPath)
          pathsToDownload.push(downloadImage(signedImage))
          coverImage = getImageKey(post.cover_image)
          coverImage = `../downloads/${coverImage}`
        }
      }

      if (pathsToDownload.length) {
        // if there are any images, we download them to the local file system
        try {
          await Promise.all(pathsToDownload)
        } catch (err) {
          console.log('error downloading images to file system...', err)
        }
      }
  
      let updatedContent = content.replace(urlRegex({strict: false}), (url) => {
        if(url.includes(bucket)) {
          const chosenUrl = rawPaths[urlIndex]
          const split = chosenUrl.split('/')
          const relativeUrl = `../downloads/${split[split.length - 1]}`
          urlIndex++
          return relativeUrl
        } else {
          return url
        }
      })
      post['content'] = updatedContent
      
      const previous = index === blogPosts.length - 1 ? null : blogPosts[index + 1].node
      const next = index === 0 ? null : blogPosts[index - 1]
      createPage({
        path: slugify(post.title),
        component: blogPost,
        context: {
          id: post.id,
          content: post.content,
          title: post.title,
          published: post.published,
          createdAt: post.createdAt,
          cover_image: post.cover_image,
          local_cover_image: coverImage,
          description: post.description,
          slug: slugify(post.title),
          type: "appsyncData",
          previous,
          next,
        },
      })
    })
  )
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/editpost/)) {
    page.matchPath = '/editpost/*'
    createPage(page)
  }
  if (page.path.match(/^\/previewpost/)) {
    page.matchPath = '/previewpost/*'
    createPage(page)
  }
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const imageKeys = []
  
  // create theming
  const themeInfo = {
    theme: 'light',
    customStyles: JSON.stringify({
      ['background-color']: 'rgba(0, 0, 0. .85)'
    }),
    categories: JSON.stringify([])
  }
  
  const data = {
    key: 'theme-info',
    data: themeInfo
  }
  const nodeContent = JSON.stringify(data)
  const nodeMeta = {
    id: createNodeId(`my-data-${data.key}`),
    parent: null,
    children: [],
    internal: {
      type: `ThemeInfo`,
      mediaType: `json`,
      content: nodeContent,
      contentDigest: createContentDigest(data)
    }
  }
  const node = Object.assign({}, data, nodeMeta)
  createNode(node)

  const query = graphqltag(`
    query listPosts {
      listPosts(limit: 500) {
        items {
          content
          createdAt
          description
          id
          published
          title
          cover_image
        }
      }
    }
  `)
  
  try {
    const graphqlData = await axios({
      url: config.aws_appsync_graphqlEndpoint,
      method: 'post',
      headers: {
        'x-api-key': APPSYNC_KEY
      },
      data: {
        query: print(query)
      }
    })
    const blogPosts = graphqlData.data.data.listPosts.items
    blogPosts.map(post => {
      const content = post.content
      const contentUrls = content.match(urlRegex());
      if (contentUrls) {
        contentUrls.forEach(url => {
          if(url.includes(bucket)) {
            const key = getImageKey(url)
            const cleanedKey = key.replace(/[{()}]/g, '');
            const keyWithPath = `images/${cleanedKey}`
            imageKeys.push(keyWithPath)
          }
        })
      }
      if (post.cover_image) {
        const key = getImageKey(post.cover_image)
        const cleanedKey = key.replace(/[{()}]/g, '');
        const keyWithPath = `images/${cleanedKey}`
        imageKeys.push(keyWithPath)
      }

    })
      
    const data = {
      key: 'image-keys',
      data: imageKeys
    }
    const nodeContent = JSON.stringify(data)
    const nodeMeta = {
      id: createNodeId(`my-data-${data.key}`),
      parent: null,
      children: [],
      internal: {
        type: `ImageKeys`,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: createContentDigest(data)
      }
    }
    const node = Object.assign({}, data, nodeMeta)
    createNode(node)
  } catch(error) {
    console.log('error creating image keys.. :', error)
  }
}