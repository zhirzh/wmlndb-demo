import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Button from '../components/Button'
import ActionModel from '../data/models/Action'
import PostModel from '../data/models/Post'

const NewPost = () => {
  const navigation = useNavigation()

  const database = useDatabase()

  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        style={[styles.input, styles.title]}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Body</Text>
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
          await database.write(async () => {
            const post = await database.get<PostModel>('posts').create(post => {
              post.title = title
              post.body = body
            })

            await database.get<ActionModel>('actions').create(action => {
              action.post.set(post)
              action.type = 'CREATE_POST'
              action.payload = { title, body }
            })
          })

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
  input: {
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 15,
    fontWeight: '500',
  },
  body: {
    height: 105,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  label: {
    color: '#888',
  },
  save: {
    marginTop: 20,
  },
})

export default NewPost
