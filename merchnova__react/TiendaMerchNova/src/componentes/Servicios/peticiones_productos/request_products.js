// #region ------------------------ Respuesta node ---------------------
/* Objeto response:
    {
        code: 0
        message: '...',
        data: {
            clientData: {nombreCompleto: '...'},
        }
    }
        */
//#endregion ------------------------------------------------------------
const URL_NODE = 'http://localhost:3000';

export const request_products = {
    get_products: async (url) => {
        const response = await fetch(`${URL_NODE}${url}`);
        return response.json();
    }
}

export const request_category = {
    get_categories: () => request_products.get_products('/api/products/Categorias')
}