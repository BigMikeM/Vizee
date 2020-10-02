import React, { useMemo, useEffect, useState } from 'react'
import * as d3 from 'd3'
import Svg, { G, Path, Circle } from 'react-native-svg'
import { View, StyleSheet } from 'react-native'
import { COUNTRIES } from '../assets/CountryShapes'

const Map = (props) => {
  const [countryList, setCountryList] = useState([])
  const { dimensions } = props

  // The below will determine whether to keep the map constrained to half the height or half the
  // width of the phone screen
  // useMemo will allow us to only do this when something changes, rather than every render
  const mapSizeConstraint = useMemo(() => {
    return dimensions.width > dimensions.height / 2
      ? dimensions.height / 2
      : dimensions.width
  }, [dimensions])

  const countryPaths = useMemo(() => {
    const projection = d3
      .geoAzimuthalEqualArea()

      // Rotate the map to the south pole
      .rotate([0, 90])

      // Remove some extra parts of the map away from the center
      .clipAngle(150)

      // Scale the map to the screen size
      .fitSize([mapSizeConstraint, mapSizeConstraint], {
        type: 'FeatureCollection',
        features: COUNTRIES
      })

      // Move ('translate') the map to the center of the screen space
      .translate([dimensions.width / 2, mapSizeConstraint / 2])

    // Create a 'geoPath' for the SVG
    const geoPath = d3.geoPath().projection(projection)
    // And now create the SVG path for every country
    const svgPaths = COUNTRIES.map(geoPath)

    return svgPaths
  }, [dimensions])

  useEffect(() => {
    setCountryList(
      countryPaths.map((path, index) => {
        return (
          <Path
            key={COUNTRIES[index].properties.name}
            d={path}
            stroke={'#aaa'}
            strokeOpacity={0.3}
            strokeWidth={0.6}
            fill={'#aaa'}
            opacity={0.4}
          />
        )
      })
    )
  }, [])

  return (
    <View style={styles.map}>
      <Svg width={dimensions.width} height={dimensions.height / 2}>
        <G>
          <Circle
            cx={dimensions.width / 2}
            cy={mapSizeConstraint / 2}
            r={mapSizeConstraint / 2}
            fill={'#3b454f'}
          />
          {countryList.map((x) => x)}
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Map
