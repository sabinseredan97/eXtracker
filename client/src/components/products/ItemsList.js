import { Table, Button } from "react-bootstrap";
import trash from "../../logo/trash.svg";

export default function ItemsList(props) {
  if (props.items.length === 0) {
    return <p className="text-center">Nothing here</p>;
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        {props.category ? (
          <tbody>
            {props.items
              .filter((product) => props.category === product.category.name)
              .map((filteredProduct) => {
                return (
                  <tr key={filteredProduct.id}>
                    <td>{filteredProduct.name}</td>
                    <td>{filteredProduct.category.name}</td>
                    <td>
                      {filteredProduct.price} {filteredProduct.currency}
                    </td>
                    <td>
                      {filteredProduct.createdAt.substring(
                        0,
                        filteredProduct.createdAt.indexOf("T")
                      )}
                    </td>
                    <td>
                      <Button
                        className="delete-poduct-btn"
                        onClick={() => props.delete(filteredProduct.id)}
                        variant="danger"
                      >
                        <img className="trash" src={trash} alt="delete" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        ) : (
          <tbody>
            {props.items.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>
                    {product.price} {product.currency}
                  </td>
                  <td>
                    {product.createdAt.substring(
                      0,
                      product.createdAt.indexOf("T")
                    )}
                  </td>
                  <td>
                    <Button
                      className="delete-poduct-btn"
                      onClick={() => props.delete(product.id)}
                      variant="danger"
                    >
                      <img className="trash" src={trash} alt="delete" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </Table>

      {/* <ListGroup>
      {props.items.map((product) => {
        return (
          <ListGroupItem key={product.id}>
            {product.name}
            <Button
              className="delete-poduct-btn"
              onClick={() => props.delete(product.id)}
              variant="danger"
            >
              <img className="trash" src={trash} alt="delete" />
            </Button>
            <p>
              Price: {product.price} {product.currency} Categoty:{" "}
              {product.category.name}
            </p>
          </ListGroupItem>
        );
      })}
    </ListGroup> */}
    </>
  );
}
