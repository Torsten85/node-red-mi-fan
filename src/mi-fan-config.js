const miio = require('miio')

const { withRetry } = require('./utils')

module.exports = RED => {
  function MiFanConfig(config) {
    RED.nodes.createNode(this, config)

    let devicePromise = null

    this.getDevice = () => {
      if (devicePromise) {
        return devicePromise
      }

      console.info('Creating miio device')
      devicePromise = withRetry(() => miio.device({ address: config.ip, token: config.token }), Infinity)
      return devicePromise
    }

    this.on('close', async done => {
      if (devicePromise) {
        const device = await devicePromise
        devicePromise = null
        device.destroy()
      }
      done()
    })
  }
  RED.nodes.registerType('mi-fan-config', MiFanConfig)
}
