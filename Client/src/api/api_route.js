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
};

export default API_ROUTES;
