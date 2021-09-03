const express = require('express')
const cors = require('cors') 

var http = require('http')
const bodyParser = require('body-parser')

const enms = require('./routers/enms')

const app = express()
// app.use(bodyParser.json())                                    
// app.use(bodyParser.urlencoded({ extended: false }))    
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))      
app.use(cors()) 
app.use('/api/enms', enms)


var httpServer = http.createServer(app)

httpServer.listen(3001,() => {
  console.log('HTTP Server running on port 3001...')
})