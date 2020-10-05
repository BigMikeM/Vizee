// The structure of the data from WHO's website changed, so this function changes it back.
export default (rawData) => {
  const newObj = {}
  rawData.forEach((countryObj) => {
    if (newObj[countryObj.Country]) {
      newObj[countryObj.Country].push(countryObj)
    } else newObj[countryObj.Country] = [countryObj]
  })
  return newObj
}
