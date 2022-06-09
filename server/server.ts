import express from 'express'
import { readFileSync } from 'fs'
import { Comment, Database, Dump, Post } from './data/typings'
import {
  addComment,
  addPost,
  CommentPayload,
  deletePost,
  PostPayload,
} from './helpers'

const port = 3000

const db = JSON.parse(readFileSync('./data/db.json', 'utf8')) as Database

const server = express()

server
  .set('etag', false)
  .use(express.json())
  .use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
  })

type ApiError = { error: string }

server.get('/', (_req, res) => {
  res.send('HELLO WORLD')
})

server.post<void, Post, PostPayload>('/posts', (req, res) => {
  const postPayload = req.body

  const post = addPost(db, postPayload)

  res.json(post)
})

server.delete<{ postId: number }, Post | ApiError, PostPayload>(
  '/posts/:postId',
  (req, res) => {
    const { postId } = req.params

    if (
      !db.posts[
        // @ts-ignore
        postId.toString()
      ]
    ) {
      res.status(404).send({ error: 'Post not found' })
      return
    }

    const post = deletePost(db, postId)

    res.json(post)
  },
)

server.post<{ postId: number }, Comment | ApiError, CommentPayload>(
  '/posts/:postId/comments',
  (req, res) => {
    const { postId } = req.params
    const commentPayload = req.body

    if (!db.posts[postId]) {
      res.status(404).send({ error: 'Post not found' })
      return
    }

    const comment = addComment(db, postId, commentPayload)

    res.json(comment)
  },
)

server.get<void, Dump>('/dump', (_req, res) => {
  res.json({
    posts: Object.values(db.posts),
    comments: Object.values(db.comments),
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log('SERVER @ port')
})
