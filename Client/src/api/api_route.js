// Emplora / Client / src / api / api_route.js;
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
  },
  ORDER: {
    ORDER_PLACE: `${BASE_URL}/api/order/place-order`,
    ORDER_MY_GET: `${BASE_URL}/api/order/my-orders`,
  },
};

export default API_ROUTES;
