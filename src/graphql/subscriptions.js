/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = `subscription OnCreatePost {
  onCreatePost {
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
export const onUpdatePost = `subscription OnUpdatePost {
  onUpdatePost {
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
export const onDeletePost = `subscription OnDeletePost {
  onDeletePost {
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
export const onCreateComment = `subscription OnCreateComment($createdBy: String) {
  onCreateComment(createdBy: $createdBy) {
    id
    message
    createdBy
    createdAt
  }
}
`;
export const onUpdateComment = `subscription OnUpdateComment($createdBy: String) {
  onUpdateComment(createdBy: $createdBy) {
    id
    message
    createdBy
    createdAt
  }
}
`;
export const onDeleteComment = `subscription OnDeleteComment($createdBy: String) {
  onDeleteComment(createdBy: $createdBy) {
    id
    message
    createdBy
    createdAt
  }
}
`;
export const onCreateSettings = `subscription OnCreateSettings {
  onCreateSettings {
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
export const onUpdateSettings = `subscription OnUpdateSettings {
  onUpdateSettings {
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
export const onDeleteSettings = `subscription OnDeleteSettings {
  onDeleteSettings {
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
export const onCreatePreview = `subscription OnCreatePreview {
  onCreatePreview {
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
export const onUpdatePreview = `subscription OnUpdatePreview {
  onUpdatePreview {
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
export const onDeletePreview = `subscription OnDeletePreview {
  onDeletePreview {
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
export const onCreateUser = `subscription OnCreateUser($owner: String) {
  onCreateUser(owner: $owner) {
    id
    name
    username
    avatarUrl
    owner
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser($owner: String) {
  onUpdateUser(owner: $owner) {
    id
    name
    username
    avatarUrl
    owner
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser($owner: String) {
  onDeleteUser(owner: $owner) {
    id
    name
    username
    avatarUrl
    owner
  }
}
`;
