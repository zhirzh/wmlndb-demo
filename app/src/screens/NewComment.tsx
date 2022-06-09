import { Database } from '@nozbe/watermelondb'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Route, useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Button from '../components/Button'
import PostModel from '../data/models/Post'

type Props = {
  route: Route<string, { postId: string }>
  database: Database
  post: PostModel
}

const NewComment = ({ post }: Props) => {
  const navigation = useNavigation()

  const [body, setBody] = React.useState('')

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{post.title}</Text>

      <Text>Comment</Text>
      <TextInput
        multiline
        value={body}
        style={[styles.input, styles.body]}
        onChangeText={setBody}
      />

      <Button
        title="Save"
        style={styles.save}
        onPress={async () => {
          await post.addComment(body)

          navigation.goBack()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  body: {
    height: 105,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  save: {
    marginTop: 20,
  },
})

const withModels = withObservables(['route'], ({ database, route }: Props) => {
  const { postId } = route.params

  return {
    post: database.get<PostModel>('posts').findAndObserve(postId),
  }
})

export default withDatabase(withModels(NewComment))
