import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <span>
        <h3>Hi {user}</h3> <p>You are Logged-in</p>
      </span>
    </div>
  );
}
