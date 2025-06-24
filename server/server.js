if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
app.use(express.static('dist'))

const cartRouter = require('./routes/cart')
const productRouter = require('./routes/product')

const bodyParser = require('body-parser')
app.use(bodyParser.json()) // application/json

app.use((req, res, next) => {
    // allows any client access to this server from any client
    res.setHeader('Access-Control-Allow-Origin', '*')

    // allow client to perform methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')

    // allow client to specific content-type and authorization details in the header
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // call next to allow the request to continue
    next()
})

app.use('/api/cart', cartRouter)
app.use('/api/product', productRouter)
app.use('/', (req, res) =>  {
     res.send('Sorry, there was an issue loading the app')
})

app.listen(process.env.PORT || 3000, () => console.log('Server started'))