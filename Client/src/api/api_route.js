// BiteRoute / Client / src / api / api_route.js;
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  AUTH: {
    AUTH_SIGNUP: `${BASE_URL}/api/auth/signup`,
    AUTH_SIGNIN: `${BASE_URL}/api/auth/signin`,
    AUTH_SIGNOUT: `${BASE_URL}/api/auth/signout`,
    AUTH_SEND_OTP: `${BASE_URL}/api/auth/send-otp`,
    AUTH_VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
    AUTH_RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
    AUTH_GOOGLE_AUTH: `${BASE_URL}/api/auth/google-auth`,
  },

  USER: {
    USER_GET: `${BASE_URL}/api/user/userget`,
    USER_UPDATE_LOCATION: `${BASE_URL}/api/user/update-location`,
  },

  SHOP: {
    SHOP_CREATE_EDIT: `${BASE_URL}/api/shop/create-edit`,
    SHOP_GET_MY: `${BASE_URL}/api/shop/get-shop`,
    SHOP_GET_BY_CITY: (city) => `${BASE_URL}/api/shop/get-shop-by-city/${city}`,
  },

  ITEM: {
    ITEM_ADD: `${BASE_URL}/api/item/add-item`,
    ITEM_UPDATE: (itemId) => `${BASE_URL}/api/item/update-item/${itemId}`,
    ITEM_GET_BY_ID: (itemId) => `${BASE_URL}/api/item/get-item/${itemId}`,
    ITEM_DELETE: (itemId) => `${BASE_URL}/api/item/delete-item/${itemId}`,
    ITEM_GET_BY_CITY: (city) =>
      `${BASE_URL}/api/item/get-item-shop-by-city/${city}`,
    ITEM_GET_BY_SHOP: (shopId) =>
      `${BASE_URL}/api/item/get-item-by-shop/${shopId}`,
    ITEM_SEARCH: (query, city) =>
      `${BASE_URL}/api/item/search-items?query=${query}&city=${city}`,
    ITEM_ADD_RATING: `${BASE_URL}/api/item/add-rating`,
  },

  ORDER: {
    ORDER_PLACE: `${BASE_URL}/api/order/place-order`,
    ORDER_VERIFY_PAYMENT: `${BASE_URL}/api/order/verify-payment`,
    ORDER_MY_GET: `${BASE_URL}/api/order/my-orders`,
    ORDER_UPDATE_STATUS: (orderId, shopId) =>
      `${BASE_URL}/api/order/update-status/${orderId}/${shopId}`,
    ORDER_GET_DELIVERYPERSON_ASSIGNMENTS: `${BASE_URL}/api/order/get-assignments`,
    ORDER_ACCEPT: (assignmentId) =>
      `${BASE_URL}/api/order/accept-order/${assignmentId}`,
    ORDER_GET_CURRENT: `${BASE_URL}/api/order/get-current-order`,
    ORDER_GET_BY_ID: (orderId) =>
      `${BASE_URL}/api/order/get-order-by-id/${orderId}`,
    ORDER_SEND_DELIVERY_OTP: `${BASE_URL}/api/order/send-delivery-otp`,
    ORDER_VERIFY_DELIVERY_OTP: `${BASE_URL}/api/order/verify-delivery-otp`,
    ORDER_GET_TODAY_DELIVERIES: `${BASE_URL}/api/order/get-today-deliveries`,
  },
};

export default API_ROUTES;
