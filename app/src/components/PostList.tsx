import { Database, Q } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import PostModel from '../data/models/Post'
import PostItem from './PostItem'

type Props = {
  database: Database
  search: string
  posts: PostModel[]
}

const PostList = ({ posts }: Props) => {
  const navigation = useNavigation()

  return (
    <>
      <Text style={styles.count}>Posts: {posts.length}</Text>

      <FlatList
        data={posts.slice().reverse()}
        style={styles.list}
        renderItem={({ item: post }) => (
          <PostItem
            key={post.id}
            post={post}
            onPress={() => {
              navigation.navigate('Post', { postId: post.id })
            }}
          />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  count: {
    paddingVertical: 10,
    color: '#888',
    textAlign: 'center',
  },
})

const withModels = withObservables(
  ['search'],
  ({ database, search }: Props) => {
    const query = Q.sanitizeLikeString(search)

    return {
      posts: database
        .get<PostModel>('posts')
        .query(Q.where('title', Q.like(`%${query}%`)))
        .observe(),
    }
  },
)

export default withDatabase(withModels(PostList))
