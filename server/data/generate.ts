import { writeFileSync } from 'fs'
import { commentBodies, postBody, postNames } from './randomData'
import { Comment, Database, Post } from './typings'

const db: Database = {
  posts: {},
  comments: {},
}

const fuzzCount = (count: number) => {
  // makes the number randomly a little larger or smaller for fake data to seem more realistic
  const maxFuzz = 4
  const fuzz = Math.round((Math.random() - 0.5) * maxFuzz * 2)
  return count + fuzz
}

const doTimes = (count: number, fn: (i: number) => void) =>
  Array.from({ length: count }, (_, i) => fn(i))

const makePosts = () => {
  doTimes(fuzzCount(10), i => {
    const id = 1 + Object.keys(db.posts).length

    const now = Date.now()

    const post: Post = {
      id,
      title: postNames[i] || `Post#${id}`,
      body: postBody,
      created_at: now,
      updated_at: now,
    }

    db.posts[post.id] = post

    makeComments(post)
  })
}

const makeComments = (post: Post) => {
  doTimes(fuzzCount(5), i => {
    const id = 1 + Object.keys(db.comments).length

    const now = Date.now()

    const comment: Comment = {
      id,
      post_id: post.id,
      body: commentBodies[i] || `Comment#${id}`,
      created_at: now,
      updated_at: now,
    }

    db.comments[comment.id] = comment
  })
}

const generate = () => {
  makePosts()
}

generate()
writeFileSync('./db.json', JSON.stringify(db, null, 2))
