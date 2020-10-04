export default (rawData) => {
  const newObj = {}
  rawData.forEach((countryObj) => {
    if (newObj[countryObj.Country]) {
      newObj[countryObj.Country].push(countryObj)
    } else newObj[countryObj.Country] = [countryObj]
  })
  return newObj
}
