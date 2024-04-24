import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9999/accounts')
      .then((res) => res.json())
      .then((result) => setAccounts(result));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const loggedInUser = accounts.find((acc) => acc.email === email && acc.password === password);
    localStorage.setItem('account', JSON.stringify(loggedInUser));
    if (loggedInUser) {
      localStorage.setItem('isLoggedIn', 'true');
      if (loggedInUser.role === 'admin') {
        navigate('/admin/products');
        window.location.reload();
      } else {
        navigate('/');
        window.location.reload();
      }
    } else {
      alert('Email or password is incorrect');
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Log in</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} style={{ width: "60%", margin: "auto", marginTop: "10px", marginBottom: "10px" }}>
            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password </Form.Label>
              <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Button type="submit" variant="success">Login</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;
