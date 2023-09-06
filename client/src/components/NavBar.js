import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../context/AuthContext";
import defaultUserLogo from "../logo/defaultUserLogo.png";
axios.defaults.withCredentials = true;

export default function NavBar() {
  const { loggedIn, setLoggedIn, username, setUsername } =
    useContext(AuthContext);
  let navigate = useNavigate();

  async function logOut() {
    await axios.post("users/logout", {});
    setLoggedIn(false);
    setUsername(null);
    navigate("/login");
  }

  return (
    <div className="sticky-top">
      {loggedIn && (
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              eXtracker
            </Navbar.Brand>
            <Nav className="top-0 end-0">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown
                    id="nav-dropdown-dark collasible-nav-dropdown"
                    title={username}
                    menuVariant="dark"
                  >
                    <NavDropdown.Item as={Link} to="/profile/add-expenses">
                      Add expenses
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile/expenses">
                      My expenses
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile/expenses/graph">
                      Graph
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to={`/profile/${username}`}>
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
                    alt={username}
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
