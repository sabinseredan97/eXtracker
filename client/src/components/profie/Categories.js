import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/axios";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

export default function Categories() {
  const [value, setValue] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  const handleSelect = (e) => {
    console.log(e);
    setValue(e);
  };

  return (
    <>
      {!content ? (
        <div>
          <DropdownButton
            alignRight
            title="Dropdown right"
            id="dropdown-menu-align-right"
            onSelect={handleSelect}
          >
            {data.map((category) => {
              return (
                <Dropdown.Item eventKey={category.name}>
                  {category.name}
                </Dropdown.Item>
              );
            })}
            <Dropdown.Divider />
            <Dropdown.Item eventKey="some link">some link</Dropdown.Item>
          </DropdownButton>
        </div>
      ) : (
        content
      )}
    </>
  );
}
