import { useState, useEffect } from 'react'

function UpsellImage({productId}) {
    const [imageURL, setImageURL] = useState("")

    var newImageURL = ''

    useEffect(() => {
        const fetchImage = async () => {
            try { 
                const imageVersion = 0
                const response = await fetch(`/api/product/getProduct/image/${productId}`)
                const productData = await response.json()

                if (productData.data.length > 1) {
                    newImageURL = productData.data[imageVersion].url_thumbnail
                }
                //console.log(newImageURL)
            } catch (err) {
                console.error(err)
            }    
        }
        fetchImage().then(() => {
            setImageURL(newImageURL)
        })

    }, [])   

    return (
        <>
             {/*
                   
                   
            {imageURL !== '' && <img className="upsell-item-image" src={imageURL} />} 

             */}

             <img className="upsell-item-image" src={imageURL} />
        </>
    )
}

export default UpsellImage