const express = require('express')
const router = express.Router()

router.put('/update/item/:cartId', async (req, res) => {
    const cartId = req.params.cartId
    const lineItem = {line_items: [
        {
            product_id: req.body.productId,
            variant_id: req.body.variantId,
            quantity: req.body.quantity
        }
    ]}

    try {
        const response = await fetch(`https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/carts/${cartId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Token': `${process.env.API_ACCESS_TOKEN}`
            },
            body: JSON.stringify(lineItem)      
        })

        // Extract the body of the response to JSON format
        const cartData = await response.json()

        // Return a response that contains the JSON data as body.
        res.status(response.status).json(cartData)

    } catch (err){
        console.error(err)
    }

})

module.exports = router