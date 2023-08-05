import { Form, Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { categories } from "../../api/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProduct() {
  const schema = yup.object().shape({
    category: yup.string().required("Category is required!"),
    product: yup.string().max(25).required("Product is required!"),
    price: yup
      .number()
      .typeError("Price range is from 0.01 to 9999999.99")
      .min(0.01)
      .max(9999999.99)
      .required("Price is rquired"),
    currency: yup.string().required("Category is required!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    try {
      const response = await axios.post("products/add/product", data, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      document.getElementById("product").value = "";
      document.getElementById("price").value = "";
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

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

  return (
    <div>
      {!content ? (
        <Form id="productForm" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="d-flex flex-row mb-3">
              <div className="p-2 mt-3">
                <Form.Select size="lg" {...register("category")}>
                  {data.allCategories.map((category) => {
                    return (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
              <div className="d-flex flex-row mb-3">
                <div className="p-2 mt-3">
                  <Form.Control
                    id="product"
                    type="text"
                    size="lg"
                    placeholder="product"
                    {...register("product")}
                  />
                  <p className="text-danger">{errors.product?.message}</p>
                </div>
                <div className="p-2 mt-3">
                  <Form.Control
                    id="price"
                    type="text"
                    size="lg"
                    placeholder="price"
                    {...register("price")}
                  />
                  <p className="text-danger">{errors.price?.message}</p>
                </div>
                <div className="p-2 mt-3">
                  <Form.Select size="lg" {...register("currency")}>
                    <option value="ron">ron</option>
                  </Form.Select>
                  <p className="text-danger">{errors.currency?.message}</p>
                </div>
                <Button variant="primary" className="btn-lg" type="submit">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Form>
      ) : (
        content
      )}
    </div>
  );
}
