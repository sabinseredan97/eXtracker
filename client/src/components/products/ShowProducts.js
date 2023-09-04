import { useEffect, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getTotalExpenses } from "../../api/axios";
import { toast } from "react-toastify";
import axios from "axios";
import ItemsList from "./ItemsList";
import SortOptions from "./SortOptions";
import { CategoriesContext } from "../../context/CategoriesContext";
import { Card, ListGroup, Table, Spinner, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import video1 from "../../videos/video-1.mp4";

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
  const [hideSort, setHideSort] = useState(true);

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

  function showSort() {
    setHideSort((current) => !current);
  }

  return (
    <>
      {!content ? (
        <div>
          <video src={video1} autoPlay loop muted />
          <section className="sortTable text-center">
            <Button
              className="d-md-none d-lg-none d-xl-none mt-3 mb-1"
              variant="outline-light"
              onClick={showSort}
            >
              {hideSort ? "show" : "hide"}
            </Button>
            <Table
              striped
              bordered
              className={
                hideSort
                  ? "text-white d-none d-md-block d-lg-block"
                  : "text-white"
              }
            >
              <thead>
                <tr className="d-flex flex-wrap">
                  <th className="mx-auto">
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
                  <th className="mx-auto">
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
                  <th className="mx-auto">
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
                  <th className="mx-auto d-flex flex-wrap">
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
                  <th className="mx-auto">
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
        </div>
      ) : (
        content
      )}
    </>
  );
}
