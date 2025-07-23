import { useState, useEffect, useRef } from 'react'
import UpsellImage from './UpsellImage'
import './UpsellItem.css'

export default function UpsellItem({id, name, price, addNewUpsell}) {
    const [product, setProduct] = useState({productId: id, quantity: 1, variantId: null, hasOption: false})
    const [options, setOptions] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [selectedOption, setSelectedOption] = useState('')
   
    // Format: [{id: variantId, label: labelName}]
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

        // Product option selected, set variantId
        if (value !== "") {
            setProduct({
                ...product, 
                quantity: quantity,
                variantId: value,
                hasOption: true
            })
            setSelectedOption(value)
        }

        // Product option no selected, assign null to the variantId
        if (value === '') {    
            setProduct({
                ...product,
                productId: id, 
                quantity: quantity,
                variantId: null,
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

    // called after the user clicks on the Add button
    function reset() {
        setSelectedOption("")
        setQuantity(1)
        setProduct({
            productId: id,
            quantity: 1,
            variantId: null,
            hasOption: options.length > 0
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

                        {/*
                        Trigger an event after the onClick event by using a callback function inside the onClick handler.
                        */}

                        <button className="add-button-inline" 
                                onClick={() => {
                                    addNewUpsell(product)
                                    reset()
                                }}
                        >Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}   

