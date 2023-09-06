import { createContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "../api/axios";
import secureLocalStorage from "react-secure-storage";

const INITIAL_STATE = {
  loggedIn: JSON.parse(secureLocalStorage.getItem("loggedIn")) || false,
  user: JSON.parse(secureLocalStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(INITIAL_STATE.loggedIn);
  const [username, setUsername] = useState(INITIAL_STATE.user);

  const { data, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: () => isLoggedIn(),
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    function updateState() {
      secureLocalStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      secureLocalStorage.setItem("user", JSON.stringify(username));
    }
    updateState();
  }, [username, loggedIn]);

  useEffect(() => {
    if (!isError) {
      setUsername(data);
      setLoggedIn(true);
    } else {
      setUsername(null);
      setLoggedIn(false);
    }
  }, [isError, data]);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
