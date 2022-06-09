import withObservables from '@nozbe/with-observables'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { switchMap } from 'rxjs'
import PostModel from '../data/models/Post'

type Props = {
  title: string
  totalComments: number
  post: PostModel
  onPress: () => void
}

const PostItem = ({ post, totalComments, onPress }: Props) => (
  <TouchableOpacity style={styles.post} onPress={onPress}>
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.count}>{totalComments}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  post: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  count: {
    color: '#888',
  },
})

const withModels = withObservables(['post'], ({ post }: Props) => {
  const post$ = post.observe()

  return {
    post: post$,
    totalComments: post$.pipe(switchMap(post => post.comments.observeCount())),
  }
})

export default withModels(PostItem)
