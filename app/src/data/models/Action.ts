import { associations, Model, RawRecord, Relation } from '@nozbe/watermelondb'
import { field, immutableRelation, json } from '@nozbe/watermelondb/decorators'
import { identity } from 'rxjs'
import { CommentPayload, PostPayload } from '../../apis'
import { ActionRaw } from '../schemas/action'
import CommentModel from './Comment'
import PostModel from './Post'

export type ActionType = 'CREATE_POST' | 'DELETE_POST' | 'CREATE_COMMENT'

export type SyncAction = Omit<ActionModel, 'payload'> &
  (
    | { type: 'CREATE_POST'; payload: PostPayload }
    | { type: 'DELETE_POST' }
    | { type: 'CREATE_COMMENT'; payload: CommentPayload }
  )

class ActionModel extends Model {
  static table = 'actions'

  static associations = associations(
    ['posts', { type: 'belongs_to', key: 'post_id' }],
    ['comments', { type: 'belongs_to', key: 'comment_id' }],
  )

  // @ts-ignore
  _raw!: RawRecord & ActionRaw

  @field('type')
  type!: ActionType

  @json('payload', identity)
  payload?: any

  @immutableRelation('posts', 'post_id')
  post!: Relation<PostModel>

  @immutableRelation('comments', 'comment_id')
  comment!: Relation<CommentModel>
}

export default ActionModel
