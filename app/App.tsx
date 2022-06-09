import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import database from './src/data/database'
import dump from './src/dump'
import NewComment from './src/screens/NewComment'
import NewPost from './src/screens/NewPost'
import Post from './src/screens/Post'
import Root from './src/screens/Root'
import sync, { triggerSync } from './src/sync'

triggerSync()

dump()

const Stack = createStackNavigator()

const App = () => (
  <DatabaseProvider database={database}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Root}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  sync()
                }}
              >
                <Text style={styles.sync}>SYNC</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="NewPost" component={NewPost} />
        <Stack.Screen name="NewComment" component={NewComment} />
      </Stack.Navigator>
    </NavigationContainer>
  </DatabaseProvider>
)

const styles = StyleSheet.create({
  sync: {
    color: '#0af',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
})

export default App
