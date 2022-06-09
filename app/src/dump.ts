import { Model, Q } from '@nozbe/watermelondb'
import { downloadDumpApi } from './apis'
import database from './data/database'
import CommentModel from './data/models/Comment'
import PostModel from './data/models/Post'

const dump = async () => {
  const Posts = database.get<PostModel>('posts')
  const Comments = database.get<CommentModel>('comments')

  const { posts, comments } = await downloadDumpApi()

  const inserts: Model[] = []

  const postIds = posts.map(post => post.id)
  const existingPosts = await Posts.query(
    Q.where('server_id', Q.oneOf(postIds)),
  ).fetch()
  const existingPostIds = existingPosts.map(post => post.serverId)

  posts
    .filter(post => !existingPostIds.includes(post.id))
    .forEach(post => {
      inserts.push(
        Posts.prepareCreate(p => {
          p._raw.id = post.id.toString()
          p.title = post.title
          p.body = post.body
          p.serverId = post.id
        }),
      )
    })

  const commentIds = comments.map(comment => comment.id)
  const existingComments = await Comments.query(
    Q.where('server_id', Q.oneOf(commentIds)),
  ).fetch()
  const existingCommentIds = existingComments.map(comment => comment.serverId)

  comments
    .filter(comment => !existingCommentIds.includes(comment.id))
    .forEach(comment => {
      inserts.push(
        Comments.prepareCreate(c => {
          c._raw.id = comment.id.toString()
          c.postId = comment.post_id.toString()
          c.body = comment.body
          c.serverId = comment.id
        }),
      )
    })

  await database.write(async () => {
    await database.batch(...inserts)
  })
}

export default dump
