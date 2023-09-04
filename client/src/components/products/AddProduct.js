import { Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { CategoriesContext } from "../../context/CategoriesContext";
import { useContext } from "react";
import appBackground2 from "../../images/app-background-2.jpg";

export default function AddProduct() {
  const { itemsCategories } = useContext(CategoriesContext);

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

  return (
    <div
      className="text-center"
      style={{
        backgroundImage: `url(${appBackground2})`,
        height: "100vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {itemsCategories && (
        <Card style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <Card.Header className="text-white">Add expenses</Card.Header>
          <Card.Body>
            <Form
              id="productForm"
              className="d-flex flex-wrap"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mx-auto mt-2">
                <Form.Select size="lg" {...register("category")}>
                  {itemsCategories.allCategories.map((category) => {
                    return (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
              <div className="mx-auto mt-2">
                <Form.Control
                  id="product"
                  type="text"
                  size="lg"
                  placeholder="product"
                  {...register("product")}
                />
                <p className="text-danger">{errors.product?.message}</p>
              </div>
              <div className="mx-auto mt-2">
                <Form.Control
                  id="price"
                  type="text"
                  size="lg"
                  placeholder="price"
                  {...register("price")}
                />
                <p className="text-danger">{errors.price?.message}</p>
              </div>
              <div className="mx-auto mt-2">
                <Form.Select size="lg" {...register("currency")}>
                  <option value="ron">ron</option>
                </Form.Select>
                <p className="text-danger">{errors.currency?.message}</p>
              </div>
              <Button
                variant="primary"
                className="btn-lg mx-auto"
                type="submit"
              >
                Add
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
