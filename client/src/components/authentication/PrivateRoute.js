import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  let content = (
    <div className="mt-5 text-center">
      <Spinner animation="border" role="status">
        Loading...
      </Spinner>
    </div>
  );

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  if (isLoading) {
    return content;
  } else {
    return user ? children : <Navigate to="/login" />;
  }
}
