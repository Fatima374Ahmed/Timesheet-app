// auth.ts
export const setToken = (token: string) => {
  sessionStorage.setItem("auth_token", token);
};

export const getToken = () => {
  return sessionStorage.getItem("auth_token");
};

export const removeToken = () => {
  sessionStorage.removeItem("auth_token");
};

export const isAuthenticated = () => {
  return !!getToken();
};