import express from 'express'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())

const PORT = 4000

app.get('/ping', (_, res)=>{
  return res.send('here is your pong response!')
})

app.listen(PORT, ()=>console.log(`api working at ${PORT}`))
