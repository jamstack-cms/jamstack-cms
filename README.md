![](jamstackcms.jpg)

# JAMstack CMS

End to end serverless blogging & CMS system. Built with [Gatsby](https://www.gatsbyjs.org/) & [AWS Amplify](https://aws-amplify.github.io/).

### Philosophy

JAMstack CMS is built to give you the ability to deploy a full stack serverless website in just a few minutes. JAMstack includes the following features:

- Authentication & authorization
- Database
- API
- Front end

#### Build time vs run time

With server rendered applications there are typically two types of execution environments, one at build time and one at run time.

The issue with dealing with server rendered applications in the traditional way was that it was not possible to make edits directly in the UI because the build would not accurately represent the current version of the application served at the last build time.

JAMstack CMS solves this issue by giving you two views at run time, including both the static build as well as a dynamic Admin view that allows you to manipulate content and preview pages before building.

This way you have the opportunity to test out new posts and web pages before deploying them to your live environmnet.

### Context

WordPress has dominated for quite some time with estimates that it powers around 30% of all websites today. One of the reasons for the popularity of WordPress is that it is composed of all of the elements needed for such a platform, including these necessary elements:

- Authentication & authorization
- Database
- API
- Front end

While WordPress started as a blogging tool, it has evolved over the years into a powerful website builder and a robust content management system.

With updated tooling on both the front end and the back end we are starting to see the need for similar tooling in our modern stack.

JAMstack CMS fills in this gap by giving you a customizable end to end solution allowing you to get up and running with a full stack serverless website & blog with just a few commands on your command line.

### Features

- Authentication
- Sharable preview links
- Secure, signed images
- Admin panel
- Comments
- Server-side rendering

### Roadmap

- Comments
- Video support
- Dynamic logo from Admin
- Analytics dashboard
- Post categories
- WYSWYG option

### Tools

Here are some of the tools used to build JAMstack CMS:
- Gatsby -
- Emotion - 
- Date FNS - 
- Marked - 
- AWS Amplify -

1. clone
2. jamstack configure (add admin to email) (also can amplify init & amplify push)
3. amplify init & amplify push ?
4. jamstack develop