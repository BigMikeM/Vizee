/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import CovidMap from './components/Map'

class App extends Component {
  state = {
    count: 0
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    const windowSize = Dimensions.get('window')
    return (
      <View style={styles.container}>
        <CovidMap dimensions={windowSize} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#323b44'
  },
  text: {
    color: '#E59500'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#840032',
    padding: 10,
    marginBottom: 10
  }
})

export default App
