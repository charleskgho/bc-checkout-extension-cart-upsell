import { useEffect, useRef, useState, createContext } from 'react'
import Upsell from './components/Upsell'
import './App.css'
import products from './product.json'
import { initiateExtension } from './index.js'; // Path to the JS file

export const ExtensionServiceContext = createContext()

function App() {
  const productsOfferedForUpsell = useRef()
  const [cartId, setCartId] = useState(null) 
  const [upsell, setUpsell] = useState({})  // Product upsold
  const [allUpsell, setAllUpsell] = useState([]) // A list of all products upsold
  const [extensionService, setExtensionService] = useState(null)

  useEffect(() => {
    async function fetchExtension() {
      const value = await initiateExtension()
      setCartId(value.cartId)
      setExtensionService(value.extensionService)
    }
    fetchExtension()
  }, [])

  offerProductsForUpsell()
  console.log(`All upsells ${JSON.stringify(allUpsell)}`)

  // Call api to get the list of products for upselling
  function offerProductsForUpsell() {
    productsOfferedForUpsell.current = products
  }

  // Update state to reflect the list all successfull products upsold
  function updateAllUpsell() {
    setAllUpsell(currentList => ([
      ...currentList, upsell
    ]))
  }

  // Handle when the add button was clicked
  function addNewUpsell(product) {
      // It doesn't render child components (i.e. won't call render() method, if the product in setUpsell(product) has not changed (i.e. no state change)
      setUpsell(product)
  }

  return (
    <ExtensionServiceContext.Provider value={{extensionService, cartId}}>
      <div>
        <Upsell isGuest={true} productsOfferedForUpsell={productsOfferedForUpsell.current} upsell={upsell} allUpsell={allUpsell} addNewUpsell={addNewUpsell} updateAllUpsell={updateAllUpsell} />
      </div>
    </ExtensionServiceContext.Provider>
  )

}

export default App
