import React, { useMemo, useEffect, useState } from 'react'
import * as d3 from 'd3'
import Svg, { G, Path, Circle } from 'react-native-svg'
import { View, StyleSheet } from 'react-native'
import { COUNTRIES } from '../assets/CountryShapes'

const CovidMap = (props) => {
  const [countryList, setCountryList] = useState([])
  const { dimensions, data, date, colorScale, stat } = props
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

      // Rotate the globe to euro-centric
      .rotate([-15, -30])

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
        // This will wind up building a lot of logic we can use for conditional rendering later on
        const currentCountry = COUNTRIES[index].properties.name
        // Determine the current country exists in the covid data
        const findCountry = data.some(
          (country) => country.name === currentCountry
        )
        // Retrieve data for it or return null if not found
        const currentCountryData = findCountry
          ? data.find((country) => country.name === currentCountry)['data']
          : null
        // Make sure the dates match or return false
        const hasData = findCountry
          ? currentCountryData.some((data) => data.Date_reported === date)
          : false
        // get the date index from the data
        const dateIdx = hasData
          ? currentCountryData.findIndex((x) => x.Date_reported === date)
          : null

        return (
          <Path
            key={currentCountry}
            d={path}
            stroke={'#aaa'}
            strokeOpacity={0.3}
            strokeWidth={0.6}
            fill={
              // Check whether there is data and , if so, generate colors for it
              hasData ? colorScale(currentCountryData[dateIdx][stat]) : '#aaa'
            }
            // If data exists, make this opaque. Otherwise, leave it translucent
            opacity={hasData ? 1 : 0.4}
          />
        )
      })
    )
  }, [])

  console.log(countryList)
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

export default CovidMap
