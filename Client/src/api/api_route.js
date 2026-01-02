// Emplora / Client / src / api / api_route.js;
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  AUTH: {
    AUTH_SIGNUP: `${BASE_URL}/api/auth/signup`,
  },
};

export default API_ROUTES;
