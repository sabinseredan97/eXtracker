import { createContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const INITIAL_STATE = {
  loggedIn: JSON.parse(secureLocalStorage.getItem("loggedIn")) || false,
  user: JSON.parse(secureLocalStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(INITIAL_STATE.loggedIn);
  const [username, setUsername] = useState(INITIAL_STATE.user);

  useEffect(() => {
    function updatestate() {
      secureLocalStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      secureLocalStorage.setItem("user", JSON.stringify(username));
    }
    updatestate();
  }, [username, loggedIn]);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
