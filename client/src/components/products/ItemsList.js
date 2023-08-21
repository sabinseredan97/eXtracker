import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import trash from "../../logo/trash.svg";

export default function ItemsList(props) {
  if (props.items.length === 0) {
    return <p className="text-center">Nothing here</p>;
  }

  return (
    <ListGroup>
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
    </ListGroup>
  );
}
