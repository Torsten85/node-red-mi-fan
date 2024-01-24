const properties = {
  power: [2, 1],
  fanLevel: [2, 2],
  childLock: [7, 1],
  fanSpeed: [2, 6],
  swingMode: [2, 4],
  swingModeAngle: [2, 5],
  powerOffTime: [3, 1],
  buzzer: [5, 1],
  light: [4, 1],
  mode: [2, 3],
  setMove: [6, 1],
}

const setOnlyProperties = ['setMove']

function withRetry(createPromise, retries = 3) {
  return createPromise().catch(error => {
    if (retries > 1) {
      return withRetry(createPromise, retries - 1)
    }
    throw error
  })
}

module.exports = {
  withRetry,

  setProperties(device, props) {
    const did = device.id.replace(/^miio:/, '')

    const mappedProps = Object.entries(props)
      .filter(([propertyName]) => !setOnlyProperties.includes(propertyName))
      .map(([propertyName, propertyValue]) => ({
        did,
        siid: properties[propertyName][0],
        piid: properties[propertyName][1],
        value: propertyValue,
      }))

    return device.call('set_properties', mappedProps)
  },
  async getAllProperties(device) {
    const did = device.id.replace(/^miio:/, '')
    const allProperties = Object.values(properties).map(([siid, piid]) => ({
      did,
      siid,
      piid,
    }))
    const response = await device.call('get_properties', allProperties)
    return Object.fromEntries(Object.keys(properties).map((propertyName, index) => [propertyName, response[index].value]))
  },
}
