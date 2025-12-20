import http from "./http-common";

const register = (data) => {
  
  return http.post("/api/register", data);
};

const login = (data) => {
  
  return http.post("/api/login", data);
};

const AuthService = {
  register,
  login,
};

export default AuthService;