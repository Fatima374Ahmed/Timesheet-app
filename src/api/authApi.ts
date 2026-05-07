const mockUser = {
  email: "test@example.com",
  password: "Test@1234",
  token: "dummy_jwt_token_12345",
};

export const loginApi = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email === mockUser.email &&
        password === mockUser.password
      ) {
        resolve({ token: mockUser.token });
      } else {
        reject({ message: "Invalid email or password" });
      }
    }, 500); // simulate API delay
  });
};