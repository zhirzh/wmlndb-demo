import { tableSchema } from '@nozbe/watermelondb'

const actionSchema = tableSchema({
  name: 'actions',
  columns: [
    { name: 'post_id', type: 'string', isIndexed: true, isOptional: true },
    { name: 'comment_id', type: 'string', isIndexed: true, isOptional: true },
    { name: 'type', type: 'string' },
    { name: 'payload', type: 'string', isOptional: true },
  ],
})

export type ActionRaw = {
  post_id?: string
  comment_id?: string
  type: string
  payload?: string
}

export default actionSchema
