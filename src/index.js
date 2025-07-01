
export const initiateExtension = () => {
  //checkoutKitLoader.load('extension').then(function (module) {
  return checkoutKitLoader.load('extension').then(async function (module) {
    const params = new URL(document.location).searchParams;
    const extensionId = params.get('extensionId');
    const parentOrigin = params.get('parentOrigin');
    //const cartId = params.get('cartId');
    const cartId = '2c793329-d802-4e7d-9b31-0be7f9bca125'
    const extensionService = await module.initializeExtensionService({
      extensionId,
      parentOrigin,
      taggedElementId: 'root',
    });

    console.log('extension service instantiated!'); 
  
    // Return both as an object
    return {extensionService, cartId}
  })
}


