const { getAllProperties } = require('./utils')

module.exports = RED => {
  function MiFanStatus(config) {
    RED.nodes.createNode(this, config)

    const fan = RED.nodes.getNode(config.fan)

    this.on('input', async (_msg, send, done) => {
      const device = await fan.getDevice()
      send({
        payload: await getAllProperties(device),
      })
      done()
    })
  }

  RED.nodes.registerType('mi-fan-status', MiFanStatus)
}
