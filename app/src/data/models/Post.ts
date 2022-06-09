import { associations, Model, Query, RawRecord } from '@nozbe/watermelondb'
import { children, field, text, writer } from '@nozbe/watermelondb/decorators'
import { PostRaw } from '../schemas/post'
import ActionModel from './Action'
import CommentModel from './Comment'

class PostModel extends Model {
  static table = 'posts'

  static associations = associations(
    ['comments', { type: 'has_many', foreignKey: 'post_id' }],
    ['actions', { type: 'has_many', foreignKey: 'post_id' }],
  )

  // @ts-ignore
  _raw!: RawRecord & PostRaw

  @text('title')
  title!: string

  @text('body')
  body?: string

  @field('server_id')
  serverId?: number

  @children('comments')
  comments!: Query<CommentModel>

  @writer
  async delete() {
    await this.markAsDeleted()

    await this.database.get<ActionModel>('actions').create(action => {
      action.post.set(this)
      action.type = 'DELETE_POST'
    })
  }

  @writer
  async addComment(body: string) {
    const comment = await this.database
      .get<CommentModel>('comments')
      .create(comment => {
        comment.post.set(this)
        comment.body = body
      })

    await this.database.get<ActionModel>('actions').create(action => {
      action.post.set(this)
      action.comment.set(comment)
      action.type = 'CREATE_COMMENT'
      action.payload = { body }
    })
  }
}

export default PostModel
