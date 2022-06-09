const server = 'localhost:3000'

type ApiOptions = {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: any
}

const api = <T>(url: RequestInfo, { method, body }: ApiOptions = {}) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  }).then(res => res.json() as Promise<T>)

export type PostPayload = {
  title: string
  body: string
  comments?: string[]
}

type ServerPost = {
  id: number
  title: string
  body: string
  created_at: number
  updated_at: number
}

const createPostApi = (postPayload: PostPayload) => {
  return api<ServerPost>(`http://${server}/posts`, {
    method: 'POST',
    body: postPayload,
  })
}

const deletePostApi = (postId: number) => {
  return api<number>(`http://${server}/posts/${postId}`, {
    method: 'DELETE',
  })
}

export type CommentPayload = {
  body: string
}

type ServerComment = {
  id: number
  post_id: number
  body: string
  created_at: number
  updated_at: number
}

const createCommentApi = (postId: number, commentPayload: CommentPayload) => {
  return api<ServerComment>(`http://${server}/posts/${postId}/comments`, {
    method: 'POST',
    body: commentPayload,
  })
}

const downloadDumpApi = () => {
  type Dump = {
    posts: ServerPost[]
    comments: ServerComment[]
  }

  return api<Dump>(`http://${server}/dump`)
}

export { createPostApi, deletePostApi, createCommentApi, downloadDumpApi }
