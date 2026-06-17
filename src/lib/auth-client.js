
export const authClient = {
  // Saves your 7-day custom token string into localStorage upon successful login
  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  // Pulls the active token string so the Navbar can attach it to the request header
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // Completely wipes the token on Sign Out, reverting the Navbar back to the original buttons
  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
};