import { useState, useEffect, useRef } from 'react'
import UpsellImage from './UpsellImage'
import './UpsellItem.css'

export default function UpsellItem({id, name, price, addNewUpsell}) {
    const [product, setProduct] = useState({productId: id, quantity: 1, hasOption: false})
    const [options, setOptions] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [selectedOption, setSelectedOption] = useState('')
   
    // Array of product options [{id: variantId, label: labelName}]
    var newOptions = []

    useEffect(() => {
        // Fetch product options
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/product/getProduct/${id}`)
                const productData = await response.json()
                //console.log(productData)
    
                for (let i = 0; i < productData.data.length; i++) {
                    // Check if product has options
                    if (productData.data[i].option_values.length > 0) {
                        newOptions[i] = {id: productData.data[i].id, label: productData.data[i].option_values[0].label}
                    }
                }

            } catch (err) {
                console.error(err)
            }
        }
        /* fetchData() is an async fucntion, so we need to wait for it to 
        complete so that we get all the options available from the fetch before 
        calling setOptions(). 
        */
        fetchData().then(() => {
            //console.log(JSON.stringify(newOptions))

            /*
            https://react.dev/learn/updating-arrays-in-state

            Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array.
            */
            // setOptions(newOptions) // this works as well
            setOptions([...options, ...newOptions])
        })
    }, [])

    function handleOptionSelect(event) {
        //const {name, value} = event.target
        const {value} = event.target

        // User has selected a product option, pass-in the variantId
        if (value !== "") {
            // setProduct({
            //     productId: id,
            //     variantId: value,
            //     quantity: 1, 
            //     hasOption: true
            // })
            setProduct({
                ...product, 
                quantity: quantity,
                variantId: value,
                hasOption: true
            })
            setSelectedOption(value)
        }

        // User has not selected a product option, no variantId
        if (value === '') {
            setProduct({
                ...product,
                productId: id, 
                quantity: quantity,
                hasOption: true
            })
        }

    }

    function handleQuantityChange(event) {
        const {value} = event.target
        if (value.length !== 0) {
            setQuantity(value)
            setProduct({
                ...product, 
                quantity: value
            })
        }
    }

    function reset() {
        setSelectedOption("")
        setQuantity(1)
        setProduct({
            ...product, 
            quantity: quantity
        })
    }
    
    return (   
        <div className="upsell-item-container">
            <div className="upsell-item-content">
                <UpsellImage productId={id} />
                <div className="upsell-item-details">
                    <div className="upsell-title-row">
                        <div className="upsell-item-text">
                            {name} <br /> 
                            <span className="upsell-item-price">${price}</span>
                        </div>
                    </div>
                    
                    {/*
                    If the product has options, then render them in a dropdown select
                    */}
                    <div className="select-option-container">
                        {options.length > 0 ? (
                        <select name="variantId" value={selectedOption} defaultValue="" onChange={handleOptionSelect}>
                            <option value="">Select</option>
                            {options.map(option => {
                                return (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                )
                            })}
                        </select>
                        ) : null}

                        <input type="number" inputmode="numeric" value={quantity} min="1" onChange={handleQuantityChange} />

                        <button className="add-button-inline" onClick={() => addNewUpsell(product)} onMouseUp={() => reset()}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}   

