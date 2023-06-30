const z = require('zod')

const { setProperties } = require('./utils')

const inputSchema = z.object({
  power: z.boolean().optional(),
  fanLevel: z.number().int().min(1).max(4).optional(),
  childLock: z.boolean().optional(),
  fanSpeed: z.number().int().min(1).max(100).optional(),
  swingMode: z.boolean().optional(),
  swingModeAngle: z.union([z.literal(30), z.literal(60), z.literal(90), z.literal(120), z.literal(140)]).optional(),
  // powerOffTime: [3, 1],
  buzzer: z.boolean().optional(),
  light: z.boolean().optional(),
  mode: z.union([z.literal('straight'), z.literal('natural')]).optional(),
  setMove: z.union([z.literal('left'), z.literal('right')]).optional(),
})

module.exports = RED => {
  function MiFan(config) {
    RED.nodes.createNode(this, config)

    const fan = RED.nodes.getNode(config.fan)

    this.on('input', async (msg, _send, done) => {
      const parsedMsg = inputSchema.parse(msg.payload)
      const device = await fan.getDevice()

      const { mode, setMove, ...props } = parsedMsg
      if (mode) {
        props.mode = mode === 'natural' ? 1 : 0
      }

      if (setMove) {
        props.setMove = setMove === 'left' ? 1 : 2
      }

      await setProperties(device, props)
      done()
    })
  }

  RED.nodes.registerType('mi-fan', MiFan)
}
