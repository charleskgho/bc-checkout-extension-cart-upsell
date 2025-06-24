const express = require('express')
const router = express.Router()

router.get('/getProduct/:productId', async (req, res) => {
    const productId = req.params.productId

    try {
        const response = await fetch(`https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}/variants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': `${process.env.API_ACCESS_TOKEN}`
            }     
        })

        // Extract the body of the response to JSON format. 
        // Note that despite the method being named json(), 
        // the result is not JSON but is instead the result 
        // of taking JSON as input and parsing it to produce a 
        // JavaScript object.
        const productData = await response.json()

        // Return the response as a JSON formatted String
        res.status(response.status).json(productData)

    } catch (err){
        console.error(err)
    }
})

router.get('/getProduct/image/:productId', async (req, res) => {
    const productId = req.params.productId
    
    try {
        const response = await fetch(`https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}/images`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': `${process.env.API_ACCESS_TOKEN}`
            }     
        })

        // Extract the body of the response to JSON format
        const productData = await response.json()

        console.log(productData)

        // Return the response as a JSON formatted String
        res.status(response.status).json(productData)

    } catch (err) {
        console.error(err)
    }

})

module.exports = router