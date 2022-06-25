import express from 'express'
import cors from 'cors'
// import * as OpenApiValidator from 'express-openapi-validator'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
const app = express()
app.use(express.json())
app.use(cors())

import routes from './routes'

app.use(routes)

const swaggerDocument = YAML.load(path.join(__dirname, 'api.yaml'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/* app.use(
  OpenApiValidator.middleware({
    apiSpec: './api.yaml',
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  }),
) */

const PORT = 4000

app.listen(PORT, ()=>console.log(`api working at ${PORT}`))
