import express from 'express'
import cors from 'cors'
import * as OpenApiValidator from 'express-openapi-validator';
const app = express()
app.use(express.json())
app.use(cors())

app.use(
  OpenApiValidator.middleware({
    apiSpec: './api.yaml',
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  }),
)

const PORT = 4000

app.get('/ping', (_, res)=>{
  return res.send('here is your pong response!')
})

app.listen(PORT, ()=>console.log(`api working at ${PORT}`))
