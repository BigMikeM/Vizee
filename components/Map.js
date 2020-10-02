import React, { useMemo } from 'react'
import * as d3 from 'd3'
import Svg, { G, Path, Circle } from 'react-native-svg'
import { Text, View, StyleSheet } from 'react-native'
import { COUNTRIES } from '../assets/CountryShapes'

const { dimensions } = props

// The below will determine whether to keep the map constrained to half the height or half the width of the phone screen
// useMemo will allow us to only do this when something changes, rather than every render
const mapSizeConstraint = useMemo(() => {
  return dimensions.width > dimensions.height / 2
    ? dimensions.height / 2
    : dimensions.width
}, [dimensions])

const Map = (props) => {
  return (
    <View>
      <Text>I'm the map, I'm the map, I'm the map!</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Map
