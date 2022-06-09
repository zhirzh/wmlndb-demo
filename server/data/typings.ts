export type Post = {
  id: number
  title: string
  body: string
  created_at: number
  updated_at: number
}

export type Comment = {
  id: number
  post_id: any
  body: string
  created_at: number
  updated_at: number
}

export type Database = {
  posts: Record<number, Post>
  comments: Record<number, Comment>
}

export type Dump = {
  posts: Post[]
  comments: Comment[]
}
