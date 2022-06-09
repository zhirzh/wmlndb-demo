import withObservables from '@nozbe/with-observables'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CommentModel from '../data/models/Comment'

type Props = {
  comment: CommentModel
}

const Comment = ({ comment }: Props) => (
  <View style={styles.comment}>
    <Text>{comment.body}</Text>
  </View>
)

const styles = StyleSheet.create({
  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
})

const withModels = withObservables(['comment'], ({ comment }: Props) => ({
  comment: comment.observe(),
}))

export default withModels(Comment)
