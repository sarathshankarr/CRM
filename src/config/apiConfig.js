export const BASE_URL = {
  SIT: 'https://crm.codeverse.co',
};

export const API = {
  LOGIN: BASE_URL.SIT + '/erpportal/oauth/token',
  LOCATION: BASE_URL.SIT + '/erpportal/api/style/cedge/getLocationInventory',
  STYLES:BASE_URL.SIT + '/erpportal/api/style',
  ALL_PRODUCTS_DATA:BASE_URL.SIT+'/erpportal/api/style/findallstyles',
  ALL_CATEGORIES_DATA:BASE_URL.SIT+'/erpportal/api/category'
};

export const USER_ID = 'adminClientId';
export const USER_PASSWORD = 'erpPortalAdmin';
