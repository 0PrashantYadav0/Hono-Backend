import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html('<p>Good to go nice</p>')
})

export default app
