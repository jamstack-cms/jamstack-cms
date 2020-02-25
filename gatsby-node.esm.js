const { slugify } = require('./src/utils/helpers')
import fs from 'fs'
import urlRegex from 'url-regex'
import Amplify, { Storage } from 'aws-amplify'
import getImageKey from './src/utils/getImageKey'
import getRawPath from './src/utils/getRawPath'
import downloadImage from './src/utils/downloadImage'
import config from './jamstack-config'
import { getSettings } from './src/graphql/queries'

const blogPost = require.resolve(`./src/templates/blog-post.js`)
const heroPage = require.resolve(`./src/templates/hero-page.js`)

let APPSYNC_KEY
if(process.env.APPSYNC_KEY) {
  APPSYNC_KEY = process.env.APPSYNC_KEY
} else {
  const JSConfig = require('./jamstack-api-key.js')
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
      itemsByContentType(limit: 500, contentType: "Post") {
        items {
          content
          createdAt
          description
          id
          published
          title
          cover_image
          author {
            username
            avatarUrl
          }
        }
      }
    }
  }`)

  const pageData = await graphql(` {
    appsync {
      listPages(limit: 500) {
        items {
         id
          name
          slug
          content
          components
          published
        }
      }
    }
  }`)
  const webPages = pageData.data.appsync.listPages.items.filter(page => page.published)
  const blogPosts = postData.data.appsync.itemsByContentType.items.filter(post => post.published)
  const images = await Storage.list('images/')
  const imageKeys = images.map(i => i.key)

  // create web pages
  await Promise.all(
    webPages.map(async(page, index) => {
      if (!page) return
      if (!fs.existsSync(`${__dirname}/public/downloads`)){
        fs.mkdirSync(`${__dirname}/public/downloads`);
      }
      const content = page.content
      const contentUrls = content.match(urlRegex())
      let images = []
      if (contentUrls) {
        contentUrls.forEach(url => {
          if(url.includes(bucket)) {
            const key = getImageKey(url)
            const keyWithPath = `images/${key}`
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
      signedUrls.forEach(url => rawPaths.push(`${getRawPath(url)}`))
      // create array of images with signed paths so we can download them in the next step
      signedUrls.forEach(signedUrl => pathsToDownload.push(downloadImage(signedUrl)))

      if (pathsToDownload.length) {
        // if there are any images, we download them to the local file system
        try {
          await Promise.all(pathsToDownload)
        } catch (err) {
          console.log('error downloading images to file system...', err)
        }
      }

      let updatedContent = content.replace(urlRegex(), (url) => {
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

      page['content'] = updatedContent

      const previous = index === webPages.length - 1 ? null : webPages[index + 1].node
      const next = index === 0 ? null : webPages[index - 1]

      createPage({
        path: page.slug,
        component: heroPage,
        context: {
          id: page.id,
          content: page.content,
          title: page.title,
          published: page.published,
          createdAt: page.createdAt,
          slug: page.slug,
          type: "appsyncData",
          previous,
          next,
        },
      })

    })
  )

  // create blog post pages
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

      let updatedContent = content.replace(urlRegex(), (url) => {
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

      if (post.author.avatarUrl) {
        const image = post.author.avatarUrl
        const signedImage = await Storage.get(image)
        await downloadImage(signedImage)
        const key = getImageKey(image)
        post['authorAvatar'] = `../downloads/${key}`
      }
      
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
          author: post.author.username,
          authorAvatar: post.authorAvatar ? post.authorAvatar : null,
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
  if (page.path.match(/^\/editpage/)) {
    page.matchPath = '/editpage/*'
    createPage(page)
  }
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const imageKeys = []
  let authorImages = []
  
  const getSettingsData = await axios({
    url: config.aws_appsync_graphqlEndpoint,
    method: 'post',
    headers: {
      'x-api-key': APPSYNC_KEY
    },
    data: {
      query: print(graphqltag(getSettings)),
      variables: { id: 'jamstack-cms-theme-info' }
    }
  })

  const { theme, categories, adminGroups, border, borderWidth, description } = getSettingsData.data.data.getSettings ? getSettingsData.data.data.getSettings : {}

  const themeInfo = {
    theme: theme || 'light',
    categories: categories || 'none',
    adminGroups: adminGroups || 'none',
    borderWidth: borderWidth || 'none',
    border: border || 'none',
    description: description || 'none'
  }

  const data = {
    key: 'theme-info',
    data: themeInfo
  }
  const nodeMeta = {
    id: createNodeId(`my-data-${data.key}`),
    parent: null,
    children: [],
    internal: {
      type: `ThemeInfo`,
      contentDigest: createContentDigest(data)
    }
  }
  const node = Object.assign({}, data, nodeMeta)
  createNode(node)

  const listPostsQuery = graphqltag(`
    query itemsByContentType {
      itemsByContentType(limit: 500, contentType: "Post") {
        items {
          content
          createdAt
          description
          id
          published
          title
          cover_image
          author {
            avatarUrl
          }
        }
      }
    }
  `)

  const listPagesQuery = graphqltag(`
    query listPages {
      listPages(limit: 500) {
        items {
          id
          name
          slug
          content
          components
          published
        }
      }
    }
  `)

  try {
    // create page slugs for page creation
    const listPagesData = await axios({
      url: config.aws_appsync_graphqlEndpoint,
      method: 'post',
      headers: {
        'x-api-key': APPSYNC_KEY
      },
      data: {
        query: print(listPagesQuery)
      }
    })
    let pages = listPagesData.data.data.listPages.items
    pages = pages.filter(page => page.published)
    const slugs = pages.map(page => page.slug)

    const slugData = {
      key: 'page-slugs',
      data: slugs.length ? slugs : 'none'
    }
    const slugNodeMeta = {
      id: createNodeId(`my-data-${slugData.key}`),
      parent: null,
      children: [],
      internal: {
        type: `Slugs`,
        contentDigest: createContentDigest(slugData)
      }
    }
    const slugNode = Object.assign({}, slugData, slugNodeMeta)
    createNode(slugNode)
  } catch (err) {
    console.log('error fetching data..:', err)
  }
  
  try {
    const listPostsData = await axios({
      url: config.aws_appsync_graphqlEndpoint,
      method: 'post',
      headers: {
        'x-api-key': APPSYNC_KEY
      },
      data: {
        query: print(listPostsQuery)
      }
    })
    const blogPosts = listPostsData.data.data.itemsByContentType.items
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
      if (post.author.avatarUrl) {
        const key = getImageKey(post.author.avatarUrl)
        authorImages.push(key)
      }
    })
    if (authorImages.length) {
      authorImages = [...new Set(authorImages)]
      authorImages = authorImages.map(avatar => `../downloads/${avatar}`)
    }

    // create main image key array for media resources
    const imageData = {
      key: 'image-keys',
      data: imageKeys.length ? imageKeys : 'none'
    }
    const imageNodeMeta = {
      id: createNodeId(`my-data-${imageData.key}`),
      parent: null,
      children: [],
      internal: {
        type: `ImageKeys`,
        contentDigest: createContentDigest(imageData)
      }
    }
    const imageNode = Object.assign({}, imageData, imageNodeMeta)
    createNode(imageNode)

    // create author image array for displaying author avatars
    const authorImageData = {
      key: 'author-images',
      data: authorImages.length ? authorImages : 'none'
    }
    const authorImageNodeMeta = {
      id: createNodeId(`my-data-${authorImageData.key}`),
      parent: null,
      children: [],
      internal: {
        type: `AuthorImages`,
        contentDigest: createContentDigest(authorImageData)
      }
    }
    const authorImageNode = Object.assign({}, authorImageData, authorImageNodeMeta)
    createNode(authorImageNode)
  } catch(error) {
    console.log('error creating image keys.. :', error)
  }
}