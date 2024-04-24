import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';



const Header = () => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [account, setAccount] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const account = localStorage.getItem('account');
    setAccount(JSON.parse(account));

    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItemCount(cartItems.length);
    };

    updateCartItemCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('account')
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('customer')
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Economic shop</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
        </Nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <a href={`/orderHistory/${account.id}`}>
                <button type='button' className="btn btn-success">Order History</button>
              </a>
            ) : (
              <>
              </>
            )}
          </Nav>
          <Nav className='ml-auto'>
            <a href="/verifyOrder">
              <button type="button" className="btn btn-primary">
                Cart({cartItemCount})
              </button>
            </a>
          </Nav>
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/auth/SignUp">Sign Up</Nav.Link>
                <Nav.Link href="/auth/SignIn">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
