import React, { useEffect, useState } from 'react';
import { Container, Row, Table, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((result) => setProducts(result));

    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);

    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((result) => setCategories(result));
  }, []);


  useEffect(() => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      const price = ((item.price) + (item.price * item.vat) - (item.price * item.discount)) * item.quantity;
      totalPrice += price;
    });
    setTotalPrice(totalPrice);
  }, [cartItems]);



  const clearCart = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]);
    window.location.reload();
  };

  const handleCheckout = () => {
  
    navigate('/payment');

  };

  const removeFromLocalStorage = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    window.location.reload();
  };

  const increaseQuantity = (productId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const decreaseQuantity = (productId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId) {
        if (item.quantity === 1) {
          removeFromLocalStorage(productId); 
          return null; 
        } else {
          return { ...item, quantity: item.quantity - 1 }; 
        }
      }
      return item;
    }).filter(item => item !== null); 
    setCartItems(updatedCartItems);
  };
  

  return (
    <Container fluid>
      <Row>
        <Col xs={6}>
          <h1 style={{ textAlign: 'center' }}>Cart</h1>
        </Col>
        <Col xs={3} style={{ textAlign: "right" }}>
          <button type="button" className="btn btn-primary" onClick={clearCart}>Clear Cart</button>
        </Col>
        <Col xs={3} style={{ textAlign: "right" }}>
          <button type="button" className="btn btn-success" onClick={handleCheckout}>Checkout</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th style={{ width: '150px' }}>Image</th>
                <th>Category</th>
                <th>VAT</th>
                <th>Discount</th>
                <th style={{ width: '150px' }}>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.description}</td>
                  <td><img src={`${process.env.PUBLIC_URL}/assets/image/${p.image}`} style={{ maxWidth: '40%', height: 'auto' }} alt={p.name}></img></td>
                  <td>{categories && categories.find(c => c.id === p.category)?.name}</td>
                  <td>{(p.vat) * 100}%</td>
                  <td>{(p.discount) * 100}%</td>
                  <td>
                    <button type="button" className="btn btn-danger" onClick={() => decreaseQuantity(p.id)}>-</button>
                    {p.quantity || 1}

                    <button type="button" className="btn btn-primary" onClick={() => increaseQuantity(p.id)}>+</button>
                  </td>

                  <td>{((p.price) + (p.price * p.vat) - (p.price * p.discount)) * p.quantity}$</td>
                  <td><button type="button" className="btn btn-danger" onClick={() => removeFromLocalStorage(p.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col xs={12} style={{ textAlign: 'right' }}>
          <h4>Total Price:{totalPrice}$</h4>
        </Col>
      </Row>
    </Container>
  );
}
