/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import CovidMap from './components/Map'
import rawCovidData from './assets/data/WHO-COVID-19-global-data.json'
import rollingAverage from './assets/RollingAverage'
import * as d3 from 'd3'

const App = () => {
  const [stat, setStat] = useState('avg_confirmed')
  const [date, setDate] = useState('2020-10-01')
  const windowSize = Dimensions.get('window')

  // The useMemo hook is useful here because we don't want all this calculation
  // happening on every render, just when the values change.
  const covidData = useMemo(() => {
    // This will transform our data in to an array of objects (Object.keys returns an array)
    const countryArray = Object.keys(rawCovidData).map((country) => ({
      name: country,
      data: rawCovidData[country]
    }))
    // For now, the windowSize is hardcoded (more work on dynamically changing it later)
    const windowSize = 7
    
    const countriesWithAverage = countryArray.map((country) => ({
      name: country.name,
      data: [...rollingAverage(country.data, windowSize)]
    }))
    // This one will narrow down our list of countries to one _above_ a specified amount of
    // daily cases (here set to 10 per day). The filter function will use findIndex to 
    // determine if anything matches our criteria (d[stat] >= 10) and return the index or
    // a negative 1 to show it wasn't found. We don't want anything that comes back `-1`
    const filteredCountries = countriesWithAverage.filter(
      (country) => country.data.findIndex((d, _) => d[stat] >= 10) != -1
    )

    return filteredCountries
  }, [])

  return (
    <View style={styles.container}>
      <CovidMap dimensions={windowSize} />
    </View>
  )
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
