import React, { useMemo, useEffect, useState } from 'react'
import * as d3 from 'd3'
import Svg, { G, Path, Circle } from 'react-native-svg'
import { View, StyleSheet } from 'react-native'
import { COUNTRIES } from '../assets/CountryShapes'
import {
  PanGestureHandler,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler'

const CovidMap = (props) => {
  const [countryList, setCountryList] = useState([])
  const { dimensions, data, date, colorScale, stat } = props
  // The following states are for pinch-zoom scaling effects.
  const [transX, setTransX] = useState(0)
  const [transY, setTransY] = useState(0)
  const [scale, setScale] = useState(1)
  const [prevScale, setPrevScale] = useState(1)
  const [lastScaleOffset, setLastScaleOffset] = useState(0)
  // And these last two useStates are for panning
  const [lastTransX, setLastTransX] = useState(0)
  const [lastTransY, setLastTransY] = useState(0)

  const panStateHandler = (e) => {
    if (e.nativeEvent.oldState === State.UNDETERMINED) {
    console.log(State.UNDETERMINED)
      setLastTransX(transX)
      setLastTransY(transY)
    }
  }

  const pinchStateHandler = (e) => {
    if (e.nativeEvent.oldState === State.UNDETERMINED) {
      setLastScaleOffset(-1 + scale)
    }
  }

  const panGestureHandler = (e) => {
    setTransX(-e.nativeEvent.translationX / scale + lastTransX)
    setTransY(-e.nativeEvent.translationY / scale + lastTransY)
  }

  const pinchGestureHandler = (e) => {
    if (
      e.nativeEvent.scale + lastScaleOffset >= 1 &&
      e.nativeEvent.scale + lastScaleOffset <= 5
    ) {
      setPrevScale(scale)
      setScale(e.nativeEvent.scale + lastScaleOffset)
      setTransX(
        transX -
          (e.nativeEvent.focalX / scale - e.nativeEvent.focalX / prevScale)
      )
      setTransY(
        transY -
          (e.nativeEvent.focalY / scale - e.nativeEvent.focalY / prevScale)
      )
    }
  }

  const mapSizeConstraint = useMemo(() => {
    return dimensions.width > dimensions.height / 2
      ? dimensions.height / 2
      : dimensions.width
  }, [dimensions])

  const countryPaths = useMemo(() => {
    const clipAngle = 100
    const projection = d3
      .geoAzimuthalEqualArea()
      .rotate([-15, -30]) // Rotate the globe to euro-centric
      .clipAngle(clipAngle) // Remove some extra parts of the map away from the center
      .fitSize([mapSizeConstraint, mapSizeConstraint], {
        // Scale the map to the screen size
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
        // Parse that data!
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

  return (
    <View style={styles.map}>
      <PanGestureHandler
        onGestureEvent={(e) => panGestureHandler(e)}
        onHandlerStateChange={(e) => panStateHandler(e)}
      >
        <PinchGestureHandler
          onGestureEvent={(e) => pinchGestureHandler(e)}
          onHandlerStateChange={(e) => pinchStateHandler(e)}
        >
          <Svg width={dimensions.width} height={dimensions.height / 2}>
            <G transform={`scale(${scale}) translate(${-transX},${-transY})`}>
              <Circle
                cx={dimensions.width / 2}
                cy={mapSizeConstraint / 2}
                r={mapSizeConstraint / 2}
                fill={'#3b454f'}
              />
              {countryList.map((x) => x)}
            </G>
          </Svg>
        </PinchGestureHandler>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({})

export default CovidMap
