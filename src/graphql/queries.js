/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getComment = `query GetComment($id: ID!) {
  getComment(id: $id) {
    id
    message
    createdBy
    createdAt
  }
}
`;
export const listComments = `query ListComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      message
      createdBy
      createdAt
    }
    nextToken
  }
}
`;
export const getPreview = `query GetPreview($id: ID!) {
  getPreview(id: $id) {
    id
    title
    description
    content
    cover_image
    createdAt
    categories
  }
}
`;
export const listPreviews = `query ListPreviews(
  $filter: ModelPreviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listPreviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      content
      cover_image
      createdAt
      categories
    }
    nextToken
  }
}
`;
export const getPost = `query GetPost($id: ID!) {
  getPost(id: $id) {
    id
    title
    description
    content
    cover_image
    createdAt
    published
    previewEnabled
    categories
    contentType
    author {
      id
      name
      username
      avatarUrl
      owner
    }
  }
}
`;
export const listPosts = `query ListPosts(
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      content
      cover_image
      createdAt
      published
      previewEnabled
      categories
      contentType
      author {
        id
        name
        username
        avatarUrl
        owner
      }
    }
    nextToken
  }
}
`;
export const itemsByContentType = `query ItemsByContentType(
  $contentType: String
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  itemsByContentType(
    contentType: $contentType
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      description
      content
      cover_image
      createdAt
      published
      previewEnabled
      categories
      contentType
      author {
        id
        name
        username
        avatarUrl
        owner
      }
    }
    nextToken
  }
}
`;
export const getSettings = `query GetSettings($id: ID!) {
  getSettings(id: $id) {
    id
    categories
    adminGroups
    theme
    border
    borderWidth
    description
  }
}
`;
export const listSettingss = `query ListSettingss(
  $filter: ModelSettingsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSettingss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      categories
      adminGroups
      theme
      border
      borderWidth
      description
    }
    nextToken
  }
}
`;
export const getPage = `query GetPage($id: ID!) {
  getPage(id: $id) {
    id
    name
    slug
    content
    components
    published
  }
}
`;
export const listPages = `query ListPages(
  $filter: ModelPageFilterInput
  $limit: Int
  $nextToken: String
) {
  listPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      slug
      content
      components
      published
    }
    nextToken
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      username
      avatarUrl
      owner
    }
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    username
    avatarUrl
    owner
  }
}
`;
