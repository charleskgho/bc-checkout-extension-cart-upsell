
export const initiateExtension = () => {
    return checkoutKitLoader.load('extension').then(async function (module) {
    //return checkoutKitLoader.load('extension').then(function (module) {
    const params = new URL(document.location).searchParams;
    const extensionId = params.get('extensionId');
    const parentOrigin = params.get('parentOrigin');
    const cartId = params.get('cartId');
    //const cartId = 'e9549544-d903-4c8d-8dc1-d5dc13742a8f'
    const extensionService = await module.initializeExtensionService({
    //const extensionService = module.initializeExtensionService({
      extensionId,
      parentOrigin,
      taggedElementId: 'root',
    });

    console.log('extension service instantiated!'); 
  
    // Return both as an object
    return {extensionService, cartId}
  })
}


