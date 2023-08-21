import { useState, useEffect, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories } from "../api/axios";

export const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const [itemsCategories, setItemsCategories] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categories(),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
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
