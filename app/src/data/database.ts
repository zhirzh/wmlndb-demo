import { appSchema, Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import ActionModel from './models/Action'
import CommentModel from './models/Comment'
import PostModel from './models/Post'
import actionSchema from './schemas/action'
import commentSchema from './schemas/comment'
import postSchema from './schemas/post'

const version = 1

const schema = appSchema({
  version,
  tables: [actionSchema, commentSchema, postSchema],
})

const adapter = new SQLiteAdapter({
  schema,
})

const database = new Database({
  adapter,
  modelClasses: [ActionModel, CommentModel, PostModel],
})

export default database
