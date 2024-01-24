const { getAllProperties, withRetry } = require('./utils')

module.exports = RED => {
  function MiFanStatus(config) {
    RED.nodes.createNode(this, config)

    const fan = RED.nodes.getNode(config.fan)

    this.on('input', async (_msg, send, done) => {
      let device
      try {
        device = await withRetry(() => fan.getDevice())
      } catch (error) {
        done(error)
        return
      }

      let payload
      try {
        payload = await withRetry(() => getAllProperties(device))
      } catch (error) {
        done(error)
        return
      }
      send({
        payload,
      })

      done()
    })
  }

  RED.nodes.registerType('mi-fan-status', MiFanStatus)
}
