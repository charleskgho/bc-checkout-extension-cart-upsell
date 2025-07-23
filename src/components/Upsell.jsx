import {useEffect, useState, useContext} from 'react'
import UpsellItem from './UpsellItem'
import './Upsell.css'
import { ExtensionServiceContext } from '../App'

function Upsell({isGuest, productsOfferedForUpsell, upsell, addNewUpsell, allUpsell, updateAllUpsell}) {  
    const [shopperMessage, setShopperMessage] = useState('')
    const {extensionService, cartId } = useContext(ExtensionServiceContext)

    useEffect(() => {
        // Call api to update the cart when the shopper clicks the 'Add' button
        if (cartId) {
            //console.log(upsell)
            const fetchData = async () => {
                try {
                    // Check if the product has options     
                    if (upsell.hasOption) {
                        // No product option was selected
                        if (upsell.variantId === null) {
                            setShopperMessage(`Please select an option.`)
                            throw new Error(`No option was selected for product id: ${upsell.productId}`)
                        }
                    }

                    // Update the cart with the upsold product
                    const response = await fetch(`/api/cart/update/item/${cartId}`, {
                        method: 'PUT',
                        headers: {
                        'Content-Type':'application/json'
                        },
                        body: JSON.stringify( 
                            upsell
                        )
                    })
                    
                    if (!response.ok) {
                        const errorData = await response.json()
                        if (response.status === 422) {
                            if (upsell.variantId === null) {
                                setShopperMessage(`Please select an option.`)
                            } else {
                                // Out of stock message to show to the shopper
                                setShopperMessage(`Sorry, out of stock: ${upsell.variantId}`)
                            }
                        }
                        throw new Error(`${response.status} from updating cart id: ${cartId}. ${errorData.title}.`)
                    }

                    // No error, then show a nice message to the shopper
                    setShopperMessage(`Nice, we've added this to your cart`)

                    // JSON.stringify - converts a JavaScript object into a String
                    console.log(`Upsell product added to the cart: ${JSON.stringify(upsell)}`)

                    // Update list all successfull product upsells
                    updateAllUpsell()

                } catch (err) {
                    console.error(err)
                }
            }
            fetchData().then(() => {
                // Call Reload checkout
                console.log('Reload Checkout')
                extensionService.post({ 
                    type: 'EXTENSION:SHOW_LOADING_INDICATOR', 
                    payload: { show: true }, 
                })
                extensionService.post({ 
                    type: 'EXTENSION:RELOAD_CHECKOUT' 
                })
                //  extensionService.post({ 
                //     type: 'EXTENSION:RE_RENDER_SHIPPING_STEP' 
                // })
                extensionService.post({ 
                    type: 'EXTENSION:SHOW_LOADING_INDICATOR', 
                    payload: { show: false }, 
                })
            })
        }
    }, [upsell])

    return (
        <>
            <div className="upsell-title-container">
                <p className="upsell-title-text">You may also like these</p>
                <p>Discover more styles that complement your taste</p>
            </div>
            {productsOfferedForUpsell.data.map(product => 
                <UpsellItem 
                    key={product.id} 
                    id={product.id}
                    name={product.name} 
                    price={product.price}
                    addNewUpsell={addNewUpsell}
                />
            )}
            {shopperMessage !== '' && (<p>{shopperMessage}</p>)}
        
        </>
    )

}

export default Upsell