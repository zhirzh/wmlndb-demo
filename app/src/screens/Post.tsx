import { Database } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Route, useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { switchMap } from 'rxjs'
import Button from '../components/Button'
import Comment from '../components/Comment'
import CommentModel from '../data/models/Comment'
import PostModel from '../data/models/Post'

type Props = {
  route: Route<string, { postId: string }>
  database: Database
  post: PostModel
  comments: CommentModel[]
}

const Post = ({ post, comments }: Props) => {
  const navigation = useNavigation()

  const Header = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>

        <TouchableOpacity
          onPress={async () => {
            await post.delete()

            navigation.goBack()
          }}
        >
          <Text style={styles.delete}>DELETE</Text>
        </TouchableOpacity>
      </View>

      {!!post.body && <Text style={styles.body}>{post.body}</Text>}

      <Text style={styles.commentsCount}>Comments ({comments.length})</Text>
    </>
  )

  return (
    <View style={styles.screen}>
      <FlatList
        data={comments.slice().reverse()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={Header}
        renderItem={({ item: comment }) => (
          <Comment key={comment.id} comment={comment} />
        )}
      />

      <Button
        title="Add comment"
        style={styles.addComment}
        onPress={() => {
          navigation.navigate('NewComment', { postId: post.id })
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  delete: {
    color: '#f84',
  },
  body: {
    marginTop: 15,
    lineHeight: 20,
  },
  commentsCount: {
    marginTop: 30,
  },
  list: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addComment: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
})

const withModels = withObservables(['route'], ({ database, route }: Props) => {
  const { postId } = route.params

  const post$ = database.get<PostModel>('posts').findAndObserve(postId)

  return {
    post: post$,
    comments: post$.pipe(switchMap(post => post.comments.observe())),
  }
})

export default withDatabase(withModels(Post))
