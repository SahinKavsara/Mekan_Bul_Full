import http from "./http-common";

const register = (data) => {
  // Backend'de yol '/users/register' olduğu için burayı güncelledik
  return http.post("/api/register", data);
};

const login = (data) => {
  // Backend'de yol '/users/login' olduğu için burayı güncelledik
  return http.post("/api/login", data);
};

const AuthService = {
  register,
  login,
};

export default AuthService;