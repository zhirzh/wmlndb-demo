import { Model, Q } from '@nozbe/watermelondb'
import { fetchChildren } from '@nozbe/watermelondb/Model/helpers'
import { createCommentApi, createPostApi, deletePostApi } from './apis'
import database from './data/database'
import ActionModel, { SyncAction } from './data/models/Action'

const syncAction = async (action: SyncAction) => {
  const updates: Model[] = []

  switch (action.type) {
    case 'CREATE_POST': {
      const serverPost = await createPostApi(action.payload)

      const post = (await action.post.fetch())!

      updates.push(
        post.prepareUpdate(p => {
          p.title = serverPost.title
          p.body = serverPost.body
          p.serverId = serverPost.id
        }),
      )

      break
    }

    case 'DELETE_POST': {
      const post = (await action.post.fetch())!

      await deletePostApi(post.serverId!)

      const children = await fetchChildren(post)
      children
        .filter(
          child => !(child instanceof ActionModel && child.id === action.id),
        )
        .forEach(child => {
          updates.push(child.prepareDestroyPermanently())
        })

      updates.push(post.prepareDestroyPermanently())

      break
    }

    case 'CREATE_COMMENT': {
      const post = (await action.post.fetch())!
      const comment = (await action.comment.fetch())!

      const serverComment = await createCommentApi(
        post.serverId!,
        action.payload,
      )

      updates.push(
        comment.prepareUpdate(c => {
          c.body = serverComment.body
          c.serverId = serverComment.id
        }),
      )

      break
    }
  }

  updates.push(action.prepareDestroyPermanently())

  await database.write(async () => {
    await database.batch(...updates)
  })
}

const sync = async () => {
  const Actions = database.collections.get<ActionModel>('actions')
  console.log('[sync]', await Actions.query().fetchCount())

  const actions = await Actions.query(Q.take(1)).fetch()
  const action = actions[0]

  if (action) {
    await syncAction(action as SyncAction)
  }
}

const triggerSync = () => {
  sync()

  setTimeout(triggerSync, 10 * 1000)
}

export { triggerSync }

export default sync
