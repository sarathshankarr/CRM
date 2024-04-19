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

export async function getAllCategories(token) {
  let dataValue = undefined;
  let errorValue = undefined;

  try {
    const response = await fetch(API.ALL_CATEGORIES_DATA, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      dataValue = await response.json();
      console.log('All Categories API', dataValue);
    } else {
      errorValue = await response.text();
      console.error('All Categories API error', errorValue);
    }
  } catch (error) {
    console.error('All Categories API error', error);
    errorValue = error;
  }

  return { data: dataValue, error: errorValue };
}
