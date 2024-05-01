import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LogoutButton from './Logout';

function HeaderNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Paper Pilot</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/main/dashboard" >Dashboard</Nav.Link>
            <Nav.Link href="/main/data">Data insight</Nav.Link> 
          </Nav>
        </Navbar.Collapse>
        <LogoutButton className="ms-auto"/>
      </Container>
    </Navbar>
  );
}

export default HeaderNav;