import axios from "axios";

const http = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

type Session = {
  body: {
    access_token: string;
  };
};

http.interceptors.request.use(
  async (config) => {
    // TODO: Really not sure how "secure" the below is as a solution
    // for added the authorization header

    // Get all keys out of local storage
    const keys = Object.keys(localStorage);
    // Determine which key is the Auth0 session
    const sessionKey = keys.find((key) => key.includes("auth0")) || "";
    // Grab the session
    const sessionData = localStorage.getItem(sessionKey);

    if (sessionData) {
      // Parse the session and set it as the Authorization bearer
      const session: Session = JSON.parse(sessionData);
      config.headers.Authorization = `Bearer ${session.body.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
