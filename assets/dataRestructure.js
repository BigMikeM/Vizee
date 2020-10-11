// The structure of the data from WHO's website changed, so this script will change it to something
// this app expects. Run from root folder.
const fs = require('fs')
const rawData = require('./data/WHO-COVID-19-global-data.json')

const restructureData = (rawData) => {
  const newObj = {}
  rawData.forEach((countryObj) => {
    if (newObj[countryObj.Country]) {
      newObj[countryObj.Country].push(countryObj)
    } else newObj[countryObj.Country] = [countryObj]
  })
  return newObj
}

const restructured = JSON.stringify(restructureData(rawData))

fs.writeFile('./assets/data/rawData.json', restructured, (err) => {
  if (err) throw err
})
