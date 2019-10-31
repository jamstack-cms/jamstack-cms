const path = require('path')
const config = require('./jamstack-config.js')

let APPSYNC_KEY
if(process.env.APPSYNC_KEY) {
  APPSYNC_KEY = process.env.APPSYNC_KEY
} else {
  const JSConfig = require('./jamstack-api-key.js')
  APPSYNC_KEY = JSConfig['aws_appsync_apiKey']
}

module.exports = {
  siteMetadata: {
    title: `JAMstack CMS`,
    author: `Nader Dabit`,
    description: `The full stack CMS built for the modern age.`,
    siteUrl: `https://github.com/jamstack-cms`,
    social: {
      twitter: `dabit3`,
    },
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(`./src/layouts/baseLayout.js`),
      },
    },
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        custom: {
          families: ["EB Garamond"],
          urls: ["/fonts/fonts.css"],
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "Blog",
        fieldName: "appsync",
        url: config.aws_appsync_graphqlEndpoint,
        headers: {
          'x-api-key': APPSYNC_KEY
        }
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `JAMstack CMS`,
        short_name: `JAMstack CMS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/jamstack-cms.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
