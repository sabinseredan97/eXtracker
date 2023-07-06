import { createContext, useEffect, useReducer } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { authorization } from "../api/axios";
import { useQuery } from "@tanstack/react-query";

const INITIAL_STATE = {
  user: JSON.parse(secureLocalStorage.getItem("user")) || null,
  loggedIn: JSON.parse(secureLocalStorage.getItem("loggedIn")) || false,
  loading: false,
};

export const AuthContext = createContext(INITIAL_STATE);

function AuthReducer(state, action) {
  switch (action.type) {
    case "REGISTER_START":
      return {
        user: null,
        loggedIn: false,
        loading: true,
      };
    case "REGISTER_SUCCESS":
      return {
        user: null,
        loggedIn: false,
        loading: false,
      };
    case "REGISTER_FAILURE":
      return {
        user: null,
        loggedIn: false,
        loading: false,
      };
    case "LOGIN_START":
      return {
        user: null,
        loggedIn: false,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loggedIn: true,
        loading: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loggedIn: false,
        loading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        loggedIn: false,
        loading: false,
      };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const minute = 60000;
  const authorizeUser = useQuery({
    queryKey: ["authorization"],
    queryFn: authorization,
    refetchInterval: minute * 3,
    retry: false,
    enabled: state.loggedIn,
  });

  if (authorizeUser.isError && state.loggedIn) {
    logOut();
    window.location.reload();
  }

  useEffect(() => {
    function updatestate() {
      secureLocalStorage.setItem("loggedIn", JSON.stringify(state.loggedIn));
      secureLocalStorage.setItem("user", JSON.stringify(state.user));
    }
    updatestate();
  }, [state.loggedIn, state.user]);

  async function logOut() {
    await axios.post("/users/logout", { withCredentials: true });
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loggedIn: state.loggedIn,
        loading: state.loading,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
