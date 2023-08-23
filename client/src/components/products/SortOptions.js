import { Form } from "react-bootstrap";

export default function SortOptions(props) {
  let options = props.options;
  let showDefaultOption = props.defaultOption;
  return (
    <Form.Select
      style={{ width: "10rem" }}
      value={props.value}
      onChange={(e) => props.setOption(e.target.value)}
    >
      {showDefaultOption && (
        <option value="" key={props.defaultKey}>
          {props.defaultName}
        </option>
      )}
      {options.map((option) => {
        return (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        );
      })}
    </Form.Select>
  );
}
