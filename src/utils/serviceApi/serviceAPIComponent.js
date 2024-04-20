import { API } from '../../config/apiConfig';

export async function getAllProducts(token, jsonValue) {
  try {
    const response = await fetch(API.ALL_PRODUCTS_DATA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonValue),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all products');
    }

    const data = await response.json();
    console.log('All Products API', data);
    return { data, error: undefined };
  } catch (error) {
    console.error('All Products API error', error);
    return { data: undefined, error };
  }
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

    if (!response.ok) {
      throw new Error('Failed to fetch all categories');
    }

    dataValue = await response.json();
    console.log('All Categories API', dataValue);
  } catch (error) {
    console.error('All Categories API error', error);
    errorValue = error;
  }

  return { data: dataValue, error: errorValue };
}

