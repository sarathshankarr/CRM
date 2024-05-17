// apiConfig.js
export const BASE_URL = {
  SIT: 'https://crm.codeverse.co',
};

export const API = {
  LOGIN: BASE_URL.SIT + '/erpportal/oauth/token',
  LOCATION: BASE_URL.SIT + '/erpportal/api/style/cedge/getLocationInventory',
  ALL_PRODUCTS_DATA: BASE_URL.SIT + '/erpportal/api/style/findallstyles',
  ALL_CATEGORIES_DATA: BASE_URL.SIT + '/erpportal/api/category',
  STYLE_QUNTITY_DATA: BASE_URL.SIT + '/erpportal/api/style',
  ADD_ORDER_DATA: BASE_URL.SIT + '/erpportal/api/ordermgmt/adddistributororder',
  ADD_CUSTOMER_LIST: BASE_URL.SIT + '/erpportal/api/customers',
  GET_ALL_ORDER: BASE_URL.SIT + '/erpportal/api/ordermgmt/findAllDisOrders',
  GET_CUSTOMER_LOCATION: BASE_URL.SIT + '/erpportal/api/location/getLocationsAccCustomer',
  ADD_CUSTOMER_DETAILS:BASE_URL.SIT + '/erpportal/api/customers/addcustomer',
  ADD_CUSTOMER_LOCATION:BASE_URL.SIT +'/erpportal/api/location/addlocation',
  ADD_USERS: BASE_URL.SIT + '/erpportal/api/users',
  ADD_PRODUCT_INVENTORY: BASE_URL.SIT + '/erpportal/api/style/cedge/getMainInventory',
  ADD_LOCATION_INVENTORY: BASE_URL.SIT + '/erpportal/api/style/cedge/getLocationInventory'
};

export const USER_ID = 'adminClientId';
export const USER_PASSWORD = 'erpPortalAdmin';
