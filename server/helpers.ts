import { Comment, Database, Post } from './data/typings'

export type CommentPayload = {
  body: string
}

export const addComment = (
  db: Database,
  postId: number,
  commentPayload: CommentPayload,
) => {
  const id = 1 + Object.keys(db.comments).length

  const now = Date.now()

  const comment: Comment = {
    id,
    post_id: postId,
    body: id + '\n' + commentPayload.body,
    created_at: now,
    updated_at: now,
  }

  db.comments[id] = comment

  return comment
}

export type PostPayload = {
  title: string
  body: string
  comments?: string[]
}

export const addPost = (db: Database, postPayload: PostPayload) => {
  const id = 1 + Object.keys(db.posts).length

  const now = Date.now()

  const post: Post = {
    id,
    title: postPayload.title.toUpperCase() + '!',
    body: id + '\n' + postPayload.body,
    created_at: now,
    updated_at: now,
  }

  db.posts[id] = post

  return post
}

export const deletePost = (db: Database, id: number) => {
  const post = db.posts[id]

  delete db.posts[id]

  return post
}
