import { tableSchema } from '@nozbe/watermelondb'

const postSchema = tableSchema({
  name: 'posts',
  columns: [
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string', isOptional: true },
    { name: 'server_id', type: 'number', isOptional: true },
  ],
})

export type PostRaw = {
  title: string
  body: string
  server_id?: number
}

export default postSchema
