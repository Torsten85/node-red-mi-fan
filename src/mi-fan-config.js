const miio = require('miio')

module.exports = RED => {
  function MiFanConfig(config) {
    RED.nodes.createNode(this, config)

    const devicePromise = miio.device({ address: config.ip, token: config.token })
    this.getDevice = () => devicePromise

    this.on('close', async done => {
      const device = await this.getDevice()
      device.destroy()
      done()
    })
  }
  RED.nodes.registerType('mi-fan-config', MiFanConfig)
}
