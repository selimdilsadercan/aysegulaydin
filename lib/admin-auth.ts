const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "admin-authenticated";

export const adminAuth = {
  login: (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, "true");
      }
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "true";
  }
};
