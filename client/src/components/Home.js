import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { username } = useContext(AuthContext);

  return (
    <div>
      <span>
        <h3>Hi {username}</h3> <p>You are Logged-in</p>
      </span>
    </div>
  );
}
