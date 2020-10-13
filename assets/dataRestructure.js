// This node script will convert CSV to JSON, restructure the data, and remove anything before June.
// Run from root folder.
const fs = require('fs')
const CSVToJSON = require('csvtojson')

const restructureData = (data) => {
  const newObj = {}
  data.forEach((countryObj) => {
    if (++countryObj.Date_reported.split('-')[1] > 6) {
      if (newObj[countryObj.Country]) {
        newObj[countryObj.Country].push(countryObj)
      } else newObj[countryObj.Country] = [countryObj]
    }
  })
  return newObj
}

;(async () => {
  try {
    const rawDataJSON = await CSVToJSON().fromFile(
      './assets/data/WHO-COVID-19-global-data.csv'
    )

    const restructured = JSON.stringify(restructureData(rawDataJSON))

    fs.writeFile('./assets/data/rawData.json', restructured, (err) => {
      if (err) throw err
    })
  } catch (err) {
    console.error(err)
  }
})()
