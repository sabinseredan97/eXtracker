import { useState, useEffect, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories } from "../api/axios";
import { Spinner } from "react-bootstrap";

export const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const [itemsCategories, setItemsCategories] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categories(),
  });

  let content;
  if (isLoading) {
    content = (
      <div className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span>Loading...</span>
        </Spinner>
      </div>
    );
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  useEffect(() => {
    setItemsCategories(data);
  }, [data]);

  return (
    <>
      {!content ? (
        <CategoriesContext.Provider value={{ itemsCategories }}>
          {children}
        </CategoriesContext.Provider>
      ) : (
        content
      )}
    </>
  );
}
