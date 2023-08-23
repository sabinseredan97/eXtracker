import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getTotalExpenses } from "../../api/axios";
import { toast } from "react-toastify";
import axios from "axios";
import ItemsList from "./ItemsList";
import SortOptions from "./SortOptions";
import { CategoriesContext } from "../../context/CategoriesContext";
import { useContext } from "react";
import { Card, ListGroup, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";

export default function ShowProductsSorted() {
  const { itemsCategories } = useContext(CategoriesContext);
  const [order, setOrder] = useState("DESC");
  const [column, setColumn] = useState("createdAt");
  const [category, setCategory] = useState("");
  const [totalExpPrice, setTotalExpPrice] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(endDate.getDate() - 3))
  );
  const todayDate = new Date();
  const yesterdayDate = new Date(new Date().setDate(todayDate.getDate() - 1));

  const {
    data: productsList,
    refetch: refetchExp,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [order + "-" + column + "-" + startDate + " -" + endDate],
    queryFn: () => getProducts(order, column, startDate, endDate),
  });

  const {
    data: pricesList,
    refetch: refetchPrices,
    isError: isPricesError,
    error: pricesError,
  } = useQuery({
    queryKey: ["expenses-" + startDate + "-" + endDate],
    queryFn: () => getTotalExpenses(startDate, endDate),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  async function deleteProduct(productId) {
    try {
      await axios.delete(`products/delete-one/${productId}`);
      refetchExp();
      refetchPrices();
    } catch (error) {
      toast.error(error.data.message);
    }
  }

  useEffect(() => {
    if (category && pricesList) {
      setTotalExpPrice(
        pricesList.categoryExpenses.filter(
          (categPrice) => category === categPrice.category.name
        )
      );
    } else if (pricesList) {
      setTotalExpPrice(pricesList.totalExpenses);
    }
  }, [category, pricesList]);

  return (
    <>
      {!content ? (
        <>
          <section className="sortTable">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    Order
                    <SortOptions
                      defaultOption={false}
                      options={[
                        { value: "ASC", name: "Ascending" },
                        { value: "DESC", name: "Descending" },
                      ]}
                      value={order}
                      setOption={setOrder}
                    />
                  </th>
                  <th>
                    Category
                    <SortOptions
                      defaultOption={true}
                      defaultName="All Categories"
                      defaultKey="catDefault"
                      options={itemsCategories.allCategories.map((category) => {
                        return { value: category.name, name: category.name };
                      })}
                      value={category}
                      setOption={setCategory}
                    />
                  </th>
                  <th>
                    Sort by
                    <SortOptions
                      defaultOption={false}
                      options={[
                        { value: "createdAt", name: "Date" },
                        { value: "price", name: "Price" },
                      ]}
                      value={column}
                      setOption={setColumn}
                    />
                  </th>
                  <th>
                    <span>From: </span>
                    <DatePicker
                      selectsStart
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      startDate={startDate}
                      maxDate={yesterdayDate}
                    />
                    <span> to: </span>
                    <DatePicker
                      selectsEnd
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      endDate={endDate}
                      startDate={startDate}
                      minDate={startDate}
                      maxDate={todayDate}
                    />
                  </th>
                  <th>
                    {totalExpPrice[0] && (
                      <Card style={{ width: "10rem" }}>
                        <ListGroup variant="flush">
                          <ListGroup.Item>Total spent</ListGroup.Item>
                          <ListGroup.Item>
                            {isPricesError
                              ? pricesError.message
                              : totalExpPrice[0].totalPrice}{" "}
                            ron
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    )}
                  </th>
                </tr>
              </thead>
            </Table>
          </section>
          <section>
            <ItemsList
              items={productsList}
              category={category}
              delete={deleteProduct}
            />
          </section>
        </>
      ) : (
        content
      )}
    </>
  );
}
