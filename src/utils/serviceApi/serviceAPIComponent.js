import {API} from '../../config/apiConfig';

export async function getAllProducts(token,jsonValue) {

    let dataValue = undefined;
    let errorValue = undefined;

    await fetch(API.ALL_PRODUCTS_DATA,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        console.log('All Products API ',data)
        dataValue = data;
       
    }).catch((error) => {
        console.log('All Products API error ',error)
        errorValue = error;
    });

    let returnObj = {data : dataValue, error : errorValue}
    return returnObj;

}