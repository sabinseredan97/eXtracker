import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "../api/axios";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const { data, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: () => isLoggedIn(),
    retry: false,
    /* staleTime: Infinity,
    cacheTime: Infinity, */
  });

  function login(username) {
    setUser(username);
  }

  async function logout() {
    axios.post("/users/logout", {});
    setUser(null);
  }

  useEffect(() => {
    if (!isError) {
      login(data);
    } else {
      logout();
    }
  }, [isError, data]);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
