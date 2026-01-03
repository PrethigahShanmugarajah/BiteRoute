// Emplora / Client / src / api / api_route.js;
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  AUTH: {
    AUTH_SIGNUP: `${BASE_URL}/api/auth/signup`,
    AUTH_SIGNIN: `${BASE_URL}/api/auth/signin`,
    AUTH_SIGNOUT: `${BASE_URL}/api/auth/signout`,
  },
};

export default API_ROUTES;
