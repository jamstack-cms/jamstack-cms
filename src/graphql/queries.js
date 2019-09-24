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
export const getSettings = `query GetSettings($id: ID!) {
  getSettings(id: $id) {
    id
    mode
    categories
    adminGroups
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
      mode
      categories
      adminGroups
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
    }
    nextToken
  }
}
`;
