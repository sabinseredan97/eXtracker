import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ExpensesCard(props) {
  return (
    <Card
      style={{ width: props.width, backgroundColor: props.bgColor }}
      className="mx-auto"
    >
      <Card.Img variant="top" src={props.imageSrc} />
      <Card.Body>
        <Card.Title className="text-white">{props.title}</Card.Title>
        <Card.Text className="text-white">{props.text}</Card.Text>
        <Link to={props.path}>{props.linkTxt}</Link>
      </Card.Body>
    </Card>
  );
}
