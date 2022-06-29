import express from 'express'
import cors from 'cors'
import * as OpenApiValidator from 'express-openapi-validator'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
const app = express()
app.use(express.json())
app.use(cors())

import errorHandler from './util/error.handler'
import routes from './routes'




const apiSpec = YAML.load(path.join(__dirname, 'api.yaml'))
console.log(JSON.stringify({apiSpec}, null, 2))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

const openApiMiddleware = OpenApiValidator.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true,
  validateApiSpec: true,
})

app.use(openApiMiddleware)

app.use(errorHandler) //

app.use(routes)

const PORT = 4000

app.listen(PORT, ()=>console.log(`api working at ${PORT}`))
