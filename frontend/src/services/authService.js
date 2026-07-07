import api from "./api";

const signup = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export default {
  signup,
  login,
};