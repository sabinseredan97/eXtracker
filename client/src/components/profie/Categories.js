import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories } from "../../api/axios";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Form } from "react-bootstrap";

export default function Categories() {
  const [value, setValue] = useState("");

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

  const handleSelect = (e) => {
    setValue(e);
  };

  return (
    <>
      {!content ? (
        <Form>
          <div>
            <div className="d-flex flex-row mb-3">
              <div className="p-2">
                <DropdownButton
                  title="Category"
                  className="dropdown-menu-align-right"
                  onSelect={handleSelect}
                >
                  {data.allCategories.map((category) => {
                    return (
                      <Dropdown.Item key={category.id} eventKey={category.name}>
                        {category.name}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
              </div>
              <div className="p-2">
                <Form.Control type="text" size="lg" disabled value={value} />
              </div>
            </div>
          </div>
        </Form>
      ) : (
        content
      )}
    </>
  );
}
