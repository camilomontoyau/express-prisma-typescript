import express from 'express'
const app = express()
app.use(express.json())

const PORT = 4000

app.get('/ping', (_, res)=>{
  return res.send('here is your pong response!')
})

app.listen(PORT, ()=>console.log(`api working at ${PORT}`))
