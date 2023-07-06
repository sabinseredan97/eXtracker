import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../context/AuthContext";
import defaultUserLogo from "../logo/defaultUserLogo.png";
axios.defaults.withCredentials = true;

export default function NavBar() {
  const { user, loggedIn, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();

  async function logOut() {
    await axios.post("users/logout", {});
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }

  return (
    <div>
      {loggedIn && (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Personal Project
            </Navbar.Brand>
            <Nav className="top-0 end-0">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown
                    id="nav-dropdown-dark collasible-nav-dropdown"
                    title={user}
                    menuVariant="dark"
                  >
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href={`/profile/${user}`}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <Button variant="link" onClick={logOut}>
                      Log out
                    </Button>
                  </NavDropdown>
                </Nav>
                <Nav.Item>
                  <img
                    className="userAvatar"
                    src={defaultUserLogo}
                    alt={user}
                  />
                </Nav.Item>
              </Navbar.Collapse>
            </Nav>
          </Container>
        </Navbar>
      )}
    </div>
  );
}
